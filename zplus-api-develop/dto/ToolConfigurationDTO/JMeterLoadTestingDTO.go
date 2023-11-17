package dto_tool_configuration

import "mime/multipart"

type JMeterLoadTestingConfigurationDTO struct {
	TestPlanFile       *multipart.FileHeader `form:"test_plan_file" binding:"required"`
	NumberOfThreadsUDF string                `form:"number_of_threads_udf" binding:"required"`
	NumberOfThreads    string                `form:"number_of_threads" binding:"required"`
	RampUpPeriodUDF    string                `form:"ramp_up_period_udf" binding:"required"`
	RampUpPeriod       string                `form:"ramp_up_period" binding:"required"`
	LoopCountUDF       string                `form:"loop_count_udf" binding:"required"`
	LoopCount          string                `form:"loop_count" binding:"required"`
	TestDurationUDF    string                `form:"test_duration_udf" binding:"required"`
	TestDuration       string                `form:"test_duration" binding:"required"`
	ReportFormat       string                `form:"report_format" binding:"required,oneof='PDF' 'HTML'"`
	AdditionalComments string                `form:"additional_comments"`
}
 