from app.tasks.task import Task
from app.pipeline_configuration_metadata import PipelineConfigurationMetaData
from app.utils import DockerHelper, TextReportHelper, XmlToJson
from app import constants
from datetime import datetime, timezone
from app.logger import log
from pathlib import Path

class NmapScanTask(Task):
    def __init__(self) -> None:
        super().__init__()
        self.logger = log.get_logger(__name__)

    def perform(self, message, connection):
        try:
            self.logger.info("Nmap scan task execution started")
            document_id = message.get("_id")
            configuration_id = message.get("configuration_id")
            pipeline_id = message.get("pipeline_id")
            email = message.get("email")
            tool_name = message.get("tool_name")
            status = message.get("status")
            configuration = message.get("configuration")
            pipeline_config = NmapPipelineConfigurationMetadata(
                document_id=document_id,
                configuration_id=configuration_id,
                pipeline_id=pipeline_id,
                email=email,
                tool_name=tool_name,
                status=status,
                configuration=configuration,
            )
            self.logger.info("Starting command generation for Nmap scan task")
            command = pipeline_config.generate_command()
            self.logger.info("Nmap command execution starting")
            container_name = constants.CONTAINER_NMAP
            exit_code, output = DockerHelper.execute_command_in_container(
                container_name, command
            )
            self.logger.info("Nmap command execution finished")
            error = ""
            message = ""
            updated_status = ""
            if exit_code == 0:
                updated_status = constants.TOOL_PROCESSING_COMPLETED
                message = output
            else:
                updated_status = constants.TOOL_PROCESSING_FAILED
                error = output
            result_files = {}
            result_files.update({pipeline_config.output_format: Path(pipeline_config.result_file_name).read_bytes()})
            result_files.update({"TXT": Path(TextReportHelper.generate_text_report(full_file_path_with_extension=f"{pipeline_config.filename}.txt", file_data=output)).read_bytes()})
            connection.update_status_of_pipeline(
                document_id=pipeline_config.document_id,
                status=updated_status,
                results={
                    "execution_error": error,
                    "report_files": result_files,
                    "execution_message": message,
                    "executed_command": command,
                    "json": self.process_json_data(XmlToJson.xml2json(pipeline_config.xml_file))
                },
                status_update_time_stamp=datetime.now(timezone.utc),
            )

            self.logger.info("Nmap tool processing completed")
            return document_id
        except Exception as e:
            self.logger.exception(
                "Exception occurred while processing Nmap task : ", str(e)
            )
            connection.update_status_of_pipeline(
                document_id=pipeline_config.document_id,
                status=constants.TOOL_PROCESSING_FAILED,
                results={
                    "execution_error": str(e),
                },
                status_update_time_stamp=datetime.now(timezone.utc),
            )
            self.logger.error("Tool Processing failed for Nmap")
            return document_id

    def process_json_data(self, data):
        result = {}
        result.update({ "nmap_version" : data["nmaprun"]["version"] })
        result.update({ "statistics" : data["nmaprun"]["runstats"] })
        hosts = []
        no_of_hosts_scan = int(data["nmaprun"]["runstats"]["hosts"]["up"])
        if no_of_hosts_scan > 0:
            host_data = data["nmaprun"]["host"]
            if type(host_data) is dict:
                hosts.append(host_data)
            else:
                hosts = host_data
            for host in hosts:
                if type(host["ports"]["port"]) is dict:
                    host["ports"]["port"] = [host["ports"]["port"]]
        result.update({ "hosts" : hosts})
        return result


