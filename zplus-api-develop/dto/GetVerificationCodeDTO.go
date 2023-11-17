package dto

type GetVerificationCodeDTO struct {
	Email string `json:"email" binding:"required,email"`
}
