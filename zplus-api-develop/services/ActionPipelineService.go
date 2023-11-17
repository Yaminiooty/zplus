package services

import (
	"errors"
	"net/http"
	dto_action_pipeline "sec-tool/dto/ActionPipline"
	"sec-tool/logger"
	models_action_pipeline "sec-tool/models/ActionPipeline"
	models_tool_selection "sec-tool/models/ToolSelection"
	"sec-tool/repositories"
	struct_errors "sec-tool/structs/errors"
	"sec-tool/utils"
	structmappers "sec-tool/utils/struct_mappers"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/exp/slices"
)

type ActionPipelineService struct {
	ActionPipelineRepo        *repositories.ActionPipelineRepo
	UserRepo                  *repositories.UserRepo
	UserToolConfigurationRepo *repositories.UserToolConfigurationRepo
	ToolsSelectionRepo        *repositories.ToolsSelectionRepo
	RabbitMQService           *RabbitMQService
}

func NewActionPipelineService(actionPipelineRepo *repositories.ActionPipelineRepo, rabbitMQService *RabbitMQService, userRepo *repositories.UserRepo, userToolConfigurationRepo *repositories.UserToolConfigurationRepo, toolsSelectionRepo *repositories.ToolsSelectionRepo) *ActionPipelineService {
	return &ActionPipelineService{ActionPipelineRepo: actionPipelineRepo, RabbitMQService: rabbitMQService, UserRepo: userRepo, UserToolConfigurationRepo: userToolConfigurationRepo, ToolsSelectionRepo: toolsSelectionRepo}
}

func (aps *ActionPipelineService) CreatePipeline(email string, requestID string) (string, int, any, any) {
	processingFailedMessage := "Unable to Creation Action Pipeline."
	processingSuccededMessage := "Pipeline Created Sucessfully."

	successResponseBody := dto_action_pipeline.ResponseCreateActionPipelineDTO{}

	userInfo, err := aps.UserRepo.GetUserWithEmail(email)
	if err != nil {
		logger.Error("ActionPipelineService", "CreatePipeline", err.Error(), requestID)
		return processingFailedMessage, http.StatusInternalServerError, nil, err
	}

	newPipelineId := primitive.NewObjectID()

	userToolConfigs, err := aps.UserToolConfigurationRepo.GetConfigurationsByEmail(userInfo.Email)
	if err != nil {
		logger.Error("ActionPipelineService", "CreatePipeline", err.Error(), requestID)
		return processingFailedMessage, http.StatusInternalServerError, nil, err
	}

	userToolsSelection, err := aps.ToolsSelectionRepo.FindById(userInfo.Id)
	if err != nil {
		logger.Error("ActionPipelineService", "CreatePipeline", err.Error(), requestID)
		return processingFailedMessage, http.StatusInternalServerError, nil, err
	}

	for _, toolConfig := range userToolConfigs {

		if slices.ContainsFunc(userToolsSelection.ToolSelections, func(toolSelection models_tool_selection.ToolSelectionModel) bool {
			return toolSelection.IsSelected && (toolConfig.Tool == toolSelection.ToolName)
		}) {

			toolPiplineStatus := dto_action_pipeline.ActionPipelineStatus{}
			toolPiplineStatus.ToolName = toolConfig.Tool

			actionPipeLineModel := models_action_pipeline.ActionPipeLineModel{}

			actionPipeLineModel.Id = primitive.NewObjectID()
			actionPipeLineModel.PipelineId = newPipelineId
			actionPipeLineModel.ConfigurationId = toolConfig.Id
			actionPipeLineModel.UserEmail = userInfo.Email
			actionPipeLineModel.Status = utils.PIPELINE_STATUS_PENDING
			actionPipeLineModel.LastUpdateTimeStamp = utils.GetCurrentDateTime()
			actionPipeLineModel.Tool = toolConfig.Tool
			actionPipeLineModel.Configuration = toolConfig.Configuration

			_, err := aps.ActionPipelineRepo.CreateNewPipelineConfiguration(actionPipeLineModel)
			if err != nil {
				errMsg := err.(struct_errors.InternalServerError).Message
				toolPiplineStatus.Status = utils.PIPELINE_STATUS_FAILED
				toolPiplineStatus.Error = &errMsg

				logger.Error("ActionPipelineService", "CreatePipeline", errMsg, requestID)
			}

			if err == nil {

				toolPiplineStatus.Status = utils.PIPELINE_STATUS_PENDING
				toolPiplineStatus.Error = nil
			}
			successResponseBody.ActionPipeLineStatus = append(successResponseBody.ActionPipeLineStatus, toolPiplineStatus)
		}
	}
	successResponseBody.PipelineId = newPipelineId.Hex()
	return processingSuccededMessage, http.StatusOK, successResponseBody, nil
}

