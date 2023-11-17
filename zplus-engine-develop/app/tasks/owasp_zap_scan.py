import json
from pathlib import Path
from app.tasks.task import Task
import logging
from app.pipeline_configuration_metadata import PipelineConfigurationMetaData
from app.mongo.mongodb_connection import MongoDBConnection
from app.utils.XmlToJson import replace_keys_without_at_sign
from logging import Logger
from app.constants import (
    TOOL_PROCESSING_FAILED,
    TOOL_PROCESSING_COMPLETED,
    ZAP_SPIDER_TYPE_TRADITIONAL,
    ZAP_SPIDER_TYPE_AJAX,
    ZAP_ATTACK_MODE_ATTACK,
    ZAP_ATTACK_MODE_PROTECTED,
    ZAP_ATTACK_MODE_SAFE,
    ZAP_ATTACK_MODE_STANDARD,
    ZAP_REPORT_FORMAT_HTML,
    ZAP_REPORT_FORMAT_PDF,
    ZAP_REPORT_FORMAT_JSON,
    ZAP_SCAN_TYPE_ACTIVE,
    ZAP_SCAN_TYPE_PASSIVE,
    SECURITY_TOOL_ENGINE_OWASP_ZAP_FOLDER,
)
import requests
import time
from urllib.parse import quote_plus


class OwaspZapScanTask(Task):
    def __init__(self, owasp_zap_env: dict, mongo_connection, project_root_directory):
        host = owasp_zap_env["host"]
        port = owasp_zap_env["port"]
        api_key = owasp_zap_env["api_key"]

        self.uri = f"http://{host}:{port}"
        self.apikey = api_key

        self.mongo_connection = mongo_connection
        self.logger = logging.getLogger(__name__)
        self.project_root_directory = project_root_directory

    def perform(self, message: dict, connection):
        document_id = message.get("_id")
        configuration_id = message.get("configuration_id")
        pipeline_id = message.get("pipeline_id")
        email = message.get("email")
        tool_name = message.get("tool_name")
        status = message.get("status")
        configuration = message.get("configuration")

        pipeline_config = OwaspZapPipelineConfigurationMetadata(
            document_id,
            configuration_id,
            pipeline_id,
            email,
            tool_name,
            status,
            configuration,
            self.uri,
            self.apikey,
            self.mongo_connection,
            self.logger,
            self.project_root_directory,
        )

        pipeline_config.execute()

        return document_id


