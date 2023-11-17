package utils

import (
	"regexp"
	"strings"
	"unicode"

	"github.com/go-playground/validator/v10"
)

func ValidatePassword(fl validator.FieldLevel) bool {
	password := fl.Field().String()
	if len(password) < 8 {
		return false
	}
	hasUppercase := false
	hasLowercase := false
	hasNumber := false
	hasSymbol := false
	for _, char := range password {
		if unicode.IsUpper(char) {
			hasUppercase = true
		} else if unicode.IsLower(char) {
			hasLowercase = true
		} else if unicode.IsNumber(char) {
			hasNumber = true
		} else if strings.ContainsAny(string(char), "!@#$%^&*()_+{}[]:;<>,.?") {
			hasSymbol = true
		}
	}

	return hasUppercase && hasLowercase && hasNumber && hasSymbol
}

func ValidatePhone(fl validator.FieldLevel) bool {
	phone := fl.Field().String()
	return CheckPhone(phone)
}

func CheckPhone(phone string) bool {
	res1, e := regexp.MatchString(`^\+(\d{1,3}[- ]?)?\d{7,15}$`, phone)
	if e != nil {
		return false
	}
	return res1
}

func ValidateEmail(email string) bool {
	regex := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
	result, _ := regexp.MatchString(regex, email)
	return result
}
