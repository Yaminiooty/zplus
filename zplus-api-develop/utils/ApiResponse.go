package utils

import (
	"encoding/json"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

type ApiResponse struct {
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
	Error   any    `json:"error,omitempty"`
}

func SendJSONResponse(message string, statusCode int, data any, err any, ctx *gin.Context) {
	if err != nil {
		errBytes, _ := json.MarshalIndent(err, "", "  ")
		log.Error(string(errBytes))
	}
	ctx.JSON(statusCode, ApiResponse{
		Message: message,
		Data:    data,
		Error:   err,
	})
}
