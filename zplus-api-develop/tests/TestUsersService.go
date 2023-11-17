package test

import (
	"context"
	"net/http"
	"sec-tool/dto"
	struct_errors "sec-tool/structs/errors"
	test_structs "sec-tool/tests/structs"
	"sec-tool/utils"

	"github.com/go-playground/assert/v2"
	"github.com/stretchr/testify/suite"
)

type TestUserServiceSuite struct {
	suite.Suite
	TestEnv test_structs.TestEnv
}

const Email = "noreply.zplus@gmail.com"
const Password = "Dummy@123"
const Incorrect_Email = "incorrect_email@gmail.com"

func (tuss *TestUserServiceSuite) TestCreateNewUser() {

	tuss.Run("CREATE NEW USER", func() {
		msg, statusCode, _, err := tuss.TestEnv.Services.UserService.CreateNewUser(
			dto.CreteNewUserDTO{
				Name:                  "dummy_user",
				Email:                 Email,
				Password:              Password,
				Phone:                 "+91 9876543219",
				TermsAcceptanceStatus: true,
			},
		)
		assert.Equal(tuss.T(), "User Created Successfully!", msg)
		assert.Equal(tuss.T(), http.StatusCreated, statusCode)
		assert.Equal(tuss.T(), nil, err)
	})

	tuss.Run("CREATE NEW USER WITH EXISTING USER EMAIL", func() {
		msg, statusCode, data, err := tuss.TestEnv.Services.UserService.CreateNewUser(
			dto.CreteNewUserDTO{
				Name:                  "dummy_user",
				Email:                 Email,
				Password:              Password,
				Phone:                 "+91 9876543219",
				TermsAcceptanceStatus: true,
			},
		)
		assert.Equal(tuss.T(), "User with given email id is already registered.", msg)
		assert.Equal(tuss.T(), http.StatusBadRequest, statusCode)
		assert.Equal(tuss.T(), nil, data)
		assert.Equal(tuss.T(), nil, err)
	})

}

func (tuss *TestUserServiceSuite) TestLoginWithEmailAndPassword() {

	tuss.Run("LOGIN WITH INCORRECT EMAIL", func() {
		msg, statusCode, data, err := tuss.TestEnv.Services.UserService.LoginWithEmailAndPassword(
			dto.UserDTO{
				Email:    Incorrect_Email,
				Password: Password,
			},
		)
		assert.Equal(tuss.T(), "Incorrect Email or Password.", msg)
		assert.Equal(tuss.T(), http.StatusUnauthorized, statusCode)
		assert.Equal(tuss.T(), nil, data)
		assert.Equal(tuss.T(), nil, err)
	})

	tuss.Run("LOGIN WITH INCORRECT PASSWORD", func() {
		msg, statusCode, data, err := tuss.TestEnv.Services.UserService.LoginWithEmailAndPassword(
			dto.UserDTO{
				Email:    Email,
				Password: "Incorrect@123",
			},
		)
		assert.Equal(tuss.T(), "Incorrect Email or Password.", msg)
		assert.Equal(tuss.T(), http.StatusUnauthorized, statusCode)
		assert.Equal(tuss.T(), nil, data)
		assert.Equal(tuss.T(), nil, err)
	})

	tuss.Run("LOGIN WITH UNVERIFIED ACCOUNT", func() {
		msg, statusCode, data, err := tuss.TestEnv.Services.UserService.LoginWithEmailAndPassword(
			dto.UserDTO{
				Email:    Email,
				Password: Password,
			},
		)
		assert.Equal(tuss.T(), "Account is not verified", msg)
		assert.Equal(tuss.T(), http.StatusAccepted, statusCode)
		assert.Equal(tuss.T(), nil, data)
		assert.Equal(tuss.T(), nil, err)
	})

	tuss.Run("LOGIN WITH VERIFIED ACCOUNT", func() {
		tuss.TestEnv.Repo.UserRepository.UpdateAccountVerificationStatusByEmail(Email)
		msg, statusCode, _, err := tuss.TestEnv.Services.UserService.LoginWithEmailAndPassword(
			dto.UserDTO{
				Email:    Email,
				Password: Password,
			},
		)
		assert.Equal(tuss.T(), "Login Successful", msg)
		assert.Equal(tuss.T(), http.StatusOK, statusCode)
		assert.Equal(tuss.T(), nil, err)
	})
}

func (tuss *TestUserServiceSuite) TestNewAccessToken() {

	tuss.Run("GET NEW ACCESS TOKEN FROM REFRESH TOKEN", func() {
		authorizationHeader := "Bearer " + utils.GenerateRefreshToken(Email)
		msg, statusCode, data, err := tuss.TestEnv.Services.UserService.NewAccessToken(authorizationHeader)
		assert.Equal(tuss.T(), "New token generation successful", msg)
		assert.Equal(tuss.T(), http.StatusOK, statusCode)
		assert.NotEqual(tuss.T(), nil, data)
		assert.Equal(tuss.T(), nil, err)
	})

	tuss.Run("GET NEW ACCESS TOKEN FOR RANDOM USER", func() {
		authorizationHeader := "Bearer " + utils.GenerateRefreshToken(Incorrect_Email)
		msg, statusCode, data, _ := tuss.TestEnv.Services.UserService.NewAccessToken(authorizationHeader)
		assert.Equal(tuss.T(), "Unable to generate new access token", msg)
		assert.Equal(tuss.T(), http.StatusUnauthorized, statusCode)
		assert.Equal(tuss.T(), nil, data)
	})

	tuss.Run("GET NEW ACCESS TOKEN WITH INVALID REFRESH TOKEN", func() {
		invalidRefreshToken := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
		authorizationHeader := "Bearer " + invalidRefreshToken
		msg, statusCode, data, _ := tuss.TestEnv.Services.UserService.NewAccessToken(authorizationHeader)
		assert.Equal(tuss.T(), "Unable to generate new access token", msg)
		assert.Equal(tuss.T(), http.StatusUnauthorized, statusCode)
		assert.Equal(tuss.T(), nil, data)
	})
}

func (tuss *TestUserServiceSuite) TestVerifyAccount() {

	tuss.Run("ACCOUNT VERIFICATION FOR UNREGISTERED ACCOUNT EMAIL", func() {
		msg, statusCode, data, err := tuss.TestEnv.Services.UserService.VerifyAccount(
			dto.VerifyAccountDTO{
				Email: Incorrect_Email,
				Code:  111111,
			},
		)
		assert.Equal(tuss.T(), "Unregistered Email Address.", msg)
		assert.Equal(tuss.T(), http.StatusBadRequest, statusCode)
		assert.Equal(tuss.T(), nil, data)
		assert.Equal(tuss.T(), nil, err)
	})

	tuss.Run("ACCOUNT VERIFICATION INCORRECT VERIFICATION CODE", func() {
		msg, statusCode, data, err := tuss.TestEnv.Services.UserService.VerifyAccount(
			dto.VerifyAccountDTO{
				Email: Email,
				Code:  111111,
			},
		)
		assert.Equal(tuss.T(), "Incorrect verification code", msg)
		assert.Equal(tuss.T(), http.StatusBadRequest, statusCode)
		assert.Equal(tuss.T(), nil, data)
		assert.Equal(tuss.T(), nil, err)
	})

	tuss.Run("ACCOUNT VERIFICATION SUCCESSFUL", func() {
		userModel, error := tuss.TestEnv.Repo.UserRepository.GetUserWithEmail(Email)
		assert.Equal(tuss.T(), nil, error)
		msg, statusCode, data, err := tuss.TestEnv.Services.UserService.VerifyAccount(
			dto.VerifyAccountDTO{
				Email: Email,
				Code:  userModel.AccountVerificationCode,
			},
		)
		assert.Equal(tuss.T(), "Account verification status updated successfully", msg)
		assert.Equal(tuss.T(), http.StatusOK, statusCode)
		assert.Equal(tuss.T(), nil, data)
		assert.Equal(tuss.T(), nil, err)
	})
}

