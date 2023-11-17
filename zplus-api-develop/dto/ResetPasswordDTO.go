package dto

type ResetPasswordDTO struct {
	Email string `json:"email" binding:"required,email"`
}
