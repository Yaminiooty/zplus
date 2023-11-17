package dto_tool_configuration_zap

type OWASPZAPConfigurationDTO struct {
	Target                   string                   `json:"target" binding:"required"`
	Scan_Type                string                   `json:"scan_type" binding:"required,oneof='Passive Scan' 'Active Scan'"`
	Spider_Type              string                   `json:"spider_type" binding:"oneof='Traditional Spider' 'Ajax Spider'"`
	TraditionalSPiderOptions TraditionalSPiderOptions `json:"traditional_spider_options"`
	Attack_Mode              string                   `json:"attack_mode" binding:"required,oneof='Safe Mode' 'Standard Mode' 'Protected Mode' 'Attack Mode'"`
	Authentication           bool                     `json:"authentication"`
	LoginUrl                 string                   `json:"login_url"`
	UsernameParamater        string                   `json:"username_parameter"`
	PasswordParameter        string                   `json:"password_parameter"`
	Username                 string                   `json:"username"`
	Password                 string                   `json:"password"`
	LoggedInIndicator        string                   `json:"logged_in_indicator"`
	Policy_Template          string                   `json:"policy_template" binding:"required,oneof='Low' 'Medium' 'High'"`
	Report_Format            string                   `json:"report_format" binding:"required,oneof='PDF' 'HTML'"`
	Additional_Comments      string                   `json:"additional_comments"`
}
