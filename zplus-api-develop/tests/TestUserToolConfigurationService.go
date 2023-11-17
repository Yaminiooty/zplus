package test

import (
	"net/http"
	dto_tool_configuration "sec-tool/dto/ToolConfigurationDTO"
	test_structs "sec-tool/tests/structs"
	"sec-tool/utils"

	"github.com/go-playground/assert/v2"
	"github.com/stretchr/testify/suite"
	"go.mongodb.org/mongo-driver/bson"
)

type TestUserToolConfigurationServiceSuite struct {
	suite.Suite
	TestEnv test_structs.TestEnv
}

func (tuss *TestUserServiceSuite) TestSaveMetasploitConfiguration() {
	type SaveMetasploitConfiguration struct {
		testName           string
		user               string
		tool               string
		configurationDto   dto_tool_configuration.MetasploitConfigurationDTO
		ExpectedMessage    string
		ExpectedStatusCode int
		ExpectedData       any
		ExpectedError      error
	}

	testData := []SaveMetasploitConfiguration{
		{
			testName: "Successful addition of JMeter load testing tool configuration",
			user:     "noreply.zplus@gmail.com",
			tool:     utils.TOOL_NAME_METASPLOIT,
			configurationDto: dto_tool_configuration.MetasploitConfigurationDTO{
				Module_Type:     "auxiliary",
				Module_Fullname: "auxiliary/scanner/ssh/ssh_version",
				Module_Data: bson.M{
					"RHOSTS": "192.168.56.109",
				},
				Use_Default_Values:  true,
				Advanced_Options:    false,
				Additional_Comments: "",
			},
			ExpectedMessage:    "Added tool configuration successfully",
			ExpectedStatusCode: http.StatusCreated,
			ExpectedData:       nil,
			ExpectedError:      nil,
		},
		{
			testName: "Successful update of JMeter load testing tool configuration",
			user:     "noreply.zplus@gmail.com",
			tool:     utils.TOOL_NAME_METASPLOIT,
			configurationDto: dto_tool_configuration.MetasploitConfigurationDTO{
				Module_Type:     "auxiliary",
				Module_Fullname: "auxiliary/scanner/ssh/ssh_version",
				Module_Data: bson.M{
					"RHOSTS": "192.168.56.109",
				},
				Use_Default_Values:  true,
				Advanced_Options:    false,
				Additional_Comments: "",
			},
			ExpectedMessage:    "Updated tool configurations successfully",
			ExpectedStatusCode: http.StatusOK,
			ExpectedData:       nil,
			ExpectedError:      nil,
		},
	}

	for _, test := range testData {
		tuss.Run(test.testName, func() {
			msg, statusCode, data, err := tuss.TestEnv.Services.UserToolConfigurationService.SaveMetasploitConfiguration(test.user, test.tool, test.configurationDto)
			assert.Equal(tuss.T(), test.ExpectedMessage, msg)
			assert.Equal(tuss.T(), test.ExpectedStatusCode, statusCode)
			assert.Equal(tuss.T(), test.ExpectedData, data)
			assert.Equal(tuss.T(), test.ExpectedError, err)
		})
	}
}
