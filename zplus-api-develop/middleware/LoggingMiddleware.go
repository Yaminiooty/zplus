package middleware

import (
	"time"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

func LoggingMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {

		uuid := ctx.Request.Header.Get("X-Request-ID")
		// Starting time
		startTime := time.Now()
		// Processing request
		ctx.Next()
		// End Time
		endTime := time.Now()
		// execution time
		latencyTime := endTime.Sub(startTime)
		// Request method
		reqMethod := ctx.Request.Method
		// Request route
		reqUri := ctx.Request.RequestURI
		// status code
		statusCode := ctx.Writer.Status()
		// Request IP
		clientIP := ctx.ClientIP()

		log.WithFields(log.Fields{
			"UUID":      uuid,
			"METHOD":    reqMethod,
			"URI":       reqUri,
			"STATUS":    statusCode,
			"LATENCY":   latencyTime,
			"CLIENT_IP": clientIP,
		}).Info("HTTP REQUEST")

		ctx.Next()
	}
}
