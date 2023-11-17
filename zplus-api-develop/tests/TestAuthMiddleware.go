package test

import (
	"context"
	"net/http"
	"net/http/httptest"
	"sec-tool/middleware"
	test_structs "sec-tool/tests/structs"
	"sec-tool/utils"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/assert/v2"
	"github.com/stretchr/testify/suite"
)

type TestAuthMiddlewareSuite struct {
	suite.Suite
	TestEnv test_structs.TestEnv
}

func (tams *TestAuthMiddlewareSuite) TestAuthMiddlewareSuite() {
	gin.SetMode(gin.ReleaseMode)
	testRouter := gin.New()

	testRouter.Use(middleware.JwtAuthentication(utils.GetUnauthenticatedRoutes(), tams.TestEnv.App.RedisConfig))

	testRouter.GET("/test", func(ctx *gin.Context) {
		ctx.JSON(200, "test")
	})

	type TestData struct {
		testId             int
		testName           string
		testType           string
		accessToken        string
		ExpectedMessage    string
		ExpectedStatusCode int
		ExpectedData       any
		ExpectedError      error
	}
	validAccessToken := utils.GenerateAccessToken("dummy_user@gmail.com")
	expiredAccessToken := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTQyNDg0ODIsInN1YiI6InJhaHVscG9oYXJlNDFAZ21haWwuY29tIn0.iayTJG51pSrMBcm3ONg9INpq6k0Hk1HfVBvG2n_bHRk"
	malfomredAccessToken := "eyJhbGciOiJIUzI1NiIsInR5c.iayTJG51pSrMBcm3ONg9INpq6k0Hk1HfVBvG2n_bHRk"

	testData := []TestData{
		{
			testId:             1,
			testName:           "Valid Access Token- 200",
			testType:           "SUCCESS",
			accessToken:        validAccessToken,
			ExpectedMessage:    "\"test\"",
			ExpectedStatusCode: http.StatusOK,
			ExpectedData:       nil,
			ExpectedError:      nil,
		},
		{
			testId:             2,
			testName:           "Missing Auth Header - 401",
			testType:           "FAILURE",
			accessToken:        validAccessToken,
			ExpectedMessage:    "{\"message\":\"Missing Authorization header.\"}",
			ExpectedStatusCode: 401,
			ExpectedData:       nil,
			ExpectedError:      nil,
		},
		{
			testId:             3,
			testName:           "Expired Access Token - 401",
			testType:           "FAILURE",
			accessToken:        expiredAccessToken,
			ExpectedMessage:    "{\"message\":\"Expired JWT Token.\"}",
			ExpectedStatusCode: 401,
			ExpectedData:       nil,
			ExpectedError:      nil,
		},
		{
			testId:             4,
			testName:           "Malformed Access Token - 401",
			testType:           "FAILURE",
			accessToken:        malfomredAccessToken,
			ExpectedMessage:    "{\"message\":\"Malformed JWT Token.\"}",
			ExpectedStatusCode: 401,
			ExpectedData:       nil,
			ExpectedError:      nil,
		},
		{
			testId:             5,
			testName:           "Logged Out Access Token - 401",
			testType:           "FAILURE",
			accessToken:        validAccessToken,
			ExpectedMessage:    "{\"message\":\"Expired JWT Token.\"}",
			ExpectedStatusCode: 401,
			ExpectedData:       nil,
			ExpectedError:      nil,
		},
	}

	for _, test := range testData {

		tams.Run(test.testName, func() {

			if test.testId == 5 {
				tams.TestEnv.App.RedisConfig.Client.Set(context.TODO(), test.accessToken, nil, 2*time.Minute)
			}
			responseRecorder := httptest.NewRecorder()
			request, _ := http.NewRequest("GET", "/test", nil)

			if test.testId != 2 {
				request.Header.Add("Authorization", "Bearer "+test.accessToken)
			}
			testRouter.ServeHTTP(responseRecorder, request)

			assert.Equal(tams.T(), test.ExpectedMessage, responseRecorder.Body.String())
			assert.Equal(tams.T(), test.ExpectedStatusCode, responseRecorder.Code)

			if test.testId == 5 {
				tams.TestEnv.App.RedisConfig.Client.Del(context.TODO(), test.accessToken)
			}
		})

	}
}
