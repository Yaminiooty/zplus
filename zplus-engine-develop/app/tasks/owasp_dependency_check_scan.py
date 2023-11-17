from app.tasks.task import Task
from app.pipeline_configuration_metadata import PipelineConfigurationMetaData
from app.utils import DockerHelper, ReadJson
from app import constants
from datetime import datetime, timezone
from app.logger import log
from pathlib import Path


class OwaspDependencyCheckScanTask(Task):

    def __init__(self) -> None:
        super().__init__()
        self.logger = log.get_logger(__name__)

    def perform(self, message, connection):
        try:
            self.logger.info(
                "Owasp dependency check scan task execution started")
            document_id = message.get("_id")
            configuration_id = message.get("configuration_id")
            pipeline_id = message.get("pipeline_id")
            email = message.get("email")
            tool_name = message.get("tool_name")
            status = message.get("status")
            configuration = message.get("configuration")
            pipeline_config = OwaspDependencyCheckPipelineConfigurationMetadata(
                document_id=document_id,
                configuration_id=configuration_id,
                pipeline_id=pipeline_id,
                email=email,
                tool_name=tool_name,
                status=status,
                configuration=configuration
            )
            self.logger.info(
                "Starting command generation for Owasp dependency check scan task")
            command = pipeline_config.generate_command()
            container_name = constants.CONTAINER_OWASP_DEPENDENCY_CHECK
            self.logger.info(
                "Owasp dependency check command execution starting")
            exit_code, output = DockerHelper.execute_command_in_container(
                container_name, command)
            self.logger.info(
                "Owasp dependency check command execution finished")
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
            path_to_unzip_folder = f".{constants.SECURITY_TOOL_INPUTS_FOLDER}/{pipeline_config.email}_project_file"
            DockerHelper.execute_command_in_container(constants.CONTAINER_OWASP_DEPENDENCY_CHECK, f"rm -rf {path_to_unzip_folder}")
            if pipeline_config.scan_dependencies:

                DockerHelper.execute_command_in_container(constants.CONTAINER_OWASP_DEPENDENCY_CHECK, f"mv {pipeline_config.user_specific_result_folder}/dependency-check-report.json {pipeline_config.user_specific_result_folder}.json")
                DockerHelper.execute_command_in_container(constants.CONTAINER_OWASP_DEPENDENCY_CHECK, f"mv {pipeline_config.user_specific_result_folder}/dependency-check-report.html {pipeline_config.user_specific_result_folder}.html")
                DockerHelper.execute_command_in_container(constants.CONTAINER_OWASP_DEPENDENCY_CHECK, f"mv {pipeline_config.user_specific_result_folder}/dependency-check-report.{pipeline_config.output_format.lower()} {pipeline_config.user_specific_result_folder}.{pipeline_config.output_format.lower()}")
                DockerHelper.execute_command_in_container(constants.CONTAINER_OWASP_DEPENDENCY_CHECK, f"rm -rfv {pipeline_config.user_specific_result_folder}")

                result_files.update({pipeline_config.output_format: Path(pipeline_config.result_file_name).read_bytes()})
                result_files.update({"HTML": Path(pipeline_config.html_result_file_name).read_bytes()})
                path_to_unzip_folder = f".{constants.SECURITY_TOOL_INPUTS_FOLDER}/{pipeline_config.email}_suppress_cve_reports_file"
                DockerHelper.execute_command_in_container(constants.CONTAINER_OWASP_DEPENDENCY_CHECK, f"rm -rf {path_to_unzip_folder}")
            else:
                self.logger.warning(
                    "No scan performed and no report file updated in results as scan dependencies was not selected")
            connection.update_status_of_pipeline(
                document_id=pipeline_config.document_id,
                status=updated_status,
                results={
                    "execution_error": error,
                    "report_files": result_files,
                    "execution_message": message,
                    "executed_command": command,
                    "json": self.process_json_data(ReadJson.ReadJsonFile(f"{pipeline_config.user_specific_result_folder}.json"))
                },
                status_update_time_stamp=datetime.now(timezone.utc)
            )
            self.logger.info(
                "Owasp dependency check tool processing completed")
            return document_id
        except Exception as e:
            self.logger.exception(
                "Exception occurred while processing Owasp dependency check task : ", str(e))
            connection.update_status_of_pipeline(
                document_id=pipeline_config.document_id,
                status=constants.TOOL_PROCESSING_FAILED,
                results={
                    "execution_error": str(e),
                },
                status_update_time_stamp=datetime.now(timezone.utc)
            )
            self.logger.error(
                "Tool Processing failed for Owasp dependency check")
            return document_id
    
    def process_json_data(self, data):
        result = {
            "tool_version": data["scanInfo"]["engineVersion"],
            "time_stamp": data["projectInfo"]["reportDate"]
        }
        dependencies = []
        for dependency in data["dependencies"]:
            if dependency.get("vulnerabilities", False):
                res = {
                    "fileName": dependency["fileName"],
                    "description": dependency["description"],
                    "license": dependency["license"],
                    "vulnerabilities": dependency["vulnerabilities"],
                }
                dependencies.append(res)
        result.update({"dependencies": dependencies})
        return result


