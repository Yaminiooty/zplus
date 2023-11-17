package utils

import (
	"os"
	struct_errors "sec-tool/structs/errors"
	"time"

	"github.com/dgrijalva/jwt-go"
)

func GenerateAccessToken(userID string) string {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["sub"] = userID
	claims["exp"] = time.Now().Add(time.Hour * 1).Unix() // Access token expires in 1 hour
	tokenString, _ := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	return tokenString
}

func GenerateRefreshToken(userID string) string {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["sub"] = userID
	claims["exp"] = time.Now().Add(time.Hour * 24 * 7).Unix() // Refresh token expires in 7 days
	tokenString, _ := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	return tokenString
}

func GenerateResetPasswordToken(email string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["sub"] = email
	claims["exp"] = time.Now().Add(time.Minute * 5).Unix()
	claims["is_used"] = false
	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", struct_errors.InternalServerError{Message: "Unable To Create Reset Password Token.", Err: err}
	}
	return tokenString, nil
}

func ValidateJWTToken(jwtTokenStr string) (*jwt.Token, error) {
	jwtToken, err := jwt.Parse(jwtTokenStr, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil {
		jwtValidationErrorCode := err.(*jwt.ValidationError).Errors
		var customErr error = nil
		if jwtValidationErrorCode == jwt.ValidationErrorMalformed {
			customErr = struct_errors.InvalidJwtTokenError{Message: "Malformed JWT Token.", Err: nil}
		} else if jwtValidationErrorCode == jwt.ValidationErrorExpired {
			customErr = struct_errors.InvalidJwtTokenError{Message: "Expired JWT Token.", Err: nil}
		}
		if customErr != nil {
			return nil, customErr
		}
		return nil, struct_errors.InternalServerError{Message: "Unable to Verify JWT Token.", Err: err}
	}
	return jwtToken, nil
}

func ValidateResetPasswordToken(resetPasswordTokenStr string) (string, error) {
	resetPasswordToken, err := ValidateJWTToken(resetPasswordTokenStr)
	if err != nil {
		return "", err
	}
	if resetPasswordToken.Claims.(jwt.MapClaims)["is_used"] == true {
		return "", struct_errors.InvalidJwtTokenError{Message: "Already used JWT Token.", Err: nil}
	}
	return resetPasswordToken.Claims.(jwt.MapClaims)["sub"].(string), nil
}

func ExtractClaims(inputToken string) (jwt.MapClaims, error) {
	token, _, err := new(jwt.Parser).ParseUnverified(inputToken, jwt.MapClaims{})
	if err != nil {
		return nil, err
	}
	claims, _ := token.Claims.(jwt.MapClaims)
	return claims, nil
}
