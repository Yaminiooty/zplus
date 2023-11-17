package model_tool_configuration

import (
	"mime/multipart"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type JMeterLoadTestingConfigurationModel struct {
	Id                 primitive.ObjectID    `bson:"_id"`
	TestPlanFile       *multipart.FileHeader `bson:"test_plan_file"  json:"test_plan_file"`
	NumberOfThreadsUDF string                `bson:"number_of_threads_udf"  json:"number_of_threads_udf"`
	NumberOfThreads    string                `bson:"number_of_threads"  json:"number_of_threads"`
	RampUpPeriodUDF    string                `bson:"ramp_up_period_udf"  json:"ramp_up_period_udf"`
	RampUpPeriod       string                `bson:"ramp_up_period"  json:"ramp_up_period"`
	LoopCountUDF       string                `bson:"loop_count_udf"  json:"loop_count_udf"`
	LoopCount          string                `bson:"loop_count"  json:"loop_count"`
	TestDurationUDF    string                `bson:"test_duration_udf"  json:"test_duration_udf"`
	TestDuration       string                `bson:"test_duration"  json:"test_duration"`
	ReportFormat       string                `bson:"report_format"  json:"reportformat"`
	AdditionalComments string                `bson:"additional_comments"  json:"additionalcomments"`
}