class NmapPipelineConfigurationMetadata(PipelineConfigurationMetaData):
    def __init__(
        self,
        document_id,
        configuration_id,
        pipeline_id,
        email,
        tool_name,
        status,
        configuration: list,
    ) -> None:
        super().__init__(
            document_id=document_id,
            configuration_id=configuration_id,
            pipeline_id=pipeline_id,
            email=email,
            tool_name=tool_name,
            status=status,
        )
        configuration_dict = {item["Key"]: item["Value"] for item in configuration}

        self.target = configuration_dict["target"]
        self.scan_type = configuration_dict["scan_type"]
        self.port = configuration_dict["port"]
        self.scan_timing = configuration_dict["scan_timing"]
        self.output_format = configuration_dict["output_format"]
        self.aggressive_scan = configuration_dict["aggressive_scan"]
        self.script_scan = configuration_dict["script_scan"]
        self.traceroute = configuration_dict["traceroute"]
        self.show_port_state_reason = configuration_dict["show_port_state_reason"]
        self.scan_all_ports = configuration_dict["scan_all_ports"]
        self.version_detection_intensity = configuration_dict[
            "version_detection_intensity"
        ]
        self.max_round_trip_timeout = configuration_dict["max_round_trip_timeout"]
        self.max_retries = configuration_dict["max_retries"]
        self.fragment_packets = configuration_dict["fragment_packets"]
        self.service_version_probe = configuration_dict["service_version_probe"]
        self.default_nse_scripts = configuration_dict["default_nse_scripts"]

        self.logger = log.get_logger(__name__)

    def generate_command(self):
        commandList = [constants.NMAP_START_COMMAND]
        commandList.append(self.target)
        # scan type
        if self.scan_type == "SYN Scan":
            commandList.append("-sS")
        elif self.scan_type == "TCP Connect Scan":
            commandList.append("-sT")
        elif self.scan_type == "UDP Scan":
            commandList.append("-sU")
        elif self.scan_type == "Comprehensive Scan":
            commandList.append("-sM")
        # Port
        # scan all ports
        if self.scan_all_ports:
            commandList.append("-p-")
        else:
            commandList.append(f"-p {self.port}")
        # scan timing
        if self.scan_timing == "Slowest":
            commandList.append("-T1")
        elif self.scan_timing == "Slow":
            commandList.append("-T2")
        elif self.scan_timing == "Normal":
            commandList.append("-T3")
        elif self.scan_timing == "Fast":
            commandList.append("-T4")
        elif self.scan_timing == "Fastest":
            commandList.append("-T5")
        # output format
        filename = f".{constants.SECURITY_TOOL_RESULTS_FOLDER}/{self.tool_name}/{self.pipeline_id}_{self.tool_name}_report"
        self.__setattr__("filename", filename)
        commandList.append("-oX")
        commandList.append(f"{filename}.xml")
        self.__setattr__("xml_file", f"{filename}.xml")
        if self.output_format == "XML":
            commandList.append("-oX")
            commandList.append(f"{filename}.xml")
            self.__setattr__("result_file_name", f"{filename}.xml")
        elif self.output_format == "Normal":
            commandList.append("-oN")
            commandList.append(f"{filename}.nmap")
            self.__setattr__("result_file_name", f"{filename}.nmap")
        elif self.output_format == "Grepable":
            commandList.append("-oG")
            commandList.append(f"{filename}.gnmap")
            self.__setattr__("result_file_name", f"{filename}.gnmap")
        # aggressive scan
        if self.aggressive_scan:
            commandList.append("-A")
        # script scan
        if self.script_scan == "Vulnerability Scripts":
            commandList.append("--script vuln")
        elif self.script_scan == "Default Scripts":
            commandList.append("--script default")
        elif self.script_scan == "Custom Scripts":
            commandList.append(f"--script {constants.NMAP_CUSTOM_SCRIPTS_FILE_PATH}")
        # traceroute
        if self.traceroute:
            commandList.append("--traceroute")
        # show port state reason
        if self.show_port_state_reason:
            commandList.append("--reason")
        # version detection intensity
        if self.version_detection_intensity == "Low":
            commandList.append("--version-light")
        elif self.version_detection_intensity == "Medium":
            commandList.append("--version-intensity 7")
        elif self.version_detection_intensity == "High":
            commandList.append("--version-all")
        # max round trip timeout (value is in millisecond)
        if self.max_round_trip_timeout:
            commandList.append(f"--max-rtt-timeout {self.max_round_trip_timeout}ms")
        # max retries
        if self.max_retries:
            commandList.append(f"--max-retries {self.max_retries}")
        # fragment packets
        if self.fragment_packets:
            commandList.append("-f")
        # service version probe
        if self.service_version_probe:
            commandList.append("-sV")
        # default nse scripts
        if self.default_nse_scripts:
            commandList.append("-sC")
        return " ".join(commandList)
