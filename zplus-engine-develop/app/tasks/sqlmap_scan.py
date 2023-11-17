import requests, json, time
from fpdf import FPDF
from pathlib import Path
from app.tasks.task import Task
from logging import Logger
import logging
from app.pipeline_configuration_metadata import PipelineConfigurationMetaData
from app.mongo.mongodb_connection import MongoDBConnection
from app.constants import (
    SQLMAP_REPORT_FORMAT_PDF,
    SQLMAP_NUMBER_OF_THREADS_HIGH,
    SQLMAP_NUMBER_OF_THREADS_LOW,
    SQLMAP_NUMBER_OF_THREADS_MEDIUM,
    SQLMAP_REPORT_FORMAT_TEXT,
    SQLMAP_TESTING_LEVEL_1,
    SQLMAP_TESTING_LEVEL_2,
    SQLMAP_TESTING_LEVEL_3,
    SQLMAP_TESTING_LEVEL_4,
    SQLMAP_TESTING_LEVEL_5,
    SQLMAP_TESTING_MODE_AUTOMATIC,
    SQLMAP_TESTING_MODE_MANUAL,
    TOOL_PROCESSING_COMPLETED,
    TOOL_PROCESSING_FAILED,
    SQLMAP_VERBOSITY_LEVEL_1,
    SQLMAP_VERBOSITY_LEVEL_2,
    SQLMAP_VERBOSITY_LEVEL_3,
    SQLMAP_VERBOSITY_LEVEL_4,
    SQLMAP_VERBOSITY_LEVEL_5,
    SQLMAP_VERBOSITY_LEVEL_6,
    SQLMAP_VERBOSITY_LEVEL_0,
    SECURITY_TOOL_ENGINE_SQLMAP_RESULTS_FOLDER,
)


class SqlmapScanTask(Task):
    def __init__(self, mongo_connection, sqlmap_env: dict, project_root_directory):
        self.sqlmap_uri = f"http://{sqlmap_env['host']}:{sqlmap_env['port']}"

        self.mongo_connection = mongo_connection
        self.logger = logging.getLogger(__name__)
        self.project_root_directory = project_root_directory

    def perform(self, message, connection):
        self.logger.info("Starting perform function from SqlMap scan task")

        document_id = message.get("_id")
        configuration_id = message.get("configuration_id")
        pipeline_id = message.get("pipeline_id")
        email = message.get("email")
        tool_name = message.get("tool_name")
        status = message.get("status")
        configuration = message.get("configuration")

        pipeline_config = SqlmapPipelineConfigurationMetadata(
            document_id,
            configuration_id,
            pipeline_id,
            email,
            tool_name,
            status,
            configuration,
            self.mongo_connection,
            self.logger,
            self.sqlmap_uri,
            self.project_root_directory,
        )

        pipeline_config.execute()