class OwaspDependencyCheckPipelineConfigurationMetadata(PipelineConfigurationMetaData):
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
        configuration_dict = {item["Key"]: item["Value"]
                              for item in configuration}

        self.output_format = configuration_dict["output_format"]
        self.scan_dependencies = configuration_dict["scan_dependencies"]
        self.scan_dev_dependencies = configuration_dict["scan_dev_dependencies"]
        self.suppress_cve_reports = configuration_dict["suppress_cve_reports"]
        self.suppress_update_check = configuration_dict["suppress_update_check"]
        self.additional_comments = configuration_dict["additional_comments"]
        self.user_specific_result_folder = f".{constants.SECURITY_TOOL_RESULTS_FOLDER}/{self.tool_name}/{self.pipeline_id}_{self.tool_name}_report"
        self.result_file_name = f".{constants.SECURITY_TOOL_RESULTS_FOLDER}/{self.tool_name}/{self.pipeline_id}_{self.tool_name}_report.{self.output_format.lower()}"
        self.html_result_file_name = f".{constants.SECURITY_TOOL_RESULTS_FOLDER}/{self.tool_name}/{self.pipeline_id}_{self.tool_name}_report.html"

        self.logger = log.get_logger(__name__)

    def generate_command(self):
        commandList = [constants.OWASP_DEPENDENCY_CHECK_START_COMMAND]
        # project directory
        path_to_zip_file = f".{constants.SECURITY_TOOL_INPUTS_FOLDER}/{self.email}_project_file.zip"
        path_to_unzip_folder = f".{constants.SECURITY_TOOL_INPUTS_FOLDER}/{self.email}_project_file"
        DockerHelper.execute_command_in_container(
            constants.CONTAINER_OWASP_DEPENDENCY_CHECK, f"rm -rf {path_to_unzip_folder}")
        unzip_project_exit_code, unzip_output = DockerHelper.execute_command_in_container(
            constants.CONTAINER_OWASP_DEPENDENCY_CHECK, f"unzip {path_to_zip_file} -d {path_to_unzip_folder}")
        if unzip_project_exit_code == 0:
            commandList.append(f"--scan {path_to_unzip_folder}")
        else:
            self.logger.error(
                "Not able to unzip project files so not able to update command")
            self.logger.error(str(unzip_output))
            raise Exception("Not able to unzip project files")
        # output format
        commandList.append(f"--format {self.output_format}")
        commandList.append(f"--format JSON")
        commandList.append(f"--format HTML")
        # scan dependencies
        if not self.scan_dependencies:
            commandList.append("--updateonly")
        # scan dev dependencies
        if not self.scan_dev_dependencies:
            commandList.append(
                "--nodeAuditSkipDevDependencies --nodePackageSkipDevDependencies")
        # suppress cve reports
        if self.suppress_cve_reports:
            path_to_zip_file = f".{constants.SECURITY_TOOL_INPUTS_FOLDER}/{self.email}_suppress_cve_reports_file.zip"
            path_to_unzip_folder = f".{constants.SECURITY_TOOL_INPUTS_FOLDER}/{self.email}_suppress_cve_reports_file"
            DockerHelper.execute_command_in_container(
                constants.CONTAINER_OWASP_DEPENDENCY_CHECK, f"rm -rf {path_to_unzip_folder}")
            unzip_suppressors_exit_code, unzip_suppressors_output = DockerHelper.execute_command_in_container(
                constants.CONTAINER_OWASP_DEPENDENCY_CHECK, f"unzip {path_to_zip_file} -d {path_to_unzip_folder}")
            if unzip_suppressors_exit_code == 0:
                ls_exit_code, ls_output = DockerHelper.execute_command_in_container(
                    constants.CONTAINER_OWASP_DEPENDENCY_CHECK, f"ls {path_to_unzip_folder}")
                if ls_exit_code == 0:
                    list_of_files = ls_output.split("\n")[:-1]
                    for file in list_of_files:
                        commandList.append(
                            f"--suppression {path_to_unzip_folder}/{file}")
                else:
                    self.logger.warning(
                        "Error occurred during listing files for suppression")
                    self.logger.info("Skipping suppressions")
            else:
                self.logger.error(
                    "Not able to unzip suppressor files so not able to update command")
                self.logger.error(unzip_suppressors_output)
                raise Exception("Not able to unzip suppressor files")
        # suppress update check
        if self.suppress_update_check:
            commandList.append("--noupdate")
        # generate report
        commandList.append(
            f"--out {constants.SECURITY_TOOL_RESULTS_FOLDER}/{self.tool_name}/{self.pipeline_id}_{self.tool_name}_report")
        return " ".join(commandList)
