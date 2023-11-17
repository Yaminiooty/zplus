from pathlib import Path
from app.tasks.task import Task
from logging import Logger
import logging,json
from app.utils.csv_to_json import csv_to_json
from app.pipeline_configuration_metadata import PipelineConfigurationMetaData
from app.mongo.mongodb_connection import MongoDBConnection
from app.utils.DockerHelper import execute_command_in_container
from app.constants import JMETER_REPORT_FORMAT_HTML,JMETER_REPORT_FORMAT_PDF,TOOL_PROCESSING_FAILED,TOOL_PROCESSING_COMPLETED,CONTAINER_JMETER,SECURITY_TOOL_ENGINE_JMETER_REPORTS_FOLDER,SECURITY_TOOL_ENGINE_JMETER_INPUTS_FOLDER,SECURITY_TOOL_ENGINE_JMETER_LOGS_FOLDER
class JmeterScanTask(Task):
    def __init__(self, mongo_connection:MongoDBConnection,project_root_directory):
        self.mongo_connection = mongo_connection
        self.logger = logging.getLogger(__name__)
        self.project_root_directory=project_root_directory
        
    def perform(self, message, connection):
        self.logger.info("Starting perform function from Jmeter scan task")

        document_id = message.get("_id")
        configuration_id = message.get("configuration_id")
        pipeline_id = message.get("pipeline_id")
        email = message.get("email")
        tool_name = message.get("tool_name")
        status = message.get("status")
        configuration = message.get("configuration")
        
        pipeline_config = JmeterPipelineConfigurationMetadata(
            document_id,
            configuration_id,
            pipeline_id,
            email,
            tool_name,
            status,
            configuration,
            self.mongo_connection,
            self.logger,
            self.project_root_directory
        )

        pipeline_config.execute()

        
