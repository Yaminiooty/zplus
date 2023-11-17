from app.tasks.task import Task
from app.pipeline_configuration_metadata import PipelineConfigurationMetaData
from app.logger import log
from app import constants
from datetime import datetime, timezone
from pathlib import Path
import requests
import json

class MetaSploitScanTask(Task):

    def __init__(self, metasploit_env) -> None:
        super().__init__()
        self.metasploit_env = metasploit_env
        self.logger = log.get_logger(__name__)
    
    def perform(self, message, connection):
        try:
            self.logger.info("Metasploit scan task execution started")

            url = self.metasploit_env["rpc_api"]
            headers = {'Content-Type': 'application/json'}

            check_db_status_payload = {"jsonrpc": "2.0","method": "db.status","id": 1,"params": []}
            response = requests.post(url, headers=headers, data=json.dumps(check_db_status_payload))
            if response.status_code == 200:
                result = response.json()
                self.logger.info("Metasploit scan task :: RPC is working moving with task execution")
            else:
                raise Exception(f"Request failed with status code {response.status_code} RPC is not working")

            document_id = message.get("_id")
            configuration_id = message.get("configuration_id")
            pipeline_id = message.get("pipeline_id")
            email = message.get("email")
            tool_name = message.get("tool_name")
            status = message.get("status")
            configuration = message.get("configuration")
            pipeline_configuration = MetasploitPipelineConfigurationMetadata(
                document_id=document_id,
                configuration_id=configuration_id,
                pipeline_id=pipeline_id,
                email=email,
                tool_name=tool_name,
                status=status,
                configuration=configuration
            )
            self.logger.info("starting execution for metasploit scan task")

            # Run module with rpc
            run_module_payload = {"jsonrpc": "2.0","method": "module.execute","id": 1,"params": [pipeline_configuration.module_type,pipeline_configuration.module_fullname,pipeline_configuration.module_data]}
            response = requests.post(url, headers=headers, data=json.dumps(run_module_payload))
            if response.status_code == 200:
                result = response.json()
                self.logger.info("Metasploit scan task :: module execution started with RPC")
            else:
                raise Exception(f"Request failed with status code {response.status_code} module execution failed with RPC")
            uuid = result["result"]["uuid"]

            while True:
                check_execution_completion_status_payload = {"jsonrpc": "2.0","method": "module.running_stats","id": 1,"params": []}
                response = requests.post(url, headers=headers, data=json.dumps(check_execution_completion_status_payload))
                if response.status_code == 200:
                    result = response.json()
                    self.logger.info("Metasploit scan task :: got response for check completion status RPC call")
                else:
                    raise Exception(f"Request failed with status code {response.status_code} RPC call failed while getting completion status")
                if uuid in result["result"]["results"]:
                    break
                self.logger.info("Execution is in running or waiting state")
            
            # getting results and uploading in db
            get_execution_result_payload = {"jsonrpc": "2.0","method": "module.results","id": 1,"params": [uuid]}
            response = requests.post(url, headers=headers, data=json.dumps(get_execution_result_payload))
            if response.status_code == 200:
                result = response.json()
                self.logger.info("Metasploit scan task :: got response for final result RPC call")
            else:
                raise Exception(f"Request failed with status code {response.status_code} RPC call failed while getting final results")
            if result.get("result", False):
                final_result = result["result"]
            else:
                # Acknowledge failed result
                acknowledge_result_payload = {"jsonrpc": "2.0","method": "module.ack","id": 1,"params": [uuid]}
                response = requests.post(url, headers=headers, data=json.dumps(acknowledge_result_payload))
                if response.status_code == 200:
                    response.json()
                    self.logger.info("Metasploit scan task :: RPC execution acknowledged")
                else:
                    raise Exception(f"Request failed with status code {response.status_code} failed acknowledging RPC")
                raise Exception(str(json.dumps(result)))

            # Acknowledge result
            acknowledge_result_payload = {"jsonrpc": "2.0","method": "module.ack","id": 1,"params": [uuid]}
            response = requests.post(url, headers=headers, data=json.dumps(acknowledge_result_payload))
            if response.status_code == 200:
                result = response.json()
                self.logger.info("Metasploit scan task :: RPC execution acknowledged")
            else:
                raise Exception(f"Request failed with status code {response.status_code} failed acknowledging RPC")

            updated_status = constants.TOOL_PROCESSING_COMPLETED
            message = final_result

            connection.update_status_of_pipeline(
                document_id=pipeline_configuration.document_id,
                status=updated_status,
                results={
                    "report_files": pipeline_configuration.create_report(json.dumps(message)),
                    "json":self.process_json_data(data=message, tool_configurations=pipeline_configuration)
                },
                status_update_time_stamp=datetime.now(timezone.utc)
            )
            self.logger.info("Metasploit tool processing completed")
            return document_id
        except Exception as e:
            self.logger.exception('error in performing the task', str(e))
            connection.update_status_of_pipeline(
                document_id=pipeline_configuration.document_id,
                status=constants.TOOL_PROCESSING_FAILED,
                results={
                    "execution_error": str(e),
                },
                status_update_time_stamp=datetime.now(timezone.utc)
            )
            self.logger.error(
                "Tool Processing failed for Metasploit")
            return document_id
    
    def process_json_data(self, data, tool_configurations):
        result = {
            "exploit_type" : tool_configurations.module_type,
            "exploit_name" : tool_configurations.module_fullname,
            "status" : data["status"]
        }
        if result["status"] == "errored":
            result.update({ "result" : data["error"]})
        elif result["status"] == "completed":
            execution_result = data["result"]
            details = {}
            if execution_result:
                if execution_result.get("details", False):
                    details = execution_result["details"]
                else:
                    for key, value in execution_result.items():
                        if value.get("details", False):
                            for k, v in value.items():
                                details.update({ f"{key}_{k}" : v})
            result.update({ "result" : details})
        return result


class MetasploitPipelineConfigurationMetadata(PipelineConfigurationMetaData):
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
            document_id=document_id, configuration_id=configuration_id, pipeline_id=pipeline_id, email=email, tool_name=tool_name, status=status
        )
        configuration_dict = { item["Key"] : item["Value"] for item in configuration}

        self.module_type = configuration_dict["module_type"]
        self.module_fullname = configuration_dict["module_fullname"]
        self.module_data = { item["Key"] : item["Value"] for item in configuration_dict["module_data"]}

        self.logger = log.get_logger(__name__)

    def generate_command(self):
        commandList = ["./msfconsole", "-x"]

        commandList.append(f"\"use {self.module_fullname};")
        for key, value in self.module_data.items():
            commandList.append(f"set {key} {value};")
        commandList.append("run; exit\"")

        return " ".join(commandList)

    def create_report(self,data):
        self.logger.info("Started Creating Report")
        txt_report_name=f"{self.pipeline_id}_{self.tool_name}_report.txt"
        txt_report_path = Path(
                f".{constants.SECURITY_TOOL_RESULTS_FOLDER}/{self.tool_name}/", txt_report_name
            ).expanduser()
        txt_report_path.write_text(data)
        self.logger.info("Finished Creating Report")
        return {
            "TXT":txt_report_path.read_bytes(),
        }
