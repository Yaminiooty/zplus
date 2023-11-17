package utils

import (
	models_tools "sec-tool/models/Tools"
)

func GetToolsMetaData() []models_tools.ToolMetaData {
	return []models_tools.ToolMetaData{
		{Name: TOOL_NAME_NMAP, Description: "Nmap (“Network Mapper”) is an open source tool for network exploration and security auditing. It was designed to rapidly scan large networks, although it works fine against single hosts.", IsEnabled: true},
		{Name: TOOL_NAME_METASPLOIT, Description: "Knowledge is power, especially when it’s shared. A collaboration between the open source community and Rapid7, Metasploit helps security teams do more than just verify vulnerabilities.", IsEnabled: true},
		{Name: TOOL_NAME_SQLMAP, Description: "SQLMap is a tool used for the automated exploitation of SQL injection vulnerabilities. We can use SQLMap to test websites and databases for vulnerabilities.", IsEnabled: true},
		{Name: TOOL_NAME_OWASPZAP, Description: "OWASP ZAP is an open-source web application security scanner. It is intended to be used by both those new to application security as well as professional penetration testers.", IsEnabled: true},
		{Name: TOOL_NAME_OWASPDEPENDENCY, Description: "Dependency-Check is a Software Composition Analysis (SCA) tool that attempts to detect publicly disclosed vulnerabilities contained within a project’s dependencies.", IsEnabled: true},
		{Name: TOOL_NAME_OPENVAS, Description: "OpenVAS (Open Vulnerability Assessment Scanner, originally known as GNessUs) is the scanner component of Greenbone Vulnerability Management (GVM).", IsEnabled: true},
		{Name: TOOL_NAME_JMETER, Description: "JMeter can be used as a unit-test tool for JDBC database connections,[1] FTP,[2] LDAP,[3] web services,[4] JMS,[5] HTTP,[6] generic TCP connections and OS-native processes.", IsEnabled: true},
	}
}