class OwaspZapPipelineConfigurationMetadata(PipelineConfigurationMetaData):
    valid_scan_type = {
        "Passive Scan": ZAP_SCAN_TYPE_PASSIVE,
        "Active Scan": ZAP_SCAN_TYPE_ACTIVE,
    }

    valid_spider_type = {
        "Traditional Spider": ZAP_SPIDER_TYPE_TRADITIONAL,
        "Ajax Spider": ZAP_SPIDER_TYPE_AJAX,
    }

    valid_attack_mode = {
        "Safe Mode": ZAP_ATTACK_MODE_SAFE,
        "Standard Mode": ZAP_ATTACK_MODE_STANDARD,
        "Protected Mode": ZAP_ATTACK_MODE_PROTECTED,
        "Attack Mode": ZAP_ATTACK_MODE_ATTACK,
    }

    valid_report_format = {
        "HTML": ZAP_REPORT_FORMAT_HTML,
        "PDF": ZAP_REPORT_FORMAT_PDF,
        "JSON": ZAP_REPORT_FORMAT_JSON,
    }
    reverse_valid_report_format = {
        ZAP_REPORT_FORMAT_HTML: "HTML",
        ZAP_REPORT_FORMAT_PDF: "PDF",
        ZAP_REPORT_FORMAT_JSON: "JSON",
    }

    def __init__(
        self,
        document_id,
        configuration_id,
        pipeline_id,
        email,
        tool_name,
        status,
        configuration: list,
        zap_url,
        apikey,
        mongo_connection: MongoDBConnection,
        logger: Logger,
        project_root_directory,
    ) -> None:
        super().__init__(
            document_id, configuration_id, pipeline_id, email, tool_name, status
        )

        self.apikey = apikey
        self.zap_url = zap_url
        self.project_root_directory = project_root_directory

        configuration_dict = {item["Key"]: item["Value"] for item in configuration}

        self.target = configuration_dict["target"].strip("/")
        self.scan_type = self.valid_scan_type[configuration_dict["scan_type"]]
        self.spider_type = self.valid_spider_type[configuration_dict["spider_type"]]

        self.traditional_spider_options = configuration_dict[
            "traditional_spider_options"
        ]
        self.traditional_spider_options = {
            item["Key"]: item["Value"] for item in self.traditional_spider_options
        }

        self.attack_mode = self.valid_attack_mode[configuration_dict["attack_mode"]]
        self.authentication = configuration_dict["authentication"]
        self.login_url = configuration_dict["login_url"]
        self.username_parameter = configuration_dict["username_parameter"]
        self.password_parameter = configuration_dict["password_parameter"]
        self.username = configuration_dict["username"]
        self.password = configuration_dict["password"]
        self.logged_in_indicator = configuration_dict["logged_in_indicator"]
        self.policy_template = configuration_dict["policy_template"]
        self.report_format = self.valid_report_format[
            configuration_dict["report_format"]
        ]
        self.additional_comments = configuration_dict["additional_comments"]

        self.mongo_connection = mongo_connection
        self.logger = logger

    def log_info(self, message):
        self.logger.info(f"{self.document_id} - {message}")

    def log_error(self, message):
        self.logger.error(f"{self.document_id} - {message}")

    def zap_api_request(self, url: str, query_param: dict):
        query_string = "&".join(
            [f"{key}={value}" for key, value in query_param.items()]
        )

        response = requests.get(
            f"{self.zap_url}{url}?{query_string}&apikey={self.apikey}"
        )
        response_status = response.status_code
        response_body = response.json()

        return response_status, response_body

    def execution_failed(self, error_message, error_cause):
        self.log_error(error_message)
        document = {
            "status": TOOL_PROCESSING_FAILED,
            "results": {
                "execution_error": error_cause,
                "report_files": [],
                "execution_message": error_message,
                "json": None,
            },
        }

        self.mongo_connection.update_status_of_pipeline(
            document_id=self.document_id, **document
        )

    def execution_succeeded(self, success_message, report_names: list, json_data):
        document = {
            "status": TOOL_PROCESSING_COMPLETED,
            "results": {
                "execution_error": None,
                "report_files": report_names,
                "execution_message": success_message,
                "json": json_data,
            },
        }

        self.mongo_connection.update_status_of_pipeline(
            document_id=self.document_id, **document
        )

        self.log_info(success_message)

    def execute(self):
        context_id = -1
        user_id = -1
        try:
            self.log_info("Started Processing Message")

            context_id = self.create_context()

            self.add_target_url_to_context()

            time.sleep(1)

            self.set_zap_mode()
            time.sleep(2)

            if self.authentication:
                user_id = self.setup_authentication(context_id)

            if self.scan_type == ZAP_SCAN_TYPE_PASSIVE:
                self.passive_scan(self.spider_type)

            elif self.scan_type == ZAP_SCAN_TYPE_ACTIVE:
                self.active_scan(context_id)

            reports = {}
            
            reports.update(self.create_report(ZAP_REPORT_FORMAT_PDF))
            reports.update(self.create_report(ZAP_REPORT_FORMAT_HTML))
            json_data = self.create_report(ZAP_REPORT_FORMAT_JSON)

            json_data=self.filter_json_data(json_data)
            self.execution_succeeded(
                "Execution Successfully Completed", reports, json.loads(json_data)
            )

            self.log_info("Cleaning Up Post Successful Execution Started")

            self.cleanup(context_id, user_id)

            self.log_info("Cleaning Up Post Successful Execution Finished")

        except Exception as ex:
            self.log_error(f"Pipeline Execution Failed - {ex} ")

            self.execution_failed("Internal Server Error", str(ex))

            self.log_info("Cleaning Up Post Error")

            try:
                self.cleanup(context_id, user_id)

                self.log_info("Post Error Cleanup completed.")
            except Exception as ex:
                self.log_error(
                    f"Unable to clean up Post OWASP Zap Pipeline Failure - {ex} "
                )

    def active_scan(self, context_id):
        spider_url = "/JSON/spider/action/scan"
        query_params = {
            "url": quote_plus(self.target),
            "recurse": "true",
            "contextName": self.document_id,
        }

        status_code, body = self.zap_api_request(spider_url, query_params)

        if status_code != 200:
            self.execution_failed(
                "unable to start the spider to add the url to site tree ", body
            )
            raise Exception(
                "Unable to start the spider to add the url to site tree ", body
            )

        scan_id = body["scan"]

        self.log_info("Spider started to add url to site tree")

        time.sleep(1)
        status_code, body = self.zap_api_request(
            "/JSON/spider/action/stop", {"scanId": scan_id}
        )

        self.log_info(f"Spider stopped - scan id: {scan_id}")

        self.log_info(f"Added Url - {self.target} to site tree")

        status_code, body = self.zap_api_request(
            "/JSON/ascan/action/scan",
            {
                "url": quote_plus(self.target),
                "recurse": "true",
                "contextId": context_id,
            },
        )

        if status_code != 200:
            self.execution_failed("Unable to start the Active Scan", body)

            raise Exception("Unable to start the Active Scan", body)

        scan_id = body["scan"]

        self.log_info("Active Scan Started")
        self.log_info(f"Waiting For Active Scan to Finish {scan_id}")

        current_status = 0
        while current_status < 100:
            status_code, body = self.zap_api_request(
                "/JSON/ascan/view/status", {"scanId": scan_id}
            )
            if status_code != 200:
                self.execution_failed("Unable to get updated status of Full Scan", body)
                raise Exception("Unable to get updated status of Full Scan", body)
            else:
                current_status = int(body["status"])
                self.logger.info(
                    f"Current Active Scan status {scan_id} - {current_status}"
                )
            current_status = int(body["status"])
            time.sleep(2)

        self.log_info(f"Active Scan {scan_id} Finished")

    def cleanup(self, context_id, user_id):
        self.log_info("Clean Up Started")

        if self.authentication == True:
            self.delete_user(context_id, user_id)

        self.delete_context()

        self.log_info("Clean Up Finshed")

    def delete_user(self, context_id, user_id):
        status_code, body = self.zap_api_request(
            "/JSON/users/action/removeUser",
            {"contextId": context_id, "userId": user_id},
        )

        if status_code != 200:
            self.log_error(f"Unable to delete user {body}")

        else:
            self.log_info(f"Deleted User - user_id:{user_id}")

    def delete_context(self):
        status_code, body = self.zap_api_request(
            "/JSON/context/action/removeContext", {"contextName": self.document_id}
        )

        if status_code != 200:
            self.log_error(f"Unable to delete context {body}")

            raise Exception("Unable to delete context", body)

        self.log_info("Deleted Context")

    def create_context(self):
        self.log_info("Started Creating Context")

        status_code, body = self.zap_api_request(
            "/JSON/context/action/newContext/", {"contextName": self.document_id}
        )

        if status_code != 200:
            self.execution_failed("Unable to Set Up Context", body)

            raise Exception("Unable to Set Up Context", body)

        context_id = body["contextId"]

        self.log_info(f"Context {self.document_id} created - context_id:{context_id}")

        return context_id

    def add_target_url_to_context(self):
        status_code, body = self.zap_api_request(
            "/JSON/context/action/includeInContext",
            {"contextName": self.document_id, "regex": f"{self.target}.*"},
        )

        if status_code != 200:
            self.execution_failed("Unable to add tartget URL to context", body)

            raise Exception("Unable to add tartget URL to Context", body)

        self.log_info(f"Added the target -{self.target} to Context.")

    def set_zap_mode(self):
        status_code, body = self.zap_api_request(
            "/JSON/core/action/setMode", {"mode": self.attack_mode}
        )

        if status_code != 200:
            self.execution_failed("Unable to set zap mode", body)

            raise Exception("Unable to set zap mode", body)

        self.log_info(f"Updated Zap mode to {self.attack_mode}")

    def setup_authentication(self, context_id):
        login_url = quote_plus(self.login_url)
        loginRequestData = quote_plus(
            "username={%"
            + self.username_parameter
            + "%}"
            + "&"
            + "password={%"
            + self.password_parameter
            + "%}"
        )

        status_code, body = self.zap_api_request(
            "/JSON/authentication/action/setAuthenticationMethod",
            {
                "contextId": context_id,
                "authMethodName": "formBasedAuthentication",
                "authMethodConfigParams": f"loginUrl={login_url}&loginRequestData={loginRequestData}",
            },
        )

        if status_code != 200:
            self.execution_failed("Unable Authentication Method", body)

            raise Exception("Unable Authentication Method", body)

        self.log_info("Set the Authentication Method to Form Based Authentication")

        status_code, body = self.zap_api_request(
            "/JSON/authentication/action/setLoggedInIndicator/",
            {
                "contextId": context_id,
                "loggedInIndicatorRegex": f"\Q{quote_plus(self.logged_in_indicator)}\E",
            },
        )

        if status_code != 200:
            self.execution_failed("Unable to set logged in indicator", body)

            raise Exception("Unable to set logged in indicator", body)

        self.log_info("Set Logged In indicator.")

        status_code, body = self.zap_api_request(
            "/JSON/users/action/newUser/",
            {"contextId": context_id, "name": f"TEST_USER_{self.document_id}"},
        )

        if status_code != 200:
            self.execution_failed("Unable to Create Zap Test User", body)

            raise Exception("Unable to Create Zap Test User", body)

        user_id = body["userId"]

        self.log_info(f"Created User - user_id:{user_id}")

        auth_cred_config_params = quote_plus(
            f"username={self.username}&password={self.password}"
        )

        status_code, body = self.zap_api_request(
            "/JSON/users/action/setAuthenticationCredentials",
            {
                "contextId": context_id,
                "userId": user_id,
                "authCredentialsConfigParams": auth_cred_config_params,
            },
        )

        if status_code != 200:
            self.execution_failed("Unable to set credentials to Zap Test User", body)

            raise Exception("Unable to set credentials to Zap Test User", body)

        self.log_info("Set the Credentials to ZAP Test User")

        status_code, body = self.zap_api_request(
            "/JSON/users/action/setUserEnabled",
            {"contextId": context_id, "userId": user_id, "enabled": "true"},
        )

        if status_code != 200:
            self.execution_failed("Unable to Enable Zap Test User", body)

            raise Exception("Unable to Enable Zap Test User", body)

        self.log_info("Enabled ZAP Test User")

        status_code, body = self.zap_api_request(
            "/JSON/forcedUser/action/setForcedUserModeEnabled",
            {
                "boolean": "true",
            },
        )

        if status_code != 200:
            self.execution_failed("Unable enable Zap Forced User Mode", body)

            raise Exception("Unable Enable Zap Forced User Mode", body)

        self.log_info("Enabled Forced User Mode.")

        self.log_info("Authentication Setup Completed Sucessfully!")

        return user_id

    def passive_scan(self, spider_type: str):
        spider_url = None
        query_params = None

        if spider_type == ZAP_SPIDER_TYPE_TRADITIONAL:
            spider_url = "/JSON/spider/action/scan"
            query_params = {
                "url": quote_plus(self.target),
                "recurse": self.traditional_spider_options["recurse"],
                "maxChildren": self.traditional_spider_options["max_children"]
                if self.traditional_spider_options["recurse"] > 0
                else "",
                "contextName": self.document_id,
                "subTreeOnly": self.traditional_spider_options["sub_tree_only"],
            }
        elif spider_type == ZAP_SPIDER_TYPE_AJAX:
            spider_url = "/JSON/ajaxSpider/action/scan"
            query_params = {
                "url": quote_plus(self.target),
                "recurse": "true",
                "contextName": self.document_id,
                "subtreeOnly": "true",
            }
        status_code, body = self.zap_api_request(spider_url, query_params)

        if status_code != 200:
            self.execution_failed(
                f"Unable to start Passive scan with {spider_type}", body
            )

            raise Exception(f"Unable to start Passive scan with {spider_type}", body)

        time.sleep(2)

        if spider_type == ZAP_SPIDER_TYPE_TRADITIONAL:
            scan_id = body["scan"]
            self.wait_for_traditional_spider_to_finish(scan_id)

        elif spider_type == ZAP_SPIDER_TYPE_AJAX:
            self.wait_for_ajax_spider_to_finish()

    def wait_for_ajax_spider_to_finish(self):
        self.log_info("Started Ajax Spider")

        current_status = ""
        while current_status != "stopped":
            status_code, body = self.zap_api_request("/JSON/ajaxSpider/view/status", {})

            if status_code != 200:
                self.execution_failed(
                    "Unable to get current status of AJAX Spider", body
                )
                raise Exception("Unable to get current status of AJAX Spider", body)
            else:
                current_status = body["status"]
                self.logger.info(f"Current AJAX Spider status {current_status}")
            time.sleep(2)

        self.log_info("Finshed Ajax Spider")

        self.wait_for_passive_scan_to_finish()

    def wait_for_traditional_spider_to_finish(self, scan_id):
        self.log_info(
            f"Waiting for traditional spider to finish crawling {self.target}"
        )
        current_status = 0
        while current_status < 100:
            status_code, body = self.zap_api_request(
                "/JSON/spider/view/status", {"scanId": scan_id}
            )
            if status_code != 200:
                self.execution_failed(
                    f"Unable to get current status of Traditonal Spider Scan {scan_id}",
                    body,
                )

                raise Exception(
                    f"Unable to get current status of Traditonal Spider Scan {scan_id}",
                    body,
                )

            else:
                current_status = int(body["status"])
                self.log_info(
                    f"Current Traditional spider status {scan_id} - {current_status}"
                )
            time.sleep(2)

        time.sleep(1)

        self.log_info(f"Traditional spider to finished crawling {self.target}")

        self.wait_for_passive_scan_to_finish()

    def wait_for_passive_scan_to_finish(self):
        self.log_info("Waiting for Passive Scan to finish")
        records_to_scan = -1
        while records_to_scan != 0:
            status_code, body = self.zap_api_request(
                "/JSON/pscan/view/recordsToScan", {}
            )

            if status_code != 200:
                self.execution_failed(
                    "Unable to get updated recordsToScan of Passive Scan", body
                )

                raise Exception(
                    "Unable to get updated recordsToScan of Passive Scan", body
                )

            else:
                records_to_scan = int(body["recordsToScan"])
                self.logger.info(f"Current Passive scan status {records_to_scan}")
            time.sleep(2)

        self.log_info("Passive Scan to finished")


    def create_report(self,report_format):
        report_name = f"{self.pipeline_id}_{self.tool_name}_report"

        status_code, body = self.zap_api_request(
            "/JSON/reports/action/generate",
            {
                "title": report_name,
                "template": report_format,
                "contexts": self.document_id,
                "sites": self.target,
                "reportFileName": report_name,
            },
        )

        if status_code != 200:
            self.execution_failed(
                f"Unable to generate the {report_format} report", body
            )

            raise Exception(f"Unable to generate the {report_format} report", body)

        self.log_info(f" {report_format} report generated sucessfully! {body}")
        file_path = Path(
            f"{self.project_root_directory}/{SECURITY_TOOL_ENGINE_OWASP_ZAP_FOLDER}",
            f"{report_name}.{self.reverse_valid_report_format[report_format].lower()}",
        )

        if report_format == ZAP_REPORT_FORMAT_JSON:
            return file_path.read_text()

        return {
            f"{self.reverse_valid_report_format[report_format]}": file_path.read_bytes()
        }
    def filter_json_data(self,json_str):  
        json_data=json.loads(json_str)
        site_index=0          
        for site_data in json_data["site"]:
            alert_index=0
            for alert_data in site_data["alerts"]:
                alert_data.pop("instances")
                site_data["alerts"][alert_index]=alert_data
                alert_index=alert_index+1
                
            json_data["site"][site_index]=site_data
            site_index=site_index+1
        return  json.dumps(replace_keys_without_at_sign(json_data))
