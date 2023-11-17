package utils

import (
	"path/filepath"
	struct_errors "sec-tool/structs/errors"
)

var NOT_FOUND_ERROR = struct_errors.NotFoundError{}
var BAD_REQUEST_ERROR = struct_errors.BadRequestError{}
var INTERNAL_SERVER_ERROR = struct_errors.InternalServerError{}
var INVALID_JWT_TOKEN_ERROR = struct_errors.InvalidJwtTokenError{}

const TOOL_NAME_JMETER = "JMeterLoadTesting"
const TOOL_NAME_METASPLOIT = "Metasploit"
const TOOL_NAME_NMAP = "Nmap"
const TOOL_NAME_OPENVAS = "OpenVAS"
const TOOL_NAME_OWASPDEPENDENCY = "OWASPDependencyCheck"
const TOOL_NAME_OWASPZAP = "OWASPZAP"
const TOOL_NAME_SQLMAP = "SQLMap"

const RMQ_NMAP_TASK_CONFIGURATIONS_QUEUE_NAME = "nmap_task_configuration_queue"
const RMQ_METASPLOIT_TASK_CONFIGURATIONS_QUEUE_NAME = "metasploit_task_configuration_queue"
const RMQ_OPENVAS_TASK_CONFIGURATIONS_QUEUE_NAME = "openvas_task_configuration_queue"
const RMQ_OWASPZAP_TASK_CONFIGURATIONS_QUEUE_NAME = "owaspzap_task_configuration_queue"
const RMQ_OWASPDEPENDENCY_TASK_CONFIGURATIONS_QUEUE_NAME = "owaspdependncy_check_task_configuration_queue"
const RMQ_SQLMAP_TASK_CONFIGURATIONS_QUEUE_NAME = "sqlmap_task_configuration_queue"
const RMQ_JMETER_TASK_CONFIGURATIONS_QUEUE_NAME = "jmeter_task_configuration_queue"

const PIPELINE_STATUS_PENDING = "PENDING"
const PIPELINE_STATUS_IN_PROGRESS = "IN-PROGRESS"
const PIPELINE_STATUS_COMPLETED = "COMPLETED"
const PIPELINE_STATUS_FAILED = "FAILED"


var OWASP_DEPENDENCY_CHECK_FILE_PATH = filepath.Join("..", "zplus-engine", "security_tool_volume", "inputs")
var JMETER_TEST_PLAN_PATH = filepath.Join("..", "zplus-engine", "security_tool_volume", "inputs", TOOL_NAME_JMETER)
var RESULTS_FILE_PATH = filepath.Join("..", "zplus-engine", "security_tool_volume", "results")
