package utils

import (
	"errors"
	struct_errors "sec-tool/structs/errors"

	"golang.org/x/crypto/bcrypt"
)

func EncryptPassword(passwordToEncrypt string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(passwordToEncrypt), bcrypt.DefaultCost)
	if err != nil {
		return "", struct_errors.InternalServerError{Message: "Unable to Encrypt User Password.", Err: err}
	}
	return string(hashedPassword), nil
}

func VerifyPassword(hashedPassword, providedPassword string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(providedPassword))
	if err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return struct_errors.BadRequestError{Message: "Incorrect Password.", Err: nil}
		}
		return struct_errors.InternalServerError{Message: "Unable to Verify Password", Err: err}
	}
	return nil
}