class JmeterPipelineConfigurationMetadata(PipelineConfigurationMetaData):
    valid_report_format={"HTML":JMETER_REPORT_FORMAT_HTML,"PDF":JMETER_REPORT_FORMAT_PDF}
    
    def __init__(self, document_id, configuration_id, pipeline_id, email, tool_name, status,
                 configuration:list,
                 mongo_connection: MongoDBConnection,
        logger: Logger,project_root_directory) -> None:
        super().__init__(document_id, configuration_id, pipeline_id, email, tool_name, status)
        
        self.mongo_connection = mongo_connection
        self.logger = logger
        self.project_root_directory=project_root_directory
        
        configuration_dict = {item["Key"]: item["Value"] for item in configuration}

        self.test_plan_file=configuration_dict["test_plan_file"]
        self.number_of_threads_udf=configuration_dict["number_of_threads_udf"]
        self.number_of_threads=configuration_dict["number_of_threads"]
        self.ramp_up_period_udf=configuration_dict["ramp_up_period_udf"]
        self.ramp_up_period=configuration_dict["ramp_up_period"]
        self.loop_count_udf=configuration_dict["loop_count_udf"]
        self.loop_count=configuration_dict["loop_count"]
        self.test_duration_udf=configuration_dict["test_duration_udf"]
        self.test_duration=configuration_dict["test_duration"]
        self.report_format=configuration_dict["report_format"]
        self.additional_comments=configuration_dict["additional_comments"]
    def log_info(self, message):
        self.logger.info(f"{self.document_id} - {message}")

    def log_error(self, message):
        self.logger.error(f"{self.document_id} - {message}")
        
    def execution_failed(self, error_message, error_cause):
        self.log_error(error_message)
        document = {
            "status": TOOL_PROCESSING_FAILED,
            "results": {
                "execution_error": error_cause,
                "report_files": [],
                "execution_message": error_message,
            },
        }

        self.mongo_connection.update_status_of_pipeline(
            document_id=self.document_id, **document
        )

    def execution_succeeded(self, success_message, report_names: list,json_data):
        document = {
            "status": TOOL_PROCESSING_COMPLETED,
            "results": {
                "execution_error": None,
                "report_files": report_names,
                "execution_message": success_message,
                "json":json_data
            },
        }

        self.mongo_connection.update_status_of_pipeline(
            document_id=self.document_id, **document
        )

        self.log_info(success_message)

        
    def execute(self):
        try:
            self.log_info("Started Processing of Jmeter Task")
            
            test_file_location=str(Path(SECURITY_TOOL_ENGINE_JMETER_INPUTS_FOLDER,f"{self.email}.jmx"))
            log_file_location=str(Path(SECURITY_TOOL_ENGINE_JMETER_LOGS_FOLDER,f"{self.pipeline_id}_{self.tool_name}_report.csv"))
            report_folder=str(Path(SECURITY_TOOL_ENGINE_JMETER_REPORTS_FOLDER))
            report_name=f"{self.pipeline_id}_{self.tool_name}_report"
            
            command_to_execute=self.create_command(test_file_location,log_file_location,report_folder,report_name)
            
            self.log_info("Jmeter Command Created.")
            self.log_info("Jmeter Command execution Started.")
            exit_code,output=execute_command_in_container(CONTAINER_JMETER,command_to_execute)
            
            if exit_code!=0:

                self.execution_failed("Something went wrong while executing the Jmeter Command.",output)
                
                raise Exception(f"Something went wrong while executing the Jmeter Command: {output}")
            
            json_data,report_data=self.create_report(report_folder,report_name)
            
            self.log_info("Reports Generated Sucessfully.")
            
            self.execution_succeeded(success_message="Execution Sucessful",report_names=report_data,json_data={
                'data':json_data
            })
            
            self.log_info(f"Jmeter Command execution Finished. Exit Code: {exit_code}")
            
        except Exception as ex:
            
            self.execution_failed("Pipline Execution failed:", str(ex))
            self.log_error(f"Pipeline Execution failed: {str(ex)}")
            
            self.log_error("Clean Up Post Execution Failed Started")
            
            cmd=f"bash -c 'cd {report_folder} && rm -rf {report_name} && rm ../logs/{report_name}.csv' && cd /"
            exit_code,output=execute_command_in_container(container_name=CONTAINER_JMETER,command=cmd)
            if exit_code!=0:
                self.execution_failed("Unable to cleanup.",output)
                    
                raise Exception(f"Unable to cleanup. {output}")
            self.log_error("Clean Up Post Execution Failed Finished")
            
            
        
    
    def create_command(self,test_file_location,log_file_location,report_folder,report_name):
        
        
        cmd=[f"jmeter.sh -n -t {test_file_location} -l {log_file_location} -e -o {report_folder}/{report_name} "]
        
        
        cmd.append(f"-J{self.number_of_threads_udf}={self.number_of_threads}")
        cmd.append(f"-J{self.ramp_up_period_udf}={self.ramp_up_period}")
        cmd.append(f"-J{self.loop_count_udf}={self.loop_count}")
        cmd.append(f"-J{self.test_duration_udf}={self.test_duration}")
        
        return " ".join(cmd)
        
        
    def create_report(self,report_folder,report_name):
        cmd=f"bash -c 'cd {report_folder} && zip -r {report_name}.zip {report_name}' && cd /"
        exit_code,output=execute_command_in_container(container_name=CONTAINER_JMETER,command=cmd)
        if exit_code!=0:
            self.execution_failed("Something went wrong while generating the Report.",output)
                
            raise Exception(f"Something went wrong while executing the Jmeter Command: {output}")
        
        report_path=Path(self.project_root_directory+SECURITY_TOOL_ENGINE_JMETER_REPORTS_FOLDER,f"{report_name}.zip")
        statistics_json_path=Path(self.project_root_directory+SECURITY_TOOL_ENGINE_JMETER_REPORTS_FOLDER,report_name,"statistics.json")
        json_data=json.loads(statistics_json_path.read_bytes())
        cmd=f"bash -c 'cd {report_folder} && rm -rf {report_name} && rm ../logs/{report_name}.csv' && cd /"
        exit_code,output=execute_command_in_container(container_name=CONTAINER_JMETER,command=cmd)
        if exit_code!=0:
            self.execution_failed("Something went wrong while clearing the Report.",output)
                
            raise Exception(f"Something went wrong while executing the Jmeter Command: {output}")
        
        
        return json_data,{
                "ZIP":report_path.read_bytes()
            }
            
        

