//Put app level constants

export const CONSTANTS = {
  NAME_REGEX: /^[A-Za-z\s]+$/,
  PHONE_REGEX: /^\d+$/,
  EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/,
};

export const PIPELINE_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN-PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
};

export const TOOL_NAME = {
  JMETER: 'JMeterLoadTesting',
  METASPLOIT: 'Metasploit',
  NMAP: 'Nmap',
  OPENVAS: 'OpenVAS',
  OWASPDEPENDENCY: 'OWASPDependencyCheck',
  OWASPZAP: 'OWASPZAP',
  SQLMAP: 'SQLMap',
};
