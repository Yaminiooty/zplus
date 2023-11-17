package structs

import (
	"sec-tool/config"

	"github.com/gin-gonic/gin"
)

type App struct {
	Router         *gin.Engine
	DbConfig       *config.DatabaseConfig
	RabbitMqConfig *config.RabbitmqConfig
	RedisConfig *config.RedisConfig
}
