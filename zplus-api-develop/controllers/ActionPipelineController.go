package controllers

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	dto_action_pipeline "sec-tool/dto/ActionPipline"
	"sec-tool/logger"
	"sec-tool/services"
	"sec-tool/utils"
	"strings"
	"github.com/gin-gonic/gin"
)

type ActionPipelineController struct {
	ActionPipelineService *services.ActionPipelineService
}

func NewActionPipelineController(actionPipelineService *services.ActionPipelineService) *ActionPipelineController {
	return &ActionPipelineController{ActionPipelineService: actionPipelineService}
}

func (apc *ActionPipelineController) CreatePipeline(ctx *gin.Context) {
	logger.Info("ActionPipelineController", "CreatePipeline", "Create new pipeline process started", ctx.Request.Header.Get("X-Request-ID"))
	logger.Debug("ActionPipelineController", "CreatePipeline", "Payload verification successful", ctx.Request.Header.Get("X-Request-ID"))
	Message, StatusCode, Data, Error := apc.ActionPipelineService.CreatePipeline(ctx.GetHeader("user"), ctx.Request.Header.Get("X-Request-ID"))
	utils.SendJSONResponse(Message, StatusCode, Data, Error, ctx)
	logger.Info("ActionPipelineController", "CreatePipeline", "Finished Create new pipeline process.", ctx.Request.Header.Get("X-Request-ID"))
}

func (apc *ActionPipelineController) RunPipeline(ctx *gin.Context) {
	logger.Info("ActionPipelineController", "RunPipeline", "Run pipeline process started", ctx.Request.Header.Get("X-Request-ID"))
	pipelineId := ctx.Query("pipeline_id")
	if pipelineId == "" {
		utils.SendJSONResponse("Invalid Payload.", http.StatusBadRequest, nil, utils.BadRequestResponseBody{FieldName: "pipeline_id", ErrorMessage: "Missing the mandatory query parameter."}, ctx)
		return
	}
	logger.Debug("ActionPipelineController", "CreatePipeline", "Payload verification successful", ctx.Request.Header.Get("X-Request-ID"))
	Message, StatusCode, Data, Error := apc.ActionPipelineService.RunPipeline(ctx.GetHeader("user"), pipelineId, ctx.Request.Header.Get("X-Request-ID"))

	utils.SendJSONResponse(Message, StatusCode, Data, Error, ctx)
	logger.Info("ActionPipelineController", "RunPipeline", "Finished Run pipeline process.", ctx.Request.Header.Get("X-Request-ID"))
}
func (apc *ActionPipelineController) GetPipelineToolsStatus(ctx *gin.Context) {
	logger.Info("ActionPipelineController", "GetPipelineToolsStatus", "Getting tools status in pipeline started", ctx.Request.Header.Get("X-Request-ID"))
	pipelineId := ctx.Param("pipeline_id")
	email := ctx.Request.Header.Get("user")
	logger.Debug("ActionPipelineController", "GetPipelineToolsStatus", "Getting tools status for pipeline id "+pipelineId, ctx.Request.Header.Get("X-Request-ID"))
	Message, StatusCode, Data, Error := apc.ActionPipelineService.GetPipelineToolsStatus(pipelineId, email, ctx.Request.Header.Get("X-Request-ID"))
	utils.SendJSONResponse(Message, StatusCode, Data, Error, ctx)
	logger.Info("ActionPipelineController", "GetPipelineToolsStatus", "Getting tools status in pipeline finished", ctx.Request.Header.Get("X-Request-ID"))

}