func (tuss *TestUserServiceSuite) TestGetVerificationCode() {

	tuss.Run("RESEND VERIFICATION CODE VIA EMAIL", func() {
		msg, statusCode, data, err := tuss.TestEnv.Services.UserService.GetVerificationCode(
			dto.GetVerificationCodeDTO{
				Email: Email,
			},
		)
		assert.Equal(tuss.T(), "If you are registered, you will get verification code in your mail", msg)
		assert.Equal(tuss.T(), http.StatusOK, statusCode)
		assert.Equal(tuss.T(), nil, data)
		assert.Equal(tuss.T(), nil, err)
	})

	tuss.Run("RESEND VERIFICATION CODE VIA EMAIL FOR INVALID EMAIL", func() {
		msg, statusCode, data, err := tuss.TestEnv.Services.UserService.GetVerificationCode(
			dto.GetVerificationCodeDTO{
				Email: Incorrect_Email,
			},
		)
		assert.Equal(tuss.T(), "If you are registered, you will get verification code in your mail", msg)
		assert.Equal(tuss.T(), http.StatusOK, statusCode)
		assert.Equal(tuss.T(), nil, data)
		assert.Equal(tuss.T(), nil, err)
	})
}

func (tuss *TestUserServiceSuite) TestResetPassword() {

	const processingFailedMessage = "Unable to Send Password Reset Email."
	const processingSuceededMessage = "Reset password link shared successfully."

	type TestData struct {
		testId             int
		testName           string
		testType           string
		resetPasswordInput dto.ResetPasswordDTO
		ExpectedMessage    string
		ExpectedStatusCode int
		ExpectedData       any
		ExpectedError      error
	}
	testData := []TestData{
		{
			testId:             1,
			testType:           "SUCCESS",
			testName:           "Send Reset Password Link Successfully-200",
			resetPasswordInput: dto.ResetPasswordDTO{Email: "dummy_user@gmail.com"},
			ExpectedMessage:    processingSuceededMessage,
			ExpectedStatusCode: http.StatusOK,
			ExpectedData:       nil,
			ExpectedError:      nil,
		},
		{
			testId:             2,
			testType:           "FAILURE",
			testName:           "Non existing user-400",
			resetPasswordInput: dto.ResetPasswordDTO{Email: "dummy1_user@gmail.com"},
			ExpectedMessage:    "Unregistered Email Address.",
			ExpectedStatusCode: http.StatusBadRequest,
			ExpectedData:       nil,
			ExpectedError:      nil,
		},
	}

	for _, test := range testData {

		tuss.Run(test.testName, func() {
			msg, statusCode, data, err := tuss.TestEnv.Services.UserService.ResetPassword(test.resetPasswordInput)

			assert.Equal(tuss.T(), test.ExpectedMessage, msg)
			assert.Equal(tuss.T(), test.ExpectedStatusCode, statusCode)
			assert.Equal(tuss.T(), test.ExpectedData, data)
			assert.Equal(tuss.T(), test.ExpectedError, err)
		})
	}

}

