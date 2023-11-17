package services

import (
	"context"
	"errors"
	"net/http"
	"sec-tool/config"
	"sec-tool/dto"
	"sec-tool/logger"
	"sec-tool/repositories"
	struct_errors "sec-tool/structs/errors"
	"sec-tool/utils"
	structmappers "sec-tool/utils/struct_mappers"
	"strings"
	"time"
)

type UserService struct {
	UserRepo    *repositories.UserRepo
	RedisConfig *config.RedisConfig
}

func NewUserService(userRepo *repositories.UserRepo, redisConfig *config.RedisConfig) *UserService {
	return &UserService{UserRepo: userRepo, RedisConfig: redisConfig}
}

func (us *UserService) CreateNewUser(newUserDto dto.CreteNewUserDTO, requestId string) (Message string, StatusCode int, Data any, Error any) {
	err := us.UserRepo.CheckUserExistsByEmail(newUserDto.Email)
	if err != nil {
		if errors.Is(err, utils.BAD_REQUEST_ERROR) {
			return err.(struct_errors.BadRequestError).Message, http.StatusBadRequest, nil, nil
		}
		logger.Error("UserService", "CreateNewUser", err.Error(), requestId)
		return "Unable to create the User.", http.StatusInternalServerError, nil, err
	}
	encryptedPassword, err := utils.EncryptPassword(newUserDto.Password)
	if err != nil {
		logger.Error("UserService", "CreateNewUser", err.Error(), requestId)
		return "Unable to create the User.", http.StatusInternalServerError, nil, err
	}
	newUserDto.Password = encryptedPassword
	UserModel := structmappers.CreateNewUserDtoToModel(newUserDto)
	UserModel.AccountVerificationCode = utils.GetRandomSixDigitCode()
	result, err := us.UserRepo.CreateNewUser(&UserModel)
	if err != nil {
		logger.Error("UserService", "CreateNewUser", err.Error(), requestId)
		return "Unable to create the User.", http.StatusInternalServerError, nil, err
	}
	error := utils.SendEmailWithAccountVerificationCode(UserModel.Name, UserModel.Email, UserModel.AccountVerificationCode)
	if error != nil {
		logger.Error("UserService", "CreateNewUser", error.Error(), requestId)
		return "User Created, Error while sending email", http.StatusCreated, result, err
	}
	return "User Created Successfully!", http.StatusCreated, result, nil
}

func (us *UserService) LoginWithEmailAndPassword(inputUser dto.UserDTO, requestId string) (Message string, StatusCode int, Data any, Error any) {
	inputUserModel := structmappers.UserDtoToModel(inputUser)
	dBUser, err := us.UserRepo.GetUserWithEmail(inputUserModel.Email)
	if err != nil {
		if errors.Is(err, utils.NOT_FOUND_ERROR) {
			logger.Error("UserService", "LoginWithEmailAndPassword", "Incorrect Email or Password.", requestId)
			return "Incorrect Email or Password.", http.StatusUnauthorized, nil, nil
		}
		logger.Error("UserService", "LoginWithEmailAndPassword", err.Error(), requestId)
		return "Unable to Validate User credentials.", http.StatusInternalServerError, nil, nil
	}
	err = utils.VerifyPassword(dBUser.Password, inputUserModel.Password)
	if err != nil {
		if errors.Is(err, utils.BAD_REQUEST_ERROR) {
			logger.Error("UserService", "LoginWithEmailAndPassword", "Incorrect Email or Password.", requestId)
			return "Incorrect Email or Password.", http.StatusUnauthorized, nil, nil
		}
		logger.Error("UserService", "LoginWithEmailAndPassword", err.Error(), requestId)
		return "Unable to Validate User credentials.", http.StatusInternalServerError, nil, nil
	}
	if !dBUser.AccountVerificationStatus {
		return "Account is not verified", http.StatusAccepted, nil, nil
	}
	response := dto.LoginResponseModel{
		Access_token:  utils.GenerateAccessToken(inputUser.Email),
		Refresh_token: utils.GenerateRefreshToken(inputUser.Email),
	}
	return "Login Successful", http.StatusOK, response, nil
}

func (us *UserService) FindAll(requestId string) (string, int, any, any) {
	UserModelList, err := us.UserRepo.FindAll()
	if err != nil {
		logger.Error("UserService", "FindAll", err.Error(), requestId)
		return "Unable to fetch User Details", http.StatusInternalServerError, nil, err
	}
	UserDtoList := structmappers.UserModelSliceToDtoSlice(*UserModelList)
	return "List Of Users", http.StatusOK, UserDtoList, nil
}

func (us *UserService) FindById(objectIdHex string, requestId string) (string, int, any, any) {
	UserModel, err := us.UserRepo.FindById(objectIdHex)
	if err != nil {
		if errors.Is(err, utils.NOT_FOUND_ERROR) {
			logger.Error("UserService", "FindById", "User with Given Id does not exist.", requestId)
			return "User with Given Id does not exist.", http.StatusNotFound, nil, nil
		}
		logger.Error("UserService", "FindById", err.Error(), requestId)
		return "Unable to fetch User Data.", http.StatusInternalServerError, nil, err
	}
	return "User Data: " + objectIdHex, http.StatusOK, UserModel, nil
}

