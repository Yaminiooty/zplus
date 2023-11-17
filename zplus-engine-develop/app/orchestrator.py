import ray
import logging
from app.mongo.mongodb_connection import MongoDBConnection
from app.tasks.nmap_scan import NmapScanTask
from app.tasks.owasp_zap_scan import OwaspZapScanTask
from app.tasks.metasploit_scan import MetaSploitScanTask
from app.tasks.jmeter_scan import JmeterScanTask
from app.tasks.openvas_scan import OpenVASScanTask
from app.tasks.owasp_dependency_check_scan import OwaspDependencyCheckScanTask
from app.tasks.sqlmap_scan import SqlmapScanTask

from app.constants import (
    TOOL_NAME_JMETER,
    TOOL_NAME_METASPLOIT,
    TOOL_NAME_NMAP,
    TOOL_NAME_OPENVAS,
    TOOL_NAME_OWASPDEPENDENCY,
    TOOL_NAME_OWASPZAP,
    TOOL_NAME_SQLMAP,
)


@ray.remote
class Orchestrator:
    def __init__(
        self,
        owasp_zap_env: dict,
        mongo_db_env: dict,
        openvas_env: dict,
        sqlmap_env: dict,
        metasploit_env: dict,
        project_root_directory,
    ):
        self.project_root_directory = project_root_directory

        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        )

        self.mongo_connection = MongoDBConnection(mongo_db_env)
        self.logger = logging.getLogger(__name__)

        self.owasp_zap_env = owasp_zap_env
        self.openvas_env = openvas_env
        self.sqlmap_env = sqlmap_env
        self.metasploit_env = metasploit_env

    def process_message(self, message):
        try:
            task_type = message.get("tool_name")

            task = None

            if TOOL_NAME_NMAP == task_type:
                task = NmapScanTask()

            elif TOOL_NAME_JMETER == task_type:
                task = JmeterScanTask(
                    self.mongo_connection, self.project_root_directory
                )

            elif TOOL_NAME_METASPLOIT == task_type:
                task = MetaSploitScanTask(self.metasploit_env)

            elif TOOL_NAME_OPENVAS == task_type:
                task = OpenVASScanTask(
                    self.openvas_env, self.mongo_connection, self.project_root_directory
                )

            elif TOOL_NAME_OWASPDEPENDENCY == task_type:
                task = OwaspDependencyCheckScanTask()

            elif TOOL_NAME_OWASPZAP == task_type:
                task = OwaspZapScanTask(
                    self.owasp_zap_env,
                    self.mongo_connection,
                    self.project_root_directory,
                )

            elif TOOL_NAME_SQLMAP == task_type:
                task = SqlmapScanTask(
                    self.mongo_connection, self.sqlmap_env, self.project_root_directory
                )

            if task != None:
                document_id = task.perform(message, self.mongo_connection)
                self.logger.info(f"Processed message: {task_type} {document_id}")
            else:
                self.logger.warning(f"Unknown message type: {task_type}")
        except Exception as e:
            self.logger.error(f"Error processing message: {e}")