func (tuss *TestUserServiceSuite) TestUpdatePassword() {

	const processingFailedMessage = "Unable to update user password"
	const processingSuceededMessage = "Password Updated Successfully."

	validResetPasswordToken, _ := utils.GenerateResetPasswordToken("dummy_user@gmail.com")

	expiredJwtToken := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTQxODk5MjUsImlzX3VzZWQiOmZhbHNlLCJzdWIiOiJkdW1teV91c2VyQGdtYWlsLmNvbSJ9.DpPBx64hA15FtYTiaAJTjbquGmi7vUZKpXwkzhek1Nk"

	type TestData struct {
		testId              int
		testName            string
		testType            string
		updatePasswordInput dto.UpdatePasswordDTO
		ExpectedMessage     string
		ExpectedStatusCode  int
		ExpectedData        any
		ExpectedError       any
	}
	testData := []TestData{
		{
			testId:              1,
			testType:            "SUCCESS",
			testName:            "Successfully Update Password-200",
			updatePasswordInput: dto.UpdatePasswordDTO{Password: "some-random-text", ResetPasswordToken: validResetPasswordToken},
			ExpectedMessage:     processingSuceededMessage,
			ExpectedStatusCode:  http.StatusOK,
			ExpectedData:        nil,
			ExpectedError:       nil,
		},
		{
			testId:              2,
			testType:            "FAILURE",
			testName:            "Expired JWT Token-400",
			updatePasswordInput: dto.UpdatePasswordDTO{Password: "some-random-text", ResetPasswordToken: expiredJwtToken},
			ExpectedMessage:     processingFailedMessage,
			ExpectedStatusCode:  http.StatusBadRequest,
			ExpectedData:        nil,
			ExpectedError:       "Expired Reset password link.",
		},
	}

	for _, test := range testData {

		tuss.Run(test.testName, func() {
			msg, statusCode, data, err := tuss.TestEnv.Services.UserService.UpdatePassword(test.updatePasswordInput)

			assert.Equal(tuss.T(), test.ExpectedMessage, msg)
			assert.Equal(tuss.T(), test.ExpectedStatusCode, statusCode)
			assert.Equal(tuss.T(), test.ExpectedData, data)
			assert.Equal(tuss.T(), test.ExpectedError, err)
		})
	}

}

func (tuss *TestUserServiceSuite) TestLogout() {

	// processingFailedMessage := "Unable to Logout User!"
	processingSucceededMessage := "Successfully  Logged Out User!"

	validAccessToken := utils.GenerateAccessToken("dummy_user@gmail.com")

	type TestData struct {
		testId             int
		testName           string
		testType           string
		accessToken        string
		ExpectedMessage    string
		ExpectedStatusCode int
		ExpectedData       any
		ExpectedError      any
	}
	testData := []TestData{
		{
			testId:             1,
			testType:           "SUCCESS",
			testName:           "Successfully Logged Out-200",
			accessToken:        validAccessToken,
			ExpectedMessage:    processingSucceededMessage,
			ExpectedStatusCode: http.StatusOK,
			ExpectedData:       nil,
			ExpectedError:      nil,
		},
	}

	for _, test := range testData {

		tuss.Run(test.testName, func() {
			msg, statusCode, data, err := tuss.TestEnv.Services.UserService.Logout(test.accessToken)

			assert.Equal(tuss.T(), test.ExpectedMessage, msg)
			assert.Equal(tuss.T(), test.ExpectedStatusCode, statusCode)
			assert.Equal(tuss.T(), test.ExpectedData, data)
			assert.Equal(tuss.T(), test.ExpectedError, err)
		})
	}

	tuss.TestEnv.App.RedisConfig.Client.Del(context.TODO(), validAccessToken)

}

func (ttss *TestUserServiceSuite) ZTestChangePassword() {

	const processingFailedMessage = "Current Password is Incorrect!"
	const processingSuceededMessage = "Updated the password"

	type TestData struct {
		testId             int
		testName           string
		testType           string
		changePasswordDTO  dto.ChangePasswordDTO
		ExpectedMessage    string
		ExpectedStatusCode int
		ExpectedData       any
		ExpectedError      error
	}
	testData := []TestData{
		{
			testId:             1,
			testType:           "SUCCESS",
			testName:           "Change Password-200",
			changePasswordDTO:  dto.ChangePasswordDTO{OldPassword: "Dummy@123", NewPassword: "Dummy@123"},
			ExpectedMessage:    processingSuceededMessage,
			ExpectedStatusCode: http.StatusOK,
			ExpectedData:       nil,
			ExpectedError:      nil,
		},
		{
			testId:             2,
			testType:           "FAILURE",
			testName:           "Incorrect Old Password-400",
			changePasswordDTO:  dto.ChangePasswordDTO{OldPassword: "Dummy@12", NewPassword: "Dummy@123"},
			ExpectedMessage:    processingFailedMessage,
			ExpectedStatusCode: http.StatusBadRequest,
			ExpectedData:       nil,
			ExpectedError:      struct_errors.BadRequestError{Message: "Incorrect Password.", Err: nil},
		},
	}

	for _, test := range testData {

		ttss.Run(test.testName, func() {
			msg, statusCode, data, err := ttss.TestEnv.Services.UserService.ChangeUserPassword("dummy_user@gmail.com", test.changePasswordDTO)

			assert.Equal(ttss.T(), test.ExpectedMessage, msg)
			assert.Equal(ttss.T(), test.ExpectedStatusCode, statusCode)
			assert.Equal(ttss.T(), test.ExpectedData, data)
			assert.Equal(ttss.T(), test.ExpectedError, err)
		})
	}

}

