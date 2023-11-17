package routes

import (
	"sec-tool/controllers"

	"github.com/gin-gonic/gin"
)

type ToolsSelectionRoutes struct {
	Router                   *gin.Engine
	ToolsSelectionController *controllers.ToolsSelectionController
}

func NewToolsSelectionRoutes(Router *gin.Engine, toolsSelectionController *controllers.ToolsSelectionController) *ToolsSelectionRoutes {
	toolsSelectionRoutes := &ToolsSelectionRoutes{Router: Router, ToolsSelectionController: toolsSelectionController}
	toolsSelectionRoutes.RegisterRoutes()
	return toolsSelectionRoutes
}

func (ur *ToolsSelectionRoutes) RegisterRoutes() {
	ur.Router.POST("/select-tools", ur.ToolsSelectionController.SelectTools)
	ur.Router.GET("/select-tools", ur.ToolsSelectionController.GetSelectedTools)
	ur.Router.GET("/tools", ur.ToolsSelectionController.GetTools)
}
