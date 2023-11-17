package dto

type UpdatePasswordDTO struct {
	Password           string `json:"password" binding:"required,valid_password"`
	ResetPasswordToken string `json:"token" binding:"required"`
}
