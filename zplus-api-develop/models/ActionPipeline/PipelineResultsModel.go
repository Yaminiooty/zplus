package models_action_pipeline

import "go.mongodb.org/mongo-driver/bson"

type PipelineResultModel struct {
	Results Results `bson:"results"`
}

type Results struct {
	ExecutionError   string `bson:"execution_error"`
	ReportFiles      bson.M `bson:"report_files"`
	ExecutionMessage string `bson:"execution_message"`
	ExecutedCommand  string `bson:"executed_command"`
	JsonReport       bson.M `bson:"json"`
}