class SqlmapPipelineConfigurationMetadata(PipelineConfigurationMetaData):
    report_type_mapping = {
        0: "target",
        1: "techniques",
        2: "dbms_fingerprint",
        3: "banner",
        4: "current_user",
        5: "current_database",
        6: "hostname",
        7: "is_dba",
        8: "users",
        9: "passwords",
        10: "privileges",
        11: "roles",
        12: "databases",
        13: "tables",
        14: "columns",
        15: "schema",
        16: "count",
        17: "dump_table",
        18: "search",
        19: "sql_query",
        20: "common_tables",
        21: "common_columns",
        22: "file_read",
        23: "file_write",
        24: "os_cmd",
        25: "reg_read",
        26: "statements",
    }

    valid_testing_modes = {
        "Manual": SQLMAP_TESTING_MODE_MANUAL,
        "Automatic": SQLMAP_TESTING_MODE_AUTOMATIC,
    }

    valid_testing_levels = {
        "Level 1": SQLMAP_TESTING_LEVEL_1,
        "Level 2": SQLMAP_TESTING_LEVEL_2,
        "Level 3": SQLMAP_TESTING_LEVEL_3,
        "Level 4": SQLMAP_TESTING_LEVEL_4,
        "Level 5": SQLMAP_TESTING_LEVEL_5,
    }

    valid_verbosity_levels = {
        "Level 0": SQLMAP_VERBOSITY_LEVEL_0,
        "Level 1": SQLMAP_VERBOSITY_LEVEL_1,
        "Level 2": SQLMAP_VERBOSITY_LEVEL_2,
        "Level 3": SQLMAP_VERBOSITY_LEVEL_3,
        "Level 4": SQLMAP_VERBOSITY_LEVEL_4,
        "Level 5": SQLMAP_VERBOSITY_LEVEL_5,
        "Level 6": SQLMAP_VERBOSITY_LEVEL_6,
    }

    valid_number_Of_threads = {
        "Low": SQLMAP_NUMBER_OF_THREADS_LOW,
        "Medium": SQLMAP_NUMBER_OF_THREADS_MEDIUM,
        "High": SQLMAP_NUMBER_OF_THREADS_HIGH,
    }

    valid_report_format = {
        "PDF": SQLMAP_REPORT_FORMAT_PDF,
        "TXT": SQLMAP_REPORT_FORMAT_TEXT,
    }

    reverse_valid_report_format = {
        SQLMAP_REPORT_FORMAT_PDF: "pdf",
        SQLMAP_REPORT_FORMAT_TEXT: "txt",
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
        mongo_connection: MongoDBConnection,
        logger: Logger,
        sqlmap_uri,
        project_root_directory,
    ) -> None:
        super().__init__(
            document_id, configuration_id, pipeline_id, email, tool_name, status
        )

        self.mongo_connection = mongo_connection
        self.logger = logger

        self.sqlmap_uri = sqlmap_uri

        self.project_root_directory = project_root_directory

        configuration_dict = {item["Key"]: item["Value"] for item in configuration}

        self.target = configuration_dict["target"]
        self.testing_mode = self.valid_testing_modes[configuration_dict["testing_mode"]]
        self.testing_level = self.valid_testing_levels[
            configuration_dict["testing_level"]
        ]
        self.verbosity_level = self.valid_verbosity_levels[
            configuration_dict["verbosity_level"]
        ]
        self.check_for_additional_urls = configuration_dict["check_for_additional_urls"]
        self.test_forms = configuration_dict["test_forms"]
        self.cookies = configuration_dict["cookies"]

        self.headers = configuration_dict["headers"]

        self.headers = str(self.headers).replace("\n", "\\n")

        self.data = configuration_dict["data"]
        self.user_agent = configuration_dict["user_agent"]
        self.number_of_threads = self.valid_number_Of_threads[
            configuration_dict["number_of_threads"]
        ]

        self.exclude_system_databases = configuration_dict["exclude_system_databases"]
        self.current_session_user = configuration_dict["current_session_user"]
        self.current_database = configuration_dict["current_database"]
        self.enumerate_users = configuration_dict["enumerate_users"]
        self.enumerate_passwords = configuration_dict["enumerate_passwords"]
        self.enumerate_privileges = configuration_dict["enumerate_privileges"]
        self.enumerate_roles = configuration_dict["enumerate_roles"]
        self.enumerate_databases = configuration_dict["enumerate_databases"]
        self.enumerate_tables = configuration_dict["enumerate_tables"]
        self.enumerate_columns = configuration_dict["enumerate_columns"]
        self.enumerate_schemas = configuration_dict["enumerate_schemas"]
        self.report_format = self.valid_report_format[
            configuration_dict["report_format"]
        ]
        self.additional_comments = configuration_dict["additional_comments"]

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
        try:
            self.log_info("Started Processing of SqlMap Task")

            task_id = self.create_new_task()

            payload = self.create_payload()

            self.log_info("SqlMap Command Execution Started")

            self.start_task(task_id, payload)

            self.wait_for_task_to_finish(task_id)

            json_data, reports = self.create_json_report(task_id)

            self.execution_succeeded("Execution successful", reports, json_data)

            self.log_info("SqlMap Command Execution Finshed Sucessfully")

        except Exception as ex:
            self.execution_failed("Pipline Execution failed:", str(ex))
            self.log_error(f"Pipeline Execution failed: {str(ex)}")

    def create_new_task(self):
        response = requests.get(f"{self.sqlmap_uri}/task/new")
        json_body = response.json()

        success = json_body["success"]

        if success is False or response.status_code != 200:
            self.log_error(f"Unable to create New Task : {json_body}")
            raise Exception(f"Unable to create New Task {json_body}")

        task_id = json_body["taskid"]

        return task_id

    def create_payload(self):
        payload = {}

        payload["url"] = self.target

        payload["level"] = self.testing_level

        payload["verbose"] = self.testing_level

        if self.check_for_additional_urls:
            payload["crawlDepth"] = 2

        if self.test_forms:
            payload["forms"] = True

        if self.cookies is not None and len(self.cookies) > 0:
            payload["cookie"] = f'"{self.cookies}"'

        if self.headers is not None and len(self.headers) > 0:
            payload["headers"] = f'"{self.headers}"'

        if self.data is not None and len(self.data) > 0:
            payload["data"] = '"{self.data}"'

        if self.user_agent is not None and len(self.user_agent) > 0:
            payload["agent"] = f'"{self.user_agent}"'

        if self.exclude_system_databases is not None:
            payload["excludeSysDbs"] = True

        payload["threads"] = self.number_of_threads

        if self.testing_mode == SQLMAP_TESTING_MODE_AUTOMATIC:
            payload["getAll"] = True

        elif self.testing_mode == SQLMAP_TESTING_MODE_MANUAL:
            if self.current_session_user:
                payload["getCurrentUser"] = True

            if self.current_database:
                payload["getCurrentDb"] = True

            if self.enumerate_users:
                payload["getUsers"] = True

            if self.enumerate_passwords:
                payload["getPasswordHashes"] = True

            if self.enumerate_privileges:
                payload["getPrivileges"] = True

            if self.enumerate_roles:
                payload["getRoles"] = True

            if self.enumerate_databases:
                payload["getDbs"] = True

            if self.enumerate_tables:
                payload["getTables"] = True

            if self.enumerate_columns:
                payload["getColumns"] = True

            if self.enumerate_schemas:
                payload["getSchema"] = True

        self.log_info(f"Finished Creating Payload - {json.dumps(payload)}")

        return json.dumps(payload)

    def start_task(self, task_id, payload):
        response = requests.post(
            f"{self.sqlmap_uri}/scan/{task_id}/start",
            payload,
            headers={"Content-Type": "application/json"},
        )
        json_body = response.json()

        success = json_body["success"]

        if success is False or response.status_code != 200:
            self.log_error(f"Unable to start the task with id {task_id} : {json_body}")
            raise Exception(f"Unable to start the task with id {task_id} {json_body}")

    def wait_for_task_to_finish(self, task_id):
        valid_statuses = ["not running", "running"]
        current_status = "not running"
        while current_status in valid_statuses:
            response = requests.get(f"{self.sqlmap_uri}/scan/{task_id}/status")
            json_body = response.json()

            success = json_body["success"]

            if success is False or response.status_code != 200:
                self.log_error(
                    f"Error occurred during fetching status of task  {task_id} : {json_body}"
                )
                raise Exception(
                    f"Error occurred during fetching status of task {task_id} {json_body}"
                )

            current_status = json_body["status"]

            self.log_info(f"Task Status {task_id} : {current_status}")

            time.sleep(5)
        self.log_info("Task Finished.")

    def create_json_report(self, task_id):
        self.log_info("Started Creating report.")
        response = requests.get(f"{self.sqlmap_uri}/scan/{task_id}/data")
        json_body = response.json()

        success = json_body["success"]

        if success is False or response.status_code != 200:
            self.log_error(
                f"Unable to fetch data for the task  {task_id} : {json_body}"
            )
            raise Exception(f"Unable to fetch data for the task {task_id} {json_body}")

        data = json_body["data"]

        data = self.filter_json_data(data)

        self.log_info("Fetched the Data for the task.")

        json_report_name = f"{self.pipeline_id}_{self.tool_name}_report.json"
        json_report = Path(
            f"{self.project_root_directory}/{SECURITY_TOOL_ENGINE_SQLMAP_RESULTS_FOLDER}",
            json_report_name,
        ).expanduser()

        json_report.write_text(json.dumps(data, indent=4))

        return data, {"JSON": json_report.read_bytes()}

    def create_report(self, data):
        self.log_info("Started Creating Report")

        txt_report_name = f"{self.pipeline_id}_{self.tool_name}_report.txt"

        txt_report_path = Path(
            f"{self.project_root_directory}/{SECURITY_TOOL_ENGINE_SQLMAP_RESULTS_FOLDER}",
            txt_report_name,
        ).expanduser()
        txt_report_path.write_text(data)

        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=10)

        for line in txt_report_path.read_text().split("\n"):
            pdf.cell(50, 5, txt=line, ln=1)

        pdf_report_name = f"{self.pipeline_id}_{self.tool_name}_report.pdf"

        pdf_report_path = Path(
            f"{self.project_root_directory}/{SECURITY_TOOL_ENGINE_SQLMAP_RESULTS_FOLDER}",
            pdf_report_name,
        ).expanduser()

        pdf.output(str(pdf_report_path.absolute()))

        self.log_info("Finished Creating Report")

        return {
            "TXT": txt_report_path.read_bytes(),
            "PDF": pdf_report_path.read_bytes(),
        }

    def filter_json_data(self, data):
        result={}
        for obj in data:
            obj["type"]=self.report_type_mapping[obj["type"]]
            result[obj["type"]]=obj
        return result
