package model_tool_configuration

import (
	"mime/multipart"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type OWASPDependencyCheckModel struct {
	Id                        primitive.ObjectID    `bson:"_id"`
	Project_File              *multipart.FileHeader `bson:"project_file"`
	Output_Format             string                `bson:"output_format"`
	Scan_Dependencies         bool                  `bson:"scan_dependencies"`
	Scan_Dev_Dependencies     bool                  `bson:"scan_dev_dependencies"`
	Suppress_CVE_Reports      bool                  `bson:"suppress_cve_reports"`
	Suppress_CVE_Reports_File *multipart.FileHeader `bson:"suppress_cve_reports_file"`
	Suppress_Update_Check     bool                  `bson:"suppress_update_check"`
	Additional_Comments       string                `bson:"additional_comments"`
}
