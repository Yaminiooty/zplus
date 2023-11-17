package dto_tool_configuration

import "mime/multipart"

type OWASPDependencyCheckDTO struct {
	Project_File              *multipart.FileHeader `form:"project_file" binding:"required"`
	Output_Format             string                `form:"output_format" binding:"required,oneof='HTML' 'JSON' 'XML'"`
	Scan_Dependencies         bool                  `form:"scan_dependencies"`
	Scan_Dev_Dependencies     bool                  `form:"scan_dev_dependencies"`
	Suppress_CVE_Reports      bool                  `form:"suppress_cve_reports"`
	Suppress_CVE_Reports_File *multipart.FileHeader `form:"suppress_cve_reports_file"`
	Suppress_Update_Check     bool                  `form:"suppress_update_check"`
	Additional_Comments       string                `form:"additional_comments"`
}
