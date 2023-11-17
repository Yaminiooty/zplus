package dto_tool_configuration

import (
	zap_dto "sec-tool/dto/ToolConfigurationDTO/OwaspZapDTO"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserToolDTO struct {
	Id                                   primitive.ObjectID                `json:"id,omitempty"`
	Email                                string                            `json:"email"`
	JMeter_Load_Testing_Configurations   JMeterLoadTestingConfigurationDTO `json:"jmeter_load_testing_configuration"`
	Metasploit_Configuration             MetasploitConfigurationDTO        `json:"metasploit_configuration"`
	Nmap_Configuration                   NmapConfigurationDTO              `json:"nmap_configuration"`
	Open_VAS_Configuration               OpenVASConfigurationDTO           `json:"open_vas_configuration"`
	OWASP_Dependency_Check_Configuration OWASPDependencyCheckDTO           `json:"owasp_dependency_check_configuration"`
	OWASP_ZAP_Configuration              zap_dto.OWASPZAPConfigurationDTO  `json:"owasp_zap_configuration"`
	SQL_Map_Configuration                SQLMapConfigurationDTO            `json:"sql_map_configuration"`
}
