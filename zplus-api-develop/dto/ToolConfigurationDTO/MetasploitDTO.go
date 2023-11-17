package dto_tool_configuration

type MetasploitConfigurationDTO struct {
	Module_Type         string `json:"module_type" binding:"required,oneof='auxiliary' 'encoder' 'evasion' 'exploit' 'nop' 'payload' 'post'"`
	Module_Fullname     string `json:"module_fullname" binding:"required"`
	Module_Data         any    `json:"module_data" binding:"required"`
	Use_Default_Values  bool   `json:"use_default_values"`
	Advanced_Options    bool   `json:"advanced_options"`
	Additional_Comments string `json:"additional_comments"`
}