func (aps *ActionPipelineService) RunPipeline(email string, pipelineId string, requestId string) (string, int, any, any) {

	processingFailedMessage := "Unable to Start Action Pipeline."
	processingSuccededMessage := "Pipeline Started for all the tools Sucessfully."

	objectId, _ := primitive.ObjectIDFromHex(pipelineId)
	toolConfigurations, err := aps.ActionPipelineRepo.FindById(objectId)

	if err != nil {
		if errors.Is(err, utils.NOT_FOUND_ERROR) {
			logger.Error("ActionPipelineService", "RunPipeline", "Invalid Pipeline ID", requestId)
			return processingFailedMessage, http.StatusBadRequest, nil, "Invalid Pipeline Id."
		}

		logger.Error("ActionPipelineService", "RunPipeline", err.Error(), requestId)
		return processingFailedMessage, http.StatusInternalServerError, nil, err
	}

	successResponseBody := []dto_action_pipeline.ActionPipelineStatus{}

	userInfo, _ := aps.UserRepo.GetUserWithEmail(email)

	userToolsSelection, err := aps.ToolsSelectionRepo.FindById(userInfo.Id)

	if err != nil {
		logger.Error("ActionPipelineService", "RunPipeline", err.Error(), requestId)
		return processingFailedMessage, http.StatusInternalServerError, nil, err
	}

	for _, toolConfig := range toolConfigurations {

		if slices.ContainsFunc(userToolsSelection.ToolSelections, func(toolSelection models_tool_selection.ToolSelectionModel) bool {
			return toolSelection.IsSelected && (toolConfig.Tool == toolSelection.ToolName)
		}) {

			toolPiplineStatus := dto_action_pipeline.ActionPipelineStatus{ToolName: toolConfig.Tool}

			_, err := aps.RabbitMQService.PushConfiguration(toolConfig, toolConfig.Tool)

			if err != nil {

				errMsg := err.(struct_errors.InternalServerError).Message
				toolPiplineStatus.Status = utils.PIPELINE_STATUS_FAILED
				toolPiplineStatus.Error = &errMsg

				logger.Error("ActionPipelineService", "RunPipeline", errMsg, requestId)

				processingSuccededMessage = "Pipeline for some of the tools could not be started."

			} else {
				toolPiplineStatus.Status = utils.PIPELINE_STATUS_IN_PROGRESS
			}
			aps.ActionPipelineRepo.UpdateStatusById(toolConfig.Id, toolPiplineStatus.Status)
			successResponseBody = append(successResponseBody, toolPiplineStatus)
		}
	}

	return processingSuccededMessage, 200, successResponseBody, nil
}

func (aps *ActionPipelineService) GetPipelineToolsStatus(pipelineId string, email string, requestId string) (string, int, any, any) {
	modelSlice, err := aps.ActionPipelineRepo.GetToolsInPipeline(pipelineId, email)
	if err != nil {
		logger.Error("ActionPipelineService", "GetPipelineToolsStatus", err.Error(), requestId)
		return "Error getting tool details from pipeline", http.StatusInternalServerError, nil, err
	}
	return "Got pipeline tools details", http.StatusOK, structmappers.ActionPipelineResponseModelToDto(*modelSlice), nil

}

func (aps *ActionPipelineService) GetAvailableResultByPipelineIdAndToolName(pipelineId string, toolName string, requestId string) (string, int, any, any) {

	result, err := aps.ActionPipelineRepo.GetAvailableResultByPipelineIdAndToolName(pipelineId, toolName)
	if err != nil {
		logger.Error("ActionPipelineService", "GetAvailableResultByPipelineIdAndToolName", err.Error(), requestId)
		return "Error getting available result type details from pipeline", http.StatusInternalServerError, nil, err
	}
	resutldto := structmappers.PipelineToolResultModelToDto(*result)
	return "Got available result type details", http.StatusOK, dto_action_pipeline.ResultJSONAndFiles{JsonReport: resutldto.Results.JsonReport, ReportFiles: resutldto.Results.ReportFiles}, nil
}
