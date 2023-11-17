package test

import (
	"net/http"
	"sec-tool/dto"
	struct_errors "sec-tool/structs/errors"
	test_structs "sec-tool/tests/structs"

	"github.com/go-playground/assert/v2"
	"github.com/stretchr/testify/suite"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TestToolSelectionServiceSuite struct {
	suite.Suite
	TestEnv test_structs.TestEnv
}

func (ttss *TestToolSelectionServiceSuite) TestSelectTools() {

	const processingFailedMessage = "Unable to update the Tool Selection."
	const processingSuceededMessage = "Successfully updated the Tool Selections."

	type TestData struct {
		testId             int
		testName           string
		testType           string
		selectToolsDto     dto.SelectedToolsDTO
		ExpectedMessage    string
		ExpectedStatusCode int
		ExpectedData       any
		ExpectedError      error
	}
	testData := []TestData{
		{
			testId:             1,
			testType:           "SUCCESS",
			testName:           "Selection of Tools-200",
			selectToolsDto:     dto.SelectedToolsDTO{Email: "dummy_user@gmail.com", ToolIDs: []string{"64f9e31f5f6857da6ea77310"}},
			ExpectedMessage:    processingSuceededMessage,
			ExpectedStatusCode: http.StatusOK,
			ExpectedData:       nil,
			ExpectedError:      nil,
		},
		{
			testId:             2,
			testType:           "FAILURE",
			testName:           "Non existing user",
			selectToolsDto:     dto.SelectedToolsDTO{Email: "dummy1_user@gmail.com", ToolIDs: []string{"64f9e31f5f6857da6ea77310"}},
			ExpectedMessage:    processingFailedMessage,
			ExpectedStatusCode: http.StatusInternalServerError,
			ExpectedData:       nil,
			ExpectedError:      struct_errors.NotFoundError{Message: "Unable to find document with given email.", Err: nil},
		},
	}

	for _, test := range testData {

		ttss.Run(test.testName, func() {
			msg, statusCode, data, err := ttss.TestEnv.Services.ToolsSelectionService.SelectTools(test.selectToolsDto)

			assert.Equal(ttss.T(), test.ExpectedMessage, msg)
			assert.Equal(ttss.T(), test.ExpectedStatusCode, statusCode)
			assert.Equal(ttss.T(), test.ExpectedData, data)
			assert.Equal(ttss.T(), test.ExpectedError, err)
		})
	}

}

func (ttss *TestToolSelectionServiceSuite) TestGetSelectTools() {

	const processingFailedMessage = "Unable to fetch Selected Tools."
	const processingSuceededMessage = "List Of Selected Tools."

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
	nmapObjectId, _ := primitive.ObjectIDFromHex("64f9e31f5f6857da6ea77310")

	ttss.TestEnv.Services.ToolsSelectionService.SelectTools(dto.SelectedToolsDTO{Email: "dummy_user@gmail.com", ToolIDs: []string{"64f9e31f5f6857da6ea77310"}})

	testData := []TestData{
		{
			testId:             1,
			testType:           "SUCCESS",
			testName:           "Get Selected Tools",
			email:              "dummy_user@gmail.com",
			ExpectedMessage:    processingSuceededMessage,
			ExpectedStatusCode: http.StatusOK,
			ExpectedData: []dto.GetSelectedToolsDTO{
				{Id: nmapObjectId, Name: "Nmap"},
			},
			ExpectedError: nil,
		},
		{
			testId:             2,
			testType:           "FAILURE",
			testName:           "Non Existent Email Id",
			email:              "dummy1_user@gmail.com",
			ExpectedMessage:    processingFailedMessage,
			ExpectedStatusCode: http.StatusInternalServerError,
			ExpectedData:       nil,
			ExpectedError:      struct_errors.NotFoundError{Message: "Unable to find document with given email.", Err: nil},
		},
	}

	for _, test := range testData {

		ttss.Run(test.testName, func() {
			msg, statusCode, data, err := ttss.TestEnv.Services.ToolsSelectionService.GetSelectedTools(test.email)

			assert.Equal(ttss.T(), test.ExpectedMessage, msg)
			assert.Equal(ttss.T(), test.ExpectedStatusCode, statusCode)
			assert.Equal(ttss.T(), test.ExpectedData, data)
			assert.Equal(ttss.T(), test.ExpectedError, err)
		})
	}

}
