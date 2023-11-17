package test

import (
	"net/http"
	"sec-tool/dto"
	dto_action_pipeline "sec-tool/dto/ActionPipline"
	dto_tool_configuration "sec-tool/dto/ToolConfigurationDTO"
	struct_errors "sec-tool/structs/errors"
	test_structs "sec-tool/tests/structs"
	"sec-tool/utils"

	"github.com/go-playground/assert/v2"
	"github.com/stretchr/testify/suite"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TestActionPipelinServiceSuite struct {
	suite.Suite
	TestEnv test_structs.TestEnv
}

const DUMMY_USER_EMAIL = "dummy_user@gmail.com"

var PIPELINE_ID = ""

func (tpss *TestActionPipelinServiceSuite) Test_1_CreatePipeline() {

	processingFailedMessage := "Unable to Creation Action Pipeline."
	processingSuccededMessage := "Pipeline Created Sucessfully."

	type TestData struct {
		testId             int
		testName           string
		testType           string
		email              string
		ExpectedMessage    string
		ExpectedStatusCode int
		ExpectedData       any
		ExpectedError      error
	}
	testData := []TestData{
		{
			testId:             1,
			testType:           "SUCCESS",
			testName:           "Action Pipeline Created Successfully-200",
			email:              DUMMY_USER_EMAIL,
			ExpectedMessage:    processingSuccededMessage,
			ExpectedStatusCode: http.StatusOK,
			ExpectedData: []dto_action_pipeline.ActionPipelineStatus{
				{
					ToolName: "Nmap",
					Status:   utils.PIPELINE_STATUS_PENDING,
				},
			},
			ExpectedError: nil,
		},
		{
			testId:             2,
			testType:           "FAILURE",
			testName:           "Non existing user-500",
			email:              "dummy1_user@gmail.com",
			ExpectedMessage:    processingFailedMessage,
			ExpectedStatusCode: http.StatusInternalServerError,
			ExpectedData:       nil,
			ExpectedError:      struct_errors.NotFoundError{Message: "Unable to find document with given email.", Err: nil},
		},
	}
	nmapObjectId, _ := primitive.ObjectIDFromHex("64f9e31f5f6857da6ea77310")

	tpss.TestEnv.Services.ToolsSelectionService.SelectTools(dto.SelectedToolsDTO{Email: DUMMY_USER_EMAIL, ToolIDs: []string{nmapObjectId.Hex()}})

	tpss.TestEnv.Services.UserToolConfigurationService.SaveNmapConfiguration(DUMMY_USER_EMAIL, utils.TOOL_NAME_NMAP, dto_tool_configuration.NmapConfigurationDTO{
		Target:                      "192.168.76.1",
		Scan_Type:                   "SYNACK",
		Port:                        "98,65,32,41",
		Scan_Timing:                 "max",
		Output_Format:               "XML",
		Aggressive_Scan:             true,
		Script_Scan:                 "True",
		Traceroute:                  false,
		Show_Port_State_Reason:      true,
		Scan_All_Ports:              false,
		Version_Detection_Intensity: "max",
		Max_Round_Trip_Timeout:      "0",
		Max_Retries:                 "5",
		Fragment_Packets:            false,
		Service_Version_Probe:       true,
		Default_NSE_Scripts:         false,
	})

	for _, test := range testData {

		tpss.Run(test.testName, func() {
			msg, statusCode, data, err := tpss.TestEnv.Services.ActionPipelineService.CreatePipeline(test.email)

			assert.Equal(tpss.T(), test.ExpectedMessage, msg)
			assert.Equal(tpss.T(), test.ExpectedStatusCode, statusCode)
			if test.ExpectedData != nil {
				PIPELINE_ID = data.(dto_action_pipeline.ResponseCreateActionPipelineDTO).PipelineId
				assert.Equal(tpss.T(), test.ExpectedData, data.(dto_action_pipeline.ResponseCreateActionPipelineDTO).ActionPipeLineStatus)
			} else {
				assert.Equal(tpss.T(), test.ExpectedData, data)
			}

			assert.Equal(tpss.T(), test.ExpectedError, err)
		})
	}

}

func (tpss *TestActionPipelinServiceSuite) Test_2_GetPipelineToolsStatus() {

	tpss.Run("GET EXECUTION STATUS FOR PIPELINE", func() {
		msg, statusCode, _, err := tpss.TestEnv.Services.ActionPipelineService.GetPipelineToolsStatus(PIPELINE_ID, DUMMY_USER_EMAIL)
		assert.Equal(tpss.T(), "Got pipeline tools details", msg)
		assert.Equal(tpss.T(), http.StatusOK, statusCode)
		assert.Equal(tpss.T(), nil, err)
	})
}

func (tpss *TestActionPipelinServiceSuite) Test_3_RunPipeline() {
	processingFailedMessage := "Unable to Start Action Pipeline."
	processingSuccededMessage := "Pipeline Started for all the tools Sucessfully."

	nmapObjectId, _ := primitive.ObjectIDFromHex("64f9e31f5f6857da6ea77310")

	tpss.TestEnv.Services.ToolsSelectionService.SelectTools(dto.SelectedToolsDTO{Email: DUMMY_USER_EMAIL, ToolIDs: []string{nmapObjectId.Hex()}})

	tpss.TestEnv.Services.UserToolConfigurationService.SaveNmapConfiguration(DUMMY_USER_EMAIL, utils.TOOL_NAME_NMAP, dto_tool_configuration.NmapConfigurationDTO{
		Target:                      "192.168.76.1",
		Scan_Type:                   "SYNACK",
		Port:                        "98,65,32,41",
		Scan_Timing:                 "max",
		Output_Format:               "XML",
		Aggressive_Scan:             true,
		Script_Scan:                 "True",
		Traceroute:                  false,
		Show_Port_State_Reason:      true,
		Scan_All_Ports:              false,
		Version_Detection_Intensity: "max",
		Max_Round_Trip_Timeout:      "0",
		Max_Retries:                 "5",
		Fragment_Packets:            false,
		Service_Version_Probe:       true,
		Default_NSE_Scripts:         false,
	})

	_, _, data, _ := tpss.TestEnv.Services.ActionPipelineService.CreatePipeline(DUMMY_USER_EMAIL)

	validPipelineId := data.(dto_action_pipeline.ResponseCreateActionPipelineDTO).PipelineId
	PIPELINE_ID = validPipelineId
	invalidPipelineId := "6506c8a3c83ab929c8a5a80"

	type TestData struct {
		testId             int
		testName           string
		testType           string
		email              string
		pipelineId         string
		ExpectedMessage    string
		ExpectedStatusCode int
		ExpectedData       any
		ExpectedError      any
	}

	testData := []TestData{
		{
			testId:             1,
			testName:           "Succesfully Run Pipline for given pipeline ID",
			testType:           "SUCCESS",
			email:              DUMMY_USER_EMAIL,
			pipelineId:         validPipelineId,
			ExpectedMessage:    processingSuccededMessage,
			ExpectedStatusCode: http.StatusOK,
			ExpectedData: []dto_action_pipeline.ActionPipelineStatus{
				{
					ToolName: "Nmap",
					Status:   utils.PIPELINE_STATUS_IN_PROGRESS,
				},
			},
			ExpectedError: nil,
		},
		{
			testId:             2,
			testName:           "Invalid Pipeline Id",
			testType:           "FAILURE",
			email:              DUMMY_USER_EMAIL,
			pipelineId:         invalidPipelineId,
			ExpectedMessage:    processingFailedMessage,
			ExpectedStatusCode: http.StatusBadRequest,
			ExpectedData:       nil,
			ExpectedError:      "Invalid Pipeline Id.",
		},
	}

	for _, test := range testData {
		tpss.Run(test.testName, func() {

			msg, statusCode, data, err := tpss.TestEnv.Services.ActionPipelineService.RunPipeline(test.email, test.pipelineId)
			assert.Equal(tpss.T(), test.ExpectedMessage, msg)
			assert.Equal(tpss.T(), test.ExpectedStatusCode, statusCode)
			assert.Equal(tpss.T(), test.ExpectedData, data)
			assert.Equal(tpss.T(), test.ExpectedError, err)
		})
	}
}

func (tpss *TestActionPipelinServiceSuite) Test_4_GetAvailableResultByPipelineIdAndToolName() {

	type TestData struct {
		testId             int
		testName           string
		testType           string
		toolName           string
		pipelineId         string
		ExpectedMessage    string
		ExpectedStatusCode int
		ExpectedData       any
		ExpectedError      any
	}

	testData := []TestData{
		{
			testId:             1,
			testName:           "Successfully get available result by pipeline id and tool name",
			testType:           "SUCCESS",
			toolName:           "Nmap",
			pipelineId:         PIPELINE_ID,
			ExpectedMessage:    "Got available result type details",
			ExpectedStatusCode: http.StatusOK,
			ExpectedError:      nil,
		},
		{
			testId:             2,
			testName:           "failure get available result by pipeline id and tool name",
			testType:           "FAILURE",
			toolName:           "Nmap",
			pipelineId:         "6528dce38488f16557ea9cdb",
			ExpectedMessage:    "Error getting available result type details from pipeline",
			ExpectedStatusCode: http.StatusInternalServerError,
			ExpectedError:      struct_errors.InternalServerError{Message: "Error occurred during fetching documents.", Err: nil},
		},
	}

	for _, test := range testData {
		tpss.Run(test.testName, func() {

			msg, statusCode, _, err := tpss.TestEnv.Services.ActionPipelineService.GetAvailableResultByPipelineIdAndToolName(test.pipelineId, test.toolName)
			assert.Equal(tpss.T(), test.ExpectedMessage, msg)
			assert.Equal(tpss.T(), test.ExpectedStatusCode, statusCode)
			assert.Equal(tpss.T(), test.ExpectedError, err)
		})
	}
}