func (apc *ActionPipelineController) GetAvailableResultByPipelineIdAndToolName(ctx *gin.Context) {
	logger.Info("ActionPipelineController", "GetAvailableResultByPipelineIdAndToolName", "Getting available result types by pipeline id and tool name", ctx.Request.Header.Get("X-Request-ID"))
	pipelineId := ctx.Query("pipeline_id")
	toolName := ctx.Query("tool_name")
	if pipelineId == "" || toolName == "" {
		logger.Debug("ActionPipelineController", "GetAvailableResultByPipelineIdAndToolName", "Payload verification failed", ctx.Request.Header.Get("X-Request-ID"))
		utils.SendJSONResponse("Provide valid query parameters", http.StatusBadRequest, nil, nil, ctx)
		return
	}
	logger.Debug("ActionPipelineController", "GetAvailableResultByPipelineIdAndToolName", "Payload verification successful", ctx.Request.Header.Get("X-Request-ID"))

	Message, StatusCode, Data, Error := apc.ActionPipelineService.GetAvailableResultByPipelineIdAndToolName(pipelineId, toolName,ctx.Request.Header.Get("X-Request-ID"))


	utils.SendJSONResponse(Message, StatusCode, Data, Error, ctx)
	logger.Info("ActionPipelineController", "GetAvailableResultByPipelineIdAndToolName", "Finished getting available result types by pipeline id and tool name", ctx.Request.Header.Get("X-Request-ID"))
}

func (apc *ActionPipelineController) DownloadToolGeneratedResultFile(ctx *gin.Context) {
	logger.Info("ActionPipelineController", "DownloadToolGeneratedResultFile", "Download result file started", ctx.Request.Header.Get("X-Request-ID"))
	pipelineId := ctx.Query("pipeline_id")
	toolName := ctx.Query("tool_name")
	fileExtension := ctx.Query("file_extension")
	if pipelineId == "" || toolName == "" {
		logger.Debug("ActionPipelineController", "DownloadToolGeneratedResultFile", "Payload verification failed", ctx.Request.Header.Get("X-Request-ID"))
		utils.SendJSONResponse("Provide valid query parameters", http.StatusBadRequest, nil, nil, ctx)
		return
	}
	logger.Debug("ActionPipelineController", "DownloadToolGeneratedResultFile", "Payload verification successful", ctx.Request.Header.Get("X-Request-ID"))
	fileNameWithExtension := pipelineId + "_" + toolName + "_report." + strings.ToLower(fileExtension)
	resultFilePath := filepath.Join(utils.RESULTS_FILE_PATH, toolName, fileNameWithExtension)
	ctx.Header("Content-Disposition", "attachment; filename="+fileNameWithExtension)
	ctx.Header("Content-Type", "application/octet-stream")
	ctx.File(resultFilePath)
	logger.Info("ActionPipelineController", "DownloadToolGeneratedResultFile", "Download result file finished", ctx.Request.Header.Get("X-Request-ID"))
}

func CreateResultFile(ctx *gin.Context) (string, bool, string) {
	logger.Info("ActionPipelineController", "CreateResultFile", "Create result file started", ctx.Request.Header.Get("X-Request-ID"))
	var data dto_action_pipeline.ReportDTO
	err := ctx.ShouldBindJSON(&data)
	if err != nil {
		logger.Error("ActionPipelineController", "CreateResultFile", "Payload verification failed", ctx.Request.Header.Get("X-Request-ID"))
		return "Invalid Payload.", false, ""
	}
	logger.Debug("ActionPipelineController", "CreateResultFile", "Payload verification successful", ctx.Request.Header.Get("X-Request-ID"))
	fileNameWithoutExtension := fmt.Sprintf("%s_%s", data.PipelineId, data.ToolName)
	filename := fileNameWithoutExtension + ".html"
	resultFilePath := filepath.Join(utils.RESULTS_FILE_PATH, filename)
	file, err := os.Create(resultFilePath)
	if err != nil {
		logger.Error("ActionPipelineController", "CreateResultFile", "Error creating file", ctx.Request.Header.Get("X-Request-ID"))
		return "Error occurred", false, ""
	}
	defer file.Close()
	htmlContent, err := ioutil.ReadFile(os.Getenv("REPORT_TEMPLATE_PATH"))
	if err != nil {
		logger.Error("ActionPipelineController", "CreateResultFile", "Error while reading template", ctx.Request.Header.Get("X-Request-ID"))
		return "Error while reading template", false, ""
	}
	formattedHTML := fmt.Sprintf(string(htmlContent), data.ToolHtmlData)
	_, err = file.WriteString(formattedHTML)
	if err != nil {
		logger.Error("ActionPipelineController", "CreateResultFile", "Error while writing to file", ctx.Request.Header.Get("X-Request-ID"))
		return "Error occurred", false, ""
	}
	pdffilename := fileNameWithoutExtension + ".pdf"
	pdfresultFilePath := filepath.Join(utils.RESULTS_FILE_PATH, pdffilename)
	utils.Convert_HTML_TO_PDF(resultFilePath, pdfresultFilePath)
	logger.Info("ActionPipelineController", "CreateResultFile", "Create result file finished", ctx.Request.Header.Get("X-Request-ID"))
	return "Report Created", true, fileNameWithoutExtension
}

