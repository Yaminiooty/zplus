package dto

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CreteNewUserDTO struct {
	Id                    primitive.ObjectID `json:"id,omitempty"`
	Name                  string             `json:"name" binding:"required"`
	Email                 string             `json:"email" binding:"required,email"`
	Password              string             `json:"password" binding:"required,valid_password"`
	Phone                 string             `json:"phone" binding:"required,valid_phone"`
	TermsAcceptanceStatus bool               `json:"termsAcceptanceStatus" binding:"required"`
}

type GetUserDetails struct {
	Name  string `json:"name" binding:"required"`
	Email string `json:"email" binding:"required,email"`
	Phone string `json:"phone" binding:"required,valid_phone"`
}

type UpdateUserDetails struct {
	Name  string `json:"name"`
	Phone string `json:"phone"`
}
