package structmappers

import (
	dto_tool_configuration "sec-tool/dto/ToolConfigurationDTO"
	dto_tool_configuration_zap "sec-tool/dto/ToolConfigurationDTO/OwaspZapDTO"
	model_tool_configuration "sec-tool/models/ToolConfigurationModel"
	model_tool_configuration_zap "sec-tool/models/ToolConfigurationModel/OwaspZapModel"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func JMeterLoadTestingDtoToModel(input dto_tool_configuration.JMeterLoadTestingConfigurationDTO) *model_tool_configuration.JMeterLoadTestingConfigurationModel {
	var result model_tool_configuration.JMeterLoadTestingConfigurationModel
	result.Id = primitive.NewObjectID()
	result.TestPlanFile = input.TestPlanFile
	result.NumberOfThreadsUDF = input.NumberOfThreadsUDF
	result.NumberOfThreads = input.NumberOfThreads
	result.RampUpPeriodUDF = input.RampUpPeriodUDF
	result.RampUpPeriod = input.RampUpPeriod
	result.LoopCountUDF = input.LoopCountUDF
	result.LoopCount = input.LoopCount
	result.TestDurationUDF = input.TestDurationUDF
	result.TestDuration = input.TestDuration
	result.ReportFormat = input.ReportFormat
	result.AdditionalComments = input.AdditionalComments
	return &result
}

func MetasploitDtoToModel(input dto_tool_configuration.MetasploitConfigurationDTO) *model_tool_configuration.MetasploitConfigurationModel {
	var result model_tool_configuration.MetasploitConfigurationModel
	result.Id = primitive.NewObjectID()
	result.Module_Type = input.Module_Type
	result.Module_Fullname = input.Module_Fullname
	result.Module_Data = input.Module_Data
	result.Use_Default_Values = input.Use_Default_Values
	result.Advanced_Options = input.Advanced_Options
	result.Additional_Comments = input.Additional_Comments
	return &result
}

func NmapDtoToModel(input dto_tool_configuration.NmapConfigurationDTO) *model_tool_configuration.NmapConfigurationModel {
	var result model_tool_configuration.NmapConfigurationModel
	result.Id = primitive.NewObjectID()
	result.Target = input.Target
	result.Scan_Type = input.Scan_Type
	result.Port = input.Port
	result.Scan_Timing = input.Scan_Timing
	result.Output_Format = input.Output_Format
	result.Aggressive_Scan = input.Aggressive_Scan
	result.Script_Scan = input.Script_Scan
	result.Traceroute = input.Traceroute
	result.Show_Port_State_Reason = input.Show_Port_State_Reason
	result.Scan_All_Ports = input.Scan_All_Ports
	result.Version_Detection_Intensity = input.Version_Detection_Intensity
	result.Max_Round_Trip_Timeout = input.Max_Round_Trip_Timeout
	result.Max_Retries = input.Max_Retries
	result.Fragment_Packets = input.Fragment_Packets
	result.Service_Version_Probe = input.Service_Version_Probe
	result.Default_NSE_Scripts = input.Default_NSE_Scripts
	return &result
}

func OpenVASDtoToModel(input dto_tool_configuration.OpenVASConfigurationDTO) *model_tool_configuration.OpenVASConfigurationModel {
	var result model_tool_configuration.OpenVASConfigurationModel
	result.Id = primitive.NewObjectID()
	result.Target = input.Target
	result.PortRange = model_tool_configuration.PortRange{TCP: input.PortRange.TCP, UDP: input.PortRange.UDP}
	result.ScanConfig = input.ScanConfig
	result.ScannerType = input.ScannerType
	result.NoOfConcurrentNVTsPerHost = input.NoOfConcurrentNVTsPerHost
	result.NoOfConcurrentScannedHost = input.NoOfConcurrentScannedHost
	result.ReportFormat = input.ReportFormat
	result.AdditionalComments = input.AdditionalComments
	return &result
}

func OWASPDependencyCheckDtoToModel(input dto_tool_configuration.OWASPDependencyCheckDTO) *model_tool_configuration.OWASPDependencyCheckModel {
	var result model_tool_configuration.OWASPDependencyCheckModel
	result.Id = primitive.NewObjectID()
	result.Project_File = input.Project_File
	result.Output_Format = input.Output_Format
	result.Scan_Dependencies = input.Scan_Dependencies
	result.Scan_Dev_Dependencies = input.Scan_Dev_Dependencies
	result.Suppress_CVE_Reports = input.Suppress_CVE_Reports
	result.Suppress_CVE_Reports_File = input.Suppress_CVE_Reports_File
	result.Suppress_Update_Check = input.Suppress_Update_Check
	result.Additional_Comments = input.Additional_Comments
	return &result
}

func OWASPZAPDtoToModel(input dto_tool_configuration_zap.OWASPZAPConfigurationDTO) *model_tool_configuration_zap.OWASPZAPConfigurationModel {
	var result model_tool_configuration_zap.OWASPZAPConfigurationModel
	result.Id = primitive.NewObjectID()
	result.Target = input.Target
	result.Scan_Type = input.Scan_Type
	result.Spider_Type = input.Spider_Type
	result.TraditionalSPiderOptions = model_tool_configuration_zap.TraditionalSpiderOptionsModel{
		MaxChildren: input.TraditionalSPiderOptions.MaxChildren,
		Recurse:     input.TraditionalSPiderOptions.Recurse,
		SubTreeOnly: input.TraditionalSPiderOptions.SubTreeOnly,
	}
	result.Attack_Mode = input.Attack_Mode
	result.Authentication = input.Authentication
	result.LoginUrl = input.LoginUrl
	result.UsernameParamater = input.UsernameParamater
	result.PasswordParamater = input.PasswordParameter
	result.Username = input.Username
	result.Password = input.Password
	result.LoggedInIndicator = input.LoggedInIndicator
	result.Policy_Template = input.Policy_Template
	result.Report_Format = input.Report_Format
	result.Additional_Comments = input.Additional_Comments
	return &result
}

func SQLMapDtoToModel(input dto_tool_configuration.SQLMapConfigurationDTO) *model_tool_configuration.SQLMapConfigurationModel {
	var result model_tool_configuration.SQLMapConfigurationModel
	result.Id = primitive.NewObjectID()
	result.Target = input.Target
	result.TestingMode = input.TestingMode
	result.TestingLevel = input.TestingLevel
	result.TestForms = input.TestForms
	result.VerbosityLevel = input.VerbosityLevel
	result.CheckForAdditionalUrls = input.CheckForAdditionalUrls
	result.Cookies = input.Cookies
	result.Headers = input.Headers
	result.Data = input.Data
	result.UserAgent = input.UserAgent
	result.NumberOfThreads = input.NumberOfThreads
	result.ExcludeSystemDatabase = input.ExcludeSystemDatabase

	result.CurrentSessionUser = input.CurrentSessionUser
	result.CurrentDatabase = input.CurrentDatabase
	result.EnumerateUsers = input.EnumerateUsers
	result.EnumeratePasswords = input.EnumeratePasswords
	result.EnumeratePrivilages = input.EnumerateRoles
	result.EnumerateRoles = input.EnumerateRoles
	result.EnumerateDatabases = input.EnumerateDatabases
	result.EnumerateTables = input.EnumerateTables
	result.EnumerateColumns = input.EnumerateColumns
	result.EnumerateSchemas = input.EnumerateSchemas

	result.ReportFormat = input.ReportFormat
	result.AdditionalComments = input.AdditionalComments
	return &result
}

func ConvertGenericBSONDocumentToKeyValueDocument(primitveDocuments bson.D) any {
	keyValuePairDocument := map[string]interface{}{}
	for _, document := range primitveDocuments {
		keyValuePairDocument[document.Key] = document.Value
	}
	return keyValuePairDocument
}
