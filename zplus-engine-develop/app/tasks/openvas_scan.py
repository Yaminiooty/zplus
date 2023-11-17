from app.utils.XmlToJson import xml2json
from pathlib import Path
from base64 import b64decode
from app.constants import TOOL_PROCESSING_COMPLETED, TOOL_PROCESSING_FAILED,SECURITY_TOOL_ENGINE_OPENVAS_RESULTS_FOLDER
import time
import lxml.etree as et
from app.tasks.task import Task
import logging
from logging import Logger
from app.pipeline_configuration_metadata import PipelineConfigurationMetaData
from app.mongo.mongodb_connection import MongoDBConnection
from gvm.connections import UnixSocketConnection
from gvm.errors import GvmError
from gvm.protocols.gmp import Gmp
from gvm.transforms import EtreeTransform, EtreeCheckCommandTransform
from gvm.protocols.gmpv208 import *


class OpenVASScanTask(Task):
    def __init__(self, openvas_env: dict, mongo_connection,project_root_directory):
        self.socket_location = openvas_env["socket_location"]
        self.openvas_username = openvas_env["username"]
        self.openvas_password = openvas_env["password"]

        self.mongo_connection = mongo_connection
        self.logger = logging.getLogger(__name__)
        self.project_root_directory=project_root_directory

    def perform(self, message, connection):
        self.logger.info("Starting perform function from OpenVAS scan task")

        document_id = message.get("_id")
        configuration_id = message.get("configuration_id")
        pipeline_id = message.get("pipeline_id")
        email = message.get("email")
        tool_name = message.get("tool_name")
        status = message.get("status")
        configuration = message.get("configuration")

        pipeline_config = OpenVASPipelineConfigurationMetadata(
            document_id,
            configuration_id,
            pipeline_id,
            email,
            tool_name,
            status,
            configuration,
            self.socket_location,
            self.openvas_username,
            self.openvas_password,
            self.mongo_connection,
            self.logger,
            self.project_root_directory
        )

        pipeline_config.execute()


