package utils

import (
	"errors"
	"strings"

	"github.com/go-playground/validator/v10"
)

type BadRequestResponseBody struct {
	FieldName    string
	ErrorMessage string
}

func ParseBindingErrors(err error) []BadRequestResponseBody {
	var ve validator.ValidationErrors
	var result []BadRequestResponseBody
	errors.As(err, &ve)
	for _, fieldError := range ve {
		result = append(result, BadRequestResponseBody{
			FieldName:    strings.ToLower(fieldError.Field()),
			ErrorMessage: getErrorMsg(fieldError),
		})
	}
	if len(result) == 0 {
		result = append(result, BadRequestResponseBody{FieldName: "Request Body", ErrorMessage: "Missing mandatory fields from Request body."})
	}
	return result
}

func getErrorMsg(fe validator.FieldError) string {
	switch fe.Tag() {
	case "required":
		return " is required / mandatory."
	case "email":
		return " must have a valid email format."
	case "valid_password":
		return " must have a length greater than 8 and one uppercase character and one lowercase character and one number and one of the special characters (!@#$%^&*()_+{}[]:;<>,.?)."
	}
	return fe.Error()
}
