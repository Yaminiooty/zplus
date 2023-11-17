package dto_action_pipeline

import "go.mongodb.org/mongo-driver/bson"

type PipelineResultDTO struct {
	Results Results `json:"results"`
}

type Results struct {
	ExecutionError   string `json:"execution_error"`
	ReportFiles      bson.M `json:"report_files"`
	ExecutionMessage string `json:"execution_message"`
	ExecutedCommand  string `json:"executed_command"`
	JsonReport       bson.M `json:"json"`
}

type ResultJSONAndFiles struct {
	JsonReport  bson.M `json:"json"`
	ReportFiles bson.M `json:"report_files"`
}