class OpenVASPipelineConfigurationMetadata(PipelineConfigurationMetaData):
    def __init__(
        self,
        document_id,
        configuration_id,
        pipeline_id,
        email,
        tool_name,
        status,
        configuration: list,
        socket_location,
        openvas_username,
        openvas_password,
        mongo_connection: MongoDBConnection,
        logger: Logger,
        project_root_directory
    ) -> None:
        super().__init__(
            document_id, configuration_id, pipeline_id, email, tool_name, status
        )

        self.socket_location = socket_location
        self.openvas_username = openvas_username
        self.openvas_password = openvas_password
        self.mongo_connection = mongo_connection
        self.logger = logger
        self.project_root_directory=project_root_directory
        
        configuration_dict = {item["Key"]: item["Value"] for item in configuration}

        self.target = configuration_dict["target"]
        self.port_range = {
            item["Key"]: item["Value"] for item in configuration_dict["port_range"]
        }
        self.scanner_type = configuration_dict["scanner_type"]
        self.scan_config = configuration_dict["scan_config"]
        self.no_of_concurrent_nvt_per_host = configuration_dict[
            "no_of_concurrent_nvt_per_host"
        ]
        self.no_of_concurrent_scanned_host = configuration_dict[
            "no_of_concurrent_scanned_host"
        ]
        self.report_format = configuration_dict["report_format"]
        self.additional_comment = configuration_dict["additional_comments"]

    def log_info(self, message):
        self.logger.info(f"{self.document_id} - {message}")

    def log_error(self, message):
        self.logger.error(f"{self.document_id} - {message}")

    def create_port_list(
        self,
        gmp: Gmp,
        name: str,
        port_range: str,
    ):
        response = gmp.create_port_list(name, port_range)

        return extract_attribute(response, ".", "id")

    def create_target(self, gmp, name, hosts: list[str], port_list_id: str):
        target = gmp.create_target(
            name=name,
            hosts=hosts,
            port_list_id=port_list_id,
            alive_test=AliveTest.SCAN_CONFIG_DEFAULT,
            reverse_lookup_only=False,
            reverse_lookup_unify=False,
        )

        return extract_attribute(target, ".", "id")

    def create_task(self, gmp: Gmp, name, target_id, scan_config_id, scanner_id):
        task = gmp.create_task(
            name=name,
            target_id=target_id,
            scanner_id=scanner_id,
            config_id=scan_config_id,
            alterable=False,
            hosts_ordering=HostsOrdering.SEQUENTIAL,
            preferences={
                "max_checks": self.no_of_concurrent_nvt_per_host,
                "max_hosts": self.no_of_concurrent_scanned_host,
            },
        )

        return extract_attribute(task, ".", "id")

    def get_scan_config_id_by_name(self, gmp, scan_config_name):
        config_list = gmp.get_scan_configs()

        return extract_attribute(
            config_list, "config/[name='" + scan_config_name + "']", "id"
        )

    def get_scanner_id_by_name(self, gmp, scanner_name):
        scanner_list = gmp.get_scanners()

        return extract_attribute(
            scanner_list, "scanner/[name='" + scanner_name + "']", "id"
        )

    def start_task(self, gmp, task_id):
        report = gmp.start_task(task_id)

        return extract_text(report, "report_id")

    def download_report(self, gmp, report_id):
        result={}
        
        response = gmp.get_report(
            report_id=report_id, report_format_id=ReportFormatType.PDF
        )
        result["PDF"]=self.write_pdf_report(response)

    
        response = gmp.get_report(
            report_id=report_id, report_format_id=ReportFormatType.XML
        )
        json_data,xml_report=self.write_xml_report(response)
        
        result["XML"]=xml_report

        response = gmp.get_report(
            report_id=report_id, report_format_id=ReportFormatType.TXT
        )
        
        result["TXT"]=self.write_text_report(response)
        return json_data,result

    def write_pdf_report(self, response):
        try:
            report_element = response.find("report")

            content = report_element.find("report_format").tail

            binary_base64_encoded_pdf = content.encode("ascii")

            binary_pdf = b64decode(binary_base64_encoded_pdf)

            pdf_path = Path(
                f"{self.project_root_directory}/{SECURITY_TOOL_ENGINE_OPENVAS_RESULTS_FOLDER}", f"{self.pipeline_id}_{self.tool_name}_report.pdf"
            ).expanduser()

            pdf_path.write_bytes(binary_pdf)

            return binary_pdf
        except Exception as ex:
            self.log_error("Error occurred while creating pdf report")
            raise ex

    def write_xml_report(self, response):
        try:
            report_element = response.find("report")

            xml_path = Path(
                f"{self.project_root_directory}/{SECURITY_TOOL_ENGINE_OPENVAS_RESULTS_FOLDER}", f"{self.pipeline_id}_{self.tool_name}_report.xml"
            ).expanduser()
            xml_data=et.tostring(report_element, pretty_print=True).decode()
            xml_path.write_text(xml_data)

            json_data=xml2json(xml_path)
            
            return json_data,xml_path.read_bytes()
        except Exception as ex:
            self.log_error("Error occurred while creating xml report")
            raise ex

    def write_text_report(self, response):
        try:
            report_element = response.find("report")

            content = report_element.find("report_format").tail

            binary_base64_encoded_text = content.encode("ascii")

            # decode base64
            decoded_binary = b64decode(binary_base64_encoded_text)

            txt_path = Path(
                f"{self.project_root_directory}/{SECURITY_TOOL_ENGINE_OPENVAS_RESULTS_FOLDER}", f"{self.pipeline_id}_{self.tool_name}_report.txt"
            ).expanduser()

            txt_path.write_text(decoded_binary.decode("utf-8"))

            return txt_path.read_bytes()
        except Exception as ex:
            self.log_error("Error occurred while creating text report")
            raise ex

    def cleanup(self, connection):
        transform = EtreeTransform()
        # Obtain all the respecive ids by using document id and delete them
        with Gmp(connection=connection, transform=transform) as gmp:
            gmp.authenticate(self.openvas_username, self.openvas_password)

            port_list_name = f"port_list_{self.document_id}"
            target_name = f"target_{self.document_id}"

            if self.scanner_type=="OpenVAS Default":

                task_name = f"task_{self.document_id}"

                task_id = (
                    gmp.get_tasks().find("task[name='" + task_name + "']").attrib["id"]
                )

                report_list = gmp.get_reports()
                report_id = report_list.find(
                    "report/task[@id='" + task_id + "']/.."
                ).attrib["id"]

                target_list = gmp.get_targets()
                target_id = target_list.find("target[name='" + target_name + "']").attrib[
                    "id"
                ]

                port_list = gmp.get_port_lists()
                port_list_id = port_list.find(
                    "port_list[name='" + port_list_name + "']"
                ).attrib["id"]

                try:
                    gmp.delete_report(report_id)
                except Exception as ex:
                    self.log_info(ex)

                try:
                    gmp.delete_task(task_id)
                except Exception as ex:
                    self.log_info(ex)

                try:
                    gmp.delete_target(target_id)
                except Exception as ex:
                    self.log_info(ex)

                try:
                    gmp.delete_port_list(port_list_id)
                except Exception as ex:
                    self.log_info(ex)
            else: 
                
                task_name_openvas_default = f"task_{self.document_id}_openvas_default"
                task_id_openvas_default = (
                    gmp.get_tasks().find("task[name='" + task_name_openvas_default + "']").attrib["id"]
                )

                report_list = gmp.get_reports()
                report_id_openvas_default = report_list.find(
                    "report/task[@id='" + task_id_openvas_default + "']/.."
                ).attrib["id"]
                
                task_name_cve = f"task_{self.document_id}_cve"
                task_id_cve = (
                    gmp.get_tasks().find("task[name='" + task_name_cve + "']").attrib["id"]
                )

                report_list = gmp.get_reports()
                report_id_cve = report_list.find(
                    "report/task[@id='" + task_id_cve + "']/.."
                ).attrib["id"]

                target_list = gmp.get_targets()
                target_id = target_list.find("target[name='" + target_name + "']").attrib[
                    "id"
                ]

                port_list = gmp.get_port_lists()
                port_list_id = port_list.find(
                    "port_list[name='" + port_list_name + "']"
                ).attrib["id"]

                try:
                    gmp.delete_report(report_id_openvas_default)
                except Exception as ex:
                    self.log_info(ex)
                    
                try:
                    gmp.delete_report(report_id_cve)
                except Exception as ex:
                    self.log_info(ex)

                try:
                    gmp.delete_task(task_id_openvas_default)
                except Exception as ex:
                    self.log_info(ex)
                try:
                    gmp.delete_task(task_id_cve)
                except Exception as ex:
                    self.log_info(ex)

                try:
                    gmp.delete_target(target_id)
                except Exception as ex:
                    self.log_info(ex)

                try:
                    gmp.delete_port_list(port_list_id)
                except Exception as ex:
                    self.log_info(ex)


    def execute(self):
        connection = UnixSocketConnection(path=self.socket_location,timeout=1800)
        transform = EtreeCheckCommandTransform()
        report_id = None
        task_id = None
        target_id = None
        port_list_id = None
        try:
            with Gmp(connection=connection, transform=transform) as gmp:
                gmp.authenticate(self.openvas_username, self.openvas_password)
                tcp_ports = ",".join([p for p in self.port_range["tcp"]])
                udp_ports = ",".join([p for p in self.port_range["udp"]])

                port_range = f"T:{tcp_ports},U:{udp_ports}"

                port_list_id = self.create_port_list(
                    gmp, f"port_list_{self.document_id}", port_range
                )

                target_id = self.create_target(
                    gmp, f"target_{self.document_id}", self.target, port_list_id
                )
                
                if self.scanner_type=="OpenVAS Default":

                    scan_config_id = self.get_scan_config_id_by_name(gmp, self.scan_config)
                    scanner_id = self.get_scanner_id_by_name(gmp, self.scanner_type)
                    task_id = self.create_task(
                        gmp,
                        f"task_{self.document_id}",
                        target_id,
                        scan_config_id,
                        scanner_id,
                    )

                    report_id=self.wait_for_task_to_finish(gmp,task_id)

                else:
        
                    scan_config_id = self.get_scan_config_id_by_name(gmp, self.scan_config)
                    scanner_id = self.get_scanner_id_by_name(gmp, "OpenVAS Default")
                    task_id = self.create_task(
                        gmp,
                        f"task_{self.document_id}_openvas_default",
                        target_id,
                        scan_config_id,
                        scanner_id,
                    )
                    
                    self.wait_for_task_to_finish(gmp,task_id)

                    scan_config_id = self.get_scan_config_id_by_name(gmp, self.scan_config)
                    scanner_id = self.get_scanner_id_by_name(gmp, "CVE")
                    task_id = self.create_task(
                        gmp,
                        f"task_{self.document_id}_cve",
                        target_id,
                        scan_config_id,
                        scanner_id,
                    )

                    
                    self.wait_for_task_to_finish(gmp,task_id)
                    
                    report_list = gmp.get_reports()
                    
                    report_id = report_list.find(
                        "report/task[@id='" + task_id + "']/.."
                    ).attrib["id"]
                
                self.log_info(f"Report Id {report_id}")

                json_data,report_meta = self.download_report(gmp, report_id)

                self.execution_succeeded(
                    report_meta=report_meta,
                    success_message="Scan Completed Successfully!",
                    json_data=json_data
                )

                self.log_info(f"Post Sucessful execution Clean Up Started")

                self.cleanup(connection)

                self.log_info(f"Post Sucessful execution Clean Up Finished")       
                    

        except Exception as ex:
            self.log_error(f"Pipline Execution Failed {str(ex)}")

            self.execution_failed(f"Pipline Execution Failed ", str(ex))

            self.log_info(f"Post Error Clean Up Started!")

            self.cleanup(connection)

            self.log_info(f"Post Error Clean Up Finished!")

    def filter_json_data(self,json_data):        
        result_per_host={}
        try:
            for result in json_data["report"]["report"]["results"]["result"]:
                host=result["host"]["#text"]
                if host not in list(result_per_host.keys()):
                    result_per_host[host]=[result]
                else:
                    result_per_host[host].append(result)
        except Exception as ex:
            self.log_error(f"Error occurred during filtering json {ex}")
            result_per_host["message"]="No Result Found"
            result_per_host["original_report"]=json_data
        return result_per_host
            
    
    def execution_failed(self, error_message, error_cause,json_data=None):
        self.log_error(error_message)
        document = {
            "status": TOOL_PROCESSING_FAILED,
            "results": {
                "execution_error": error_cause,
                "report_files": [],
                "execution_message": error_message,
                "json":json_data
            },
        }

        self.mongo_connection.update_status_of_pipeline(
            document_id=self.document_id, **document
        )

    def execution_succeeded(self, success_message, report_meta: list,json_data):
        document = {
            "status": TOOL_PROCESSING_COMPLETED,
            "results": {
                "execution_error": None,
                "report_files": report_meta,
                "execution_message": success_message,
                "json":json_data
            },
        }

        self.mongo_connection.update_status_of_pipeline(
            document_id=self.document_id, **document
        )

        self.log_info(success_message)

    def wait_for_task_to_finish(self,gmp,task_id):
        current_task_status = "New"

        report_id = self.start_task(gmp, task_id)

        while current_task_status != "Done":
            try:
                response = gmp.get_task(task_id)

                current_task_status = response.xpath("task/status")[0].text

                self.log_info(f"current scan status - {current_task_status}")

                if current_task_status not in [
                    "New",
                    "Requested",
                    "Queued",
                    "Running",
                    "Done",
                ]:
                    json_data,report_meta = self.download_report(gmp, report_id)
                    
                    self.execution_failed(f"Pipline Execution Failed ", "Task interuppted",json_data)
                    raise Exception(
                        f"Something Went Wrong During execution of Task . STATUS: {current_task_status}"
                    )

                time.sleep(5)
            except GvmError as err:
                gmp.authenticate(self.openvas_username, self.openvas_password)
                self.log_info(
                    f"Retrying...Error While getting current Task status - {str(err)}"
                )
            except Exception as ex:
                self.execution_failed(
                    "Error while fetching Scan status", str(ex)
                )
                raise Exception(
                    f"Error While getting current Task status - {str(ex)}"
                )
        return report_id

def print_response(lxml_element):
    print(et.tostring(lxml_element, pretty_print=True).decode())


def search_and_extract(lxml_element, search):
    return lxml_element.find(search).text


def extract_text(lxml_element, search):
    return lxml_element.find(search).text


def extract_attribute(lxml_element, search, attribute_name):
    return lxml_element.find(search).attrib[attribute_name]

