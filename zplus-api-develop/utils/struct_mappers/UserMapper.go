package structmappers

import (
	"sec-tool/dto"
	"sec-tool/models"
)

func CreateNewUserDtoToModel(userDto dto.CreteNewUserDTO) models.UserModel {
	var result models.UserModel
	result.Name = userDto.Name
	result.Email = userDto.Email
	result.Password = userDto.Password
	result.Phone = userDto.Phone
	result.TermsAcceptanceStatus = userDto.TermsAcceptanceStatus
	return result
}

func UserDtoToModel(userDto dto.UserDTO) models.UserModel {
	var result models.UserModel
	result.Email = userDto.Email
	result.Password = userDto.Password
	return result
}

func UserModelToDto(userModel models.UserModel) dto.UserDTO {
	var result dto.UserDTO
	result.Email = userModel.Email
	result.Password = userModel.Password
	return result
}

func UserModelSliceToDtoSlice(userModelSlice []models.UserModel) []dto.UserDTO {
	var result []dto.UserDTO
	for _, userModel := range userModelSlice {
		result = append(result, UserModelToDto(userModel))
	}
	return result
}
