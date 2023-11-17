package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GenerateUUIDMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		requestId := uuid.New()
		ctx.Request.Header.Add("X-Request-ID", requestId.String())
	}
}