func (apc *ActionPipelineController) EmailResultFile(ctx *gin.Context) {
	logger.Info("ActionPipelineController", "EmailResultFile", "Email result file started", ctx.Request.Header.Get("X-Request-ID"))
	userEmail := ctx.Request.Header.Get("user")
	Message, Flag, filename := CreateResultFile(ctx)
	if !Flag {
		utils.SendJSONResponse(Message, http.StatusInternalServerError, nil, nil, ctx)
	}
	resultFilePath := filepath.Join(utils.RESULTS_FILE_PATH, filename)
	if !utils.FileExists(resultFilePath+".html") && !utils.FileExists(resultFilePath+".pdf") {
		utils.SendJSONResponse("File does not exist (pdf/html), please proceed with file create", http.StatusBadRequest, nil, nil, ctx)
		return
	}
	error := utils.SendEmailWithToolReport(userEmail, resultFilePath)
	if error != nil {
		logger.Error("ActionPipelineController", "EmailResultFile", error.Error(), ctx.Request.Header.Get("X-Request-ID"))
		utils.SendJSONResponse("Error occurred while sending email with report", http.StatusInternalServerError, nil, nil, ctx)
		return
	}
	utils.SendJSONResponse("Email with report shared successfully", http.StatusOK, nil, nil, ctx)
	logger.Info("ActionPipelineController", "EmailResultFile", "Email result file finished", ctx.Request.Header.Get("X-Request-ID"))
}

func (apc *ActionPipelineController) DownloadResultFile(ctx *gin.Context) {
	logger.Info("ActionPipelineController", "DownloadResultFile", "Download result file started", ctx.Request.Header.Get("X-Request-ID"))
	fileType := ctx.Query("fileType")
	Message, Flag, filename := CreateResultFile(ctx)
	if !Flag {
		utils.SendJSONResponse(Message, http.StatusInternalServerError, nil, nil, ctx)
	}
	resultFilePath := filepath.Join(utils.RESULTS_FILE_PATH, filename)
	if !utils.FileExists(resultFilePath+".html") && !utils.FileExists(resultFilePath+".pdf") {
		utils.SendJSONResponse("File does not exist (pdf/html), please proceed with file create", http.StatusBadRequest, nil, nil, ctx)
		return
	}
	fileNameWithExtension := ""
	if fileType == "PDF" {
		fileNameWithExtension = filename + ".pdf"
		ctx.Header("Content-Disposition", "attachment; filename="+fileNameWithExtension)
		ctx.Header("Content-Type", "application/pdf")
		ctx.File(resultFilePath + ".pdf")
	} else {
		fileNameWithExtension = filename + ".html"
		ctx.Header("Content-Disposition", "attachment; filename="+fileNameWithExtension)
		ctx.Header("Content-Type", "application/octet-stream")
		ctx.File(resultFilePath + ".html")
	}
	logger.Info("ActionPipelineController", "DownloadResultFile", "Download result file finished", ctx.Request.Header.Get("X-Request-ID"))
}