func (us *UserService) DeleteById(objectIdHex string, requestId string) (string, int, any, any) {
	err := us.UserRepo.DeleteById(objectIdHex)
	if err != nil {
		if errors.Is(err, utils.NOT_FOUND_ERROR) {
			logger.Error("UserService", "DeleteById", "User with Given Id does not exist.", requestId)
			return "User with Given Id does not exist.", http.StatusNotFound, nil, nil
		}
		logger.Error("UserService", "DeleteById", err.Error(), requestId)
		return "Unable to fetch User Data.", http.StatusInternalServerError, nil, err
	}
	return "User Deleted successfully : " + objectIdHex, http.StatusOK, nil, nil
}

func (us *UserService) ResetPassword(resetPasswordInput dto.ResetPasswordDTO, requestId string) (Message string, StatusCode int, Data any, Error any) {
	user, err := us.UserRepo.GetUserWithEmail(resetPasswordInput.Email)
	if err != nil {
		if errors.Is(err, utils.NOT_FOUND_ERROR) {
			logger.Error("UserService", "ResetPassword", "Unregistered Email Address.", requestId)
			return "Unregistered Email Address.", http.StatusBadRequest, nil, nil
		}
		logger.Error("UserService", "ResetPassword", err.Error(), requestId)
		return "Unable to Create Reset Password Token.", http.StatusInternalServerError, nil, err
	}
	resetPasswordToken, err := utils.GenerateResetPasswordToken(resetPasswordInput.Email)
	if err != nil {
		logger.Error("UserService", "ResetPassword", err.Error(), requestId)
		return "Unable to Create Reset Password Token.", http.StatusInternalServerError, nil, err
	}
	err = utils.SendEmail(user.Name, user.Email, resetPasswordToken)
	if err != nil {
		logger.Error("UserService", "ResetPassword", err.Error(), requestId)
		return "Unable to Send Password Reset Email.", http.StatusInternalServerError, nil, err
	}
	return "Reset password link shared successfully.", http.StatusOK, nil, nil
}

func (us *UserService) UpdatePassword(updatePasswordDto dto.UpdatePasswordDTO, requestId string) (Message string, StatusCode int, Data any, Error any) {
	email, err := utils.ValidateResetPasswordToken(updatePasswordDto.ResetPasswordToken)
	if err != nil {
		logger.Error("UserService", "UpdatePassword", "Expired Reset password link.", requestId)
		return "Unable to update user password", http.StatusBadRequest, nil, "Expired Reset password link."
	}
	encryptedPassword, err := utils.EncryptPassword(updatePasswordDto.Password)
	if err != nil {
		logger.Error("UserService", "UpdatePassword", err.Error(), requestId)
		return "Unable to update user password", http.StatusInternalServerError, nil, err
	}
	err = us.UserRepo.UpdateUserPasswordByEmail(email, encryptedPassword)
	if err != nil {
		logger.Error("UserService", "UpdatePassword", err.Error(), requestId)
		return "Unable to update user password", http.StatusInternalServerError, nil, err
	}
	return "Password Updated Successfully.", http.StatusOK, nil, nil
}
func (us *UserService) NewAccessToken(header string, requestId string) (string, int, any, any) {
	token := strings.Split(header, "Bearer ")[1]
	claims, err := utils.ExtractClaims(token)
	if err != nil {
		logger.Error("UserService", "NewAccessToken", err.Error(), requestId)
		return "Unable to generate new access token", http.StatusUnauthorized, nil, err
	}
	user := claims["sub"].(string)
	_, error := us.UserRepo.GetUserWithEmail(user)
	if error != nil {
		logger.Error("UserService", "NewAccessToken", err.Error(), requestId)
		return "Unable to generate new access token", http.StatusUnauthorized, nil, err
	}
	newAccessToken := utils.GenerateAccessToken(user)
	response := dto.LoginResponseModel{
		Access_token:  newAccessToken,
		Refresh_token: token,
	}
	return "New token generation successful", http.StatusOK, response, nil

}

