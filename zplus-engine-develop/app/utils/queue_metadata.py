from app.constants import (
    RMQ_JMETER_TASK_CONFIGURATIONS_QUEUE_NAME,
    RMQ_METASPLOIT_TASK_CONFIGURATIONS_QUEUE_NAME,
    RMQ_NMAP_TASK_CONFIGURATIONS_QUEUE_NAME,
    RMQ_OPENVAS_TASK_CONFIGURATIONS_QUEUE_NAME,
    RMQ_OWASPDEPENDENCY_TASK_CONFIGURATIONS_QUEUE_NAME,
    RMQ_OWASPZAP_TASK_CONFIGURATIONS_QUEUE_NAME,
    RMQ_SQLMAP_TASK_CONFIGURATIONS_QUEUE_NAME,
    TOOL_NAME_JMETER,
    TOOL_NAME_METASPLOIT,
    TOOL_NAME_NMAP,
    TOOL_NAME_OPENVAS,
    TOOL_NAME_OWASPDEPENDENCY,
    TOOL_NAME_OWASPZAP,
    TOOL_NAME_SQLMAP,
)


class QueueMetaData:
    def __init__(
        self,
        name: str,
        durable: bool,
        auto_delete: bool,
        exclusive: bool,
        no_wait: bool,
        args: any,
        tool_name: str,
    ):
        self.name = name
        self.durable = durable
        self.auto_delete = auto_delete
        self.exclusive = exclusive
        self.no_wait = no_wait
        self.args = args
        self.tool_name = tool_name

queue_meta_data_list=[
        QueueMetaData(
            RMQ_OPENVAS_TASK_CONFIGURATIONS_QUEUE_NAME,
            True,
            False,
            False,
            False,
            None,
            TOOL_NAME_OPENVAS,
        ),
        QueueMetaData(
            RMQ_NMAP_TASK_CONFIGURATIONS_QUEUE_NAME,
            True,
            False,
            False,
            False,
            None,
            TOOL_NAME_NMAP,
        ),
        QueueMetaData(
            RMQ_JMETER_TASK_CONFIGURATIONS_QUEUE_NAME,
            True,
            False,
            False,
            False,
            None,
            TOOL_NAME_JMETER,
        ),
        QueueMetaData(
            RMQ_METASPLOIT_TASK_CONFIGURATIONS_QUEUE_NAME,
            True,
            False,
            False,
            False,
            None,
            TOOL_NAME_METASPLOIT,
        ),
        QueueMetaData(
            RMQ_OWASPDEPENDENCY_TASK_CONFIGURATIONS_QUEUE_NAME,
            True,
            False,
            False,
            False,
            None,
            TOOL_NAME_OWASPDEPENDENCY,
        ),
        QueueMetaData(
            RMQ_OWASPZAP_TASK_CONFIGURATIONS_QUEUE_NAME,
            True,
            False,
            False,
            False,
            None,
            TOOL_NAME_OWASPZAP,
        ),
        QueueMetaData(
            RMQ_SQLMAP_TASK_CONFIGURATIONS_QUEUE_NAME,
            True,
            False,
            False,
            False,
            None,
            TOOL_NAME_SQLMAP,
        ),
    ]


def get_queue_meta_data_list() -> list[QueueMetaData]:
    return queue_meta_data_list
