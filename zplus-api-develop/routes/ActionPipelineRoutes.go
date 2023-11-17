package routes

import (
	"sec-tool/controllers"

	"github.com/gin-gonic/gin"
)

type ActionPipelineRoutes struct {
	Router                   *gin.Engine
	ActionPipelineController *controllers.ActionPipelineController
}

func NewActionPipelineRoutes(Router *gin.Engine, actionPipelineController *controllers.ActionPipelineController) *ActionPipelineRoutes {
	actionPipelineRoutes := &ActionPipelineRoutes{Router: Router, ActionPipelineController: actionPipelineController}
	actionPipelineRoutes.RegisterRoutes()
	return actionPipelineRoutes
}

func (apr *ActionPipelineRoutes) RegisterRoutes() {
	apr.Router.POST("/create-pipeline", apr.ActionPipelineController.CreatePipeline)
	apr.Router.POST("/run-pipeline", apr.ActionPipelineController.RunPipeline)
	apr.Router.GET("/action-pipeline-status/:pipeline_id", apr.ActionPipelineController.GetPipelineToolsStatus)
	apr.Router.GET("/get-available-result", apr.ActionPipelineController.GetAvailableResultByPipelineIdAndToolName)
	apr.Router.POST("/download-result-file", apr.ActionPipelineController.DownloadResultFile)
	apr.Router.POST("/email-result-file", apr.ActionPipelineController.EmailResultFile)
	apr.Router.GET("/download-tool-generated-result-file", apr.ActionPipelineController.DownloadToolGeneratedResultFile)
}
