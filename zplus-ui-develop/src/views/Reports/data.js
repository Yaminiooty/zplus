import { TOOL_NAME } from '../../utils/constants';

export const sidepanelData = [
  {
    id: 0,
    pageLink: 'network-discovery',
    reportName: 'Network Discovery Report',
    toolName: TOOL_NAME.NMAP,
  },
  {
    id: 1,
    pageLink: 'vulnerability-exploitation',
    reportName: 'Vulnerability Exploitation Report',
    toolName: TOOL_NAME.METASPLOIT,
  },
  {
    id: 2,
    pageLink: 'web-application-security',
    reportName: 'Web Application Security Report',
    toolName: TOOL_NAME.OWASPZAP,
  },
  {
    id: 3,
    pageLink: 'dependency-security',
    reportName: 'Dependency Security Report',
    toolName: TOOL_NAME.OWASPDEPENDENCY,
  },
  {
    id: 4,
    pageLink: 'security-auditing',
    reportName: 'Security Auditing Report',
    toolName: TOOL_NAME.OPENVAS,
  },
  {
    id: 5,
    pageLink: 'sql-injection-testing',
    reportName: 'SQL Injection Testing Report',
    toolName: TOOL_NAME.SQLMAP,
  },
  {
    id: 6,
    pageLink: 'performance-testing',
    reportName: 'Performance Testing Reports',
    toolName: TOOL_NAME.JMETER,
  },
];