func (ttss *TestUserServiceSuite) TestGetUserDetails() {

	type TestData struct {
		testId             int
		testName           string
		testType           string
		InputEmail         string
		ExpectedMessage    string
		ExpectedStatusCode int
		ExpectedData       any
		ExpectedError      error
	}
	testData := []TestData{
		{
			testId:             1,
			testType:           "SUCCESS",
			testName:           "Get user details success-200",
			InputEmail:         "dummy_user@gmail.com",
			ExpectedMessage:    "Got user details",
			ExpectedStatusCode: http.StatusOK,
			ExpectedData:       dto.GetUserDetails{Name: "Dummy User", Email: "dummy_user@gmail.com", Phone: ""},
			ExpectedError:      nil,
		},
		{
			testId:             2,
			testType:           "FAILURE",
			testName:           "Get user details fail-404",
			InputEmail:         "incorrect_user@gmail.com",
			ExpectedMessage:    "User with Given email does not exist.",
			ExpectedStatusCode: http.StatusNotFound,
			ExpectedData:       nil,
			ExpectedError:      nil,
		},
	}

	for _, test := range testData {

		ttss.Run(test.testName, func() {
			msg, statusCode, data, err := ttss.TestEnv.Services.UserService.GetUserDetails(test.InputEmail)

			assert.Equal(ttss.T(), test.ExpectedMessage, msg)
			assert.Equal(ttss.T(), test.ExpectedStatusCode, statusCode)
			assert.Equal(ttss.T(), test.ExpectedData, data)
			assert.Equal(ttss.T(), test.ExpectedError, err)
		})
	}
}

func (ttss *TestUserServiceSuite) TestUpdateUserDetails() {

	type TestData struct {
		testId             int
		testName           string
		testType           string
		InputEmail         string
		InputData          dto.UpdateUserDetails
		ExpectedMessage    string
		ExpectedStatusCode int
		ExpectedData       any
		ExpectedError      error
	}
	testData := []TestData{
		{
			testId:             1,
			testType:           "SUCCESS",
			testName:           "Update user details-200",
			InputEmail:         "dummy_user@gmail.com",
			InputData:          dto.UpdateUserDetails{Name: "Dummy User", Phone: ""},
			ExpectedMessage:    "Updated new user details",
			ExpectedStatusCode: http.StatusOK,
			ExpectedData:       nil,
			ExpectedError:      nil,
		},
		{
			testId:             2,
			testType:           "FAILURE",
			testName:           "Update user details failed-404",
			InputEmail:         "incorrect_user@gmail.com",
			InputData:          dto.UpdateUserDetails{Name: "Dummy User", Phone: "+91 9876543210"},
			ExpectedMessage:    "Updated new user details",
			ExpectedStatusCode: http.StatusOK,
			ExpectedData:       nil,
			ExpectedError:      nil,
		},
	}

	for _, test := range testData {

		ttss.Run(test.testName, func() {
			msg, statusCode, data, err := ttss.TestEnv.Services.UserService.UpdateUserDetails(test.InputEmail, test.InputData)

			assert.Equal(ttss.T(), test.ExpectedMessage, msg)
			assert.Equal(ttss.T(), test.ExpectedStatusCode, statusCode)
			assert.Equal(ttss.T(), test.ExpectedData, data)
			assert.Equal(ttss.T(), test.ExpectedError, err)
		})
	}
}
