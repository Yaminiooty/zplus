package dto_tool_configuration

type SQLMapConfigurationDTO struct {
	Target                 string `json:"target" binding:"required"`
	TestingMode            string `json:"testing_mode" binding:"required,oneof='Automatic' 'Manual'"`
	TestingLevel           string `json:"testing_level" binding:"required,oneof='Level 1' 'Level 2' 'Level 3' 'Level 4' 'Level 5'"`
	VerbosityLevel         string `json:"verbosity_level" binding:"required,oneof='Level 0' 'Level 1' 'Level 2' 'Level 3' 'Level 4' 'Level 5' 'Level 6'"`
	TestForms              bool   `json:"test_forms"`
	CheckForAdditionalUrls bool   `json:"check_for_additional_urls"`
	Cookies                string `json:"cookies"`
	Headers                string `json:"headers"`
	Data                   string `json:"data"`
	UserAgent              string `json:"user_agent"`
	NumberOfThreads        string `json:"number_of_threads" binding:"required,oneof='Low' 'Medium' 'High'"`
	ExcludeSystemDatabase  bool   `json:"exclude_system_databases"`
	CurrentSessionUser  bool `json:"current_session_user"`
	CurrentDatabase     bool `json:"current_database"`
	EnumerateUsers      bool `json:"enumerate_users"`
	EnumeratePasswords  bool `json:"enumerate_passwords"`
	EnumeratePrivilages bool `json:"enumerate_privileges"`
	EnumerateRoles      bool `json:"enumerate_roles"`
	EnumerateDatabases  bool `json:"enumerate_databases"`
	EnumerateTables     bool `json:"enumerate_tables"`
	EnumerateColumns    bool `json:"enumerate_columns"`
	EnumerateSchemas    bool `json:"enumerate_schemas"`
	ReportFormat       string `json:"report_format" binding:"required,oneof='PDF' 'TXT'"`
	AdditionalComments string `json:"additional_comments"`
}