func (us *UserService) Logout(jwtTokenStr string, requestId string) (string, int, any, any) {

	processingFailedMessage := "Unable to Logout User!"
	processingSucceededMessage := "Successfully  Logged Out User!"

	claims, _ := utils.ExtractClaims(jwtTokenStr)

	expClaim := claims["exp"]

	expClaimFloat := expClaim.(float64)

	var tm time.Time = time.Unix(int64(expClaimFloat), 0)

	expiresIn := tm.Sub(time.Now()).Seconds()

	durationExpiresIn := time.Duration(expiresIn * float64(time.Second))

	_, err := us.RedisConfig.Client.Set(context.TODO(), jwtTokenStr, nil, durationExpiresIn).Result()

	if err != nil {
		logger.Error("UserService", "Logout", err.Error(), requestId)
		return processingFailedMessage, http.StatusInternalServerError, nil, err
	}

	return processingSucceededMessage, http.StatusOK, nil, nil

}
func (us *UserService) VerifyAccount(verifyAccountDTO dto.VerifyAccountDTO, requestId string) (string, int, any, any) {
	user, err := us.UserRepo.GetUserWithEmail(verifyAccountDTO.Email)
	if err != nil {
		if errors.Is(err, utils.NOT_FOUND_ERROR) {
			logger.Error("UserService", "VerifyAccount", "Unregistered Email Address.", requestId)
			return "Unregistered Email Address.", http.StatusBadRequest, nil, nil
		}
		logger.Error("UserService", "VerifyAccount", err.Error(), requestId)
		return "Unable to verify account.", http.StatusInternalServerError, nil, err
	}
	if user.AccountVerificationCode != verifyAccountDTO.Code {
		return "Incorrect verification code", http.StatusBadRequest, nil, nil
	}
	error := us.UserRepo.UpdateAccountVerificationStatusByEmail(user.Email)
	if error != nil {
		logger.Error("UserService", "VerifyAccount", error.Error(), requestId)
		return "Unable to update account verification status", http.StatusInternalServerError, nil, error
	}
	return "Account verification status updated successfully", http.StatusOK, nil, nil
}

func (us *UserService) GetVerificationCode(getVerificationCodeDTOInput dto.GetVerificationCodeDTO, requestId string) (string, int, any, any) {
	user, err := us.UserRepo.GetUserWithEmail(getVerificationCodeDTOInput.Email)
	if err == nil {
		error := utils.SendEmailWithAccountVerificationCode(user.Name, user.Email, user.AccountVerificationCode)
		if error != nil {
			logger.Error("UserService", "GetVerificationCode", error.Error(), requestId)
			return "Error while sending email", http.StatusCreated, nil, err
		}
	}
	return "If you are registered, you will get verification code in your mail", http.StatusOK, nil, nil
}

func (us *UserService) GetUserDetails(email string, requestId string) (string, int, any, any) {
	UserModel, err := us.UserRepo.GetUserWithEmail(email)
	if err != nil {
		if errors.Is(err, utils.NOT_FOUND_ERROR) {
			logger.Error("UserService", "GetUserDetails", "User with Given email does not exist.", requestId)
			return "User with Given email does not exist.", http.StatusNotFound, nil, nil
		}
		logger.Error("UserService", "GetUserDetails", err.Error(), requestId)
		return "Unable to fetch User Data.", http.StatusInternalServerError, nil, err
	}
	return "Got user details", http.StatusOK, dto.GetUserDetails{Name: UserModel.Name, Email: UserModel.Email, Phone: UserModel.Phone}, nil
}

func (us *UserService) UpdateUserDetails(email string, newData dto.UpdateUserDetails, requestId string) (string, int, any, any) {
	if newData.Name != "" {
		err := us.UserRepo.UpdateUserNameByEmail(email, newData.Name)
		if err != nil {
			logger.Error("UserService", "UpdateUserDetails", err.Error(), requestId)
			if errors.Is(err, utils.NOT_FOUND_ERROR) {
				return "User with Given email does not exist.", http.StatusNotFound, nil, nil
			}
			return "Unable to fetch User Data.", http.StatusInternalServerError, nil, err
		}
	}
	if newData.Phone != "" {
		err := us.UserRepo.UpdateUserPhoneByEmail(email, newData.Phone)
		if err != nil {
			logger.Error("UserService", "UpdateUserDetails", err.Error(), requestId)
			if errors.Is(err, utils.NOT_FOUND_ERROR) {
				return "User with Given email does not exist.", http.StatusNotFound, nil, nil
			}
			return "Unable to fetch User Data.", http.StatusInternalServerError, nil, err
		}
	}
	return "Updated new user details", http.StatusOK, nil, nil
}

func (us *UserService) ChangeUserPassword(email string, changePasswordDTO dto.ChangePasswordDTO) (string, int, any, any) {

	user, _ := us.UserRepo.GetUserWithEmail(email)
	err := utils.VerifyPassword(user.Password, changePasswordDTO.OldPassword)
	if err != nil {
		if errors.Is(err, utils.BAD_REQUEST_ERROR) {
			return "Current Password is Incorrect!", http.StatusBadRequest, nil, err
		}
		return "Unable to update Password!", http.StatusInternalServerError, nil, err
	}
	encryptedPassword, err := utils.EncryptPassword(changePasswordDTO.NewPassword)
	if err != nil {
		return "Unable to update Password!", http.StatusInternalServerError, nil, err
	}

	err = us.UserRepo.UpdateUserPasswordByEmail(email, encryptedPassword)
	if err != nil {
		return "Unable to update Password!", http.StatusInternalServerError, nil, err
	}
	return "Updated the password", http.StatusOK, nil, nil
}
