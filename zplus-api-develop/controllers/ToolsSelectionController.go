package controllers

import (
	"net/http"
	"sec-tool/dto"
	"sec-tool/logger"
	"sec-tool/services"
	"sec-tool/utils"

	"github.com/gin-gonic/gin"
)

type ToolsSelectionController struct {
	ToolsSelectionService *services.ToolsSelectionService
}

func NewToolsSelectionController(toolsSelectionService *services.ToolsSelectionService) *ToolsSelectionController {
	return &ToolsSelectionController{ToolsSelectionService: toolsSelectionService}
}

func (tsc *ToolsSelectionController) SelectTools(ctx *gin.Context) {
	logger.Info("ToolsSelectionController", "SelectTools", "Tools Selection Started.", ctx.Request.Header.Get("X-Request-ID"))
	var selectToolsDTO dto.SelectedToolsDTO

	err := ctx.ShouldBindJSON(&selectToolsDTO)
	if err != nil {
		ErrorResponseBody := utils.ParseBindingErrors(err)
		logger.Error("ToolsSelectionController", "SelectTools", "Payload verification failed", ctx.Request.Header.Get("X-Request-ID"))
		utils.SendJSONResponse("Invalid Payload.", http.StatusBadRequest, nil, ErrorResponseBody, ctx)
		return
	}
	selectToolsDTO.Email = ctx.GetHeader("user")
	Message, StatusCode, Data, Error := tsc.ToolsSelectionService.SelectTools(selectToolsDTO, ctx.Request.Header.Get("X-Request-ID"))
	utils.SendJSONResponse(Message, StatusCode, Data, Error, ctx)
	logger.Info("ToolsSelectionController", "SelectTools", "Finished Tools Selection.", ctx.Request.Header.Get("X-Request-ID"))
}

func (tsc *ToolsSelectionController) GetSelectedTools(ctx *gin.Context) {

	logger.Info("ToolsSelectionController", "GetSelectedTools", "Get Tools Selection Started", ctx.Request.Header.Get("X-Request-ID"))
	email := ctx.GetHeader("user")
	Message, StatusCode, Data, Error := tsc.ToolsSelectionService.GetSelectedTools(email, ctx.Request.Header.Get("X-Request-ID"))
	utils.SendJSONResponse(Message, StatusCode, Data, Error, ctx)
	logger.Info("ToolsSelectionController", "GetSelectedTools", "Finished Get Tools Selection.", ctx.Request.Header.Get("X-Request-ID"))
}

func (tsc *ToolsSelectionController) GetTools(ctx *gin.Context) {
	logger.Info("ToolsSelectionController", "GetTools", "Get Tools Selection Started", ctx.Request.Header.Get("X-Request-ID"))
	Message, StatusCode, Data, Error := tsc.ToolsSelectionService.GetTools(ctx.Request.Header.Get("X-Request-ID"))
	utils.SendJSONResponse(Message, StatusCode, Data, Error, ctx)
	logger.Info("ToolsSelectionController", "GetTools", "Finished Get Tools Selection.", ctx.Request.Header.Get("X-Request-ID"))
}
