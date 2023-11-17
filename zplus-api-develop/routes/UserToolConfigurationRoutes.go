package routes

import (
	"sec-tool/controllers"

	"github.com/gin-gonic/gin"
)

type UserToolConfigurationRoutes struct {
	Router                          *gin.Engine
	UserToolConfigurationController *controllers.UserToolConfigurationController
}

func NewUserToolConfigurationRoutes(Router *gin.Engine, userToolConfigurationController *controllers.UserToolConfigurationController) *UserToolConfigurationRoutes {
	userToolConfigurationRoutes := &UserToolConfigurationRoutes{Router: Router, UserToolConfigurationController: userToolConfigurationController}
	userToolConfigurationRoutes.RegisterRoutes()
	return userToolConfigurationRoutes
}

func (utcr *UserToolConfigurationRoutes) RegisterRoutes() {
	utcr.Router.POST("/save_tool_configuration/:tool", utcr.UserToolConfigurationController.SaveUserToolConfiguration)
	utcr.Router.GET("/get_current_pipeline_configurations", utcr.UserToolConfigurationController.GetCurrentPipelineConfigurations)
	utcr.Router.POST("/metasploit_helper/search", utcr.UserToolConfigurationController.MetasploitHelperSearch)
	utcr.Router.POST("/metasploit_helper/options", utcr.UserToolConfigurationController.MetasploitHelperOptions)
}





