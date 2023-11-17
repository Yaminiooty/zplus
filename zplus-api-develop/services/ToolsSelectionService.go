package services

import (
	"errors"
	"net/http"
	"sec-tool/dto"
	"sec-tool/logger"
	models_tool_selection "sec-tool/models/ToolSelection"
	"sec-tool/repositories"
	"sec-tool/utils"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/exp/slices"
)

type ToolsSelectionService struct {
	ToolsSelectionRepo *repositories.ToolsSelectionRepo
	ToolsRepo          *repositories.ToolsRepo
	UserRepo           *repositories.UserRepo
}

func NewToolsSelectionService(toolsSelectionRepo *repositories.ToolsSelectionRepo, toolsRepo *repositories.ToolsRepo, userRepo *repositories.UserRepo) *ToolsSelectionService {
	return &ToolsSelectionService{ToolsSelectionRepo: toolsSelectionRepo, ToolsRepo: toolsRepo, UserRepo: userRepo}
}

func (tsc *ToolsSelectionService) SelectTools(selectToolsDTO dto.SelectedToolsDTO, requestId string) (string, int, any, any) {

	const processingFailedMessage = "Unable to update the Tool Selection."
	const processingSuceededMessage = "Successfully updated the Tool Selections."

	userInfo, err := tsc.UserRepo.GetUserWithEmail(selectToolsDTO.Email)

	if err != nil {
		logger.Error("ToolsSelectionService", "SelectTools", err.Error(), requestId)
		return processingFailedMessage, http.StatusInternalServerError, nil, err
	}

	userToolsSelection, err := tsc.ToolsSelectionRepo.FindById(userInfo.Id)

	selectionsExists := true

	if err != nil {
		if errors.Is(err, utils.NOT_FOUND_ERROR) {
			selectionsExists = false
		} else {
			logger.Error("ToolsSelectionService", "SelectTools", err.Error(), requestId)
			return processingFailedMessage, http.StatusInternalServerError, nil, err
		}
	}

	if !selectionsExists {
		userToolsSelection = &models_tool_selection.UserToolsSelectionModel{UserId: userInfo.Id, ToolSelections: []models_tool_selection.ToolSelectionModel{}}
	}

	tools, err := tsc.ToolsRepo.FindAll()

	if err != nil {
		logger.Error("ToolsSelectionService", "SelectTools", err.Error(), requestId)
		return processingFailedMessage, http.StatusInternalServerError, nil, err
	}

	for _, tool := range *tools {
		if !slices.ContainsFunc(userToolsSelection.ToolSelections, func(toolSelectionModel models_tool_selection.ToolSelectionModel) bool {
			return tool.Id == toolSelectionModel.ToolId
		}) {
			userToolsSelection.ToolSelections = append(userToolsSelection.ToolSelections, models_tool_selection.ToolSelectionModel{ToolId: tool.Id, ToolName: tool.Name, IsSelected: false})
		}
	}

	for idx, _ := range userToolsSelection.ToolSelections {

		if slices.ContainsFunc(selectToolsDTO.ToolIDs, func(id string) bool {
			objectId, _ := primitive.ObjectIDFromHex(id)
			return userToolsSelection.ToolSelections[idx].ToolId == objectId
		}) {
			userToolsSelection.ToolSelections[idx].IsSelected = true
		} else {
			userToolsSelection.ToolSelections[idx].IsSelected = false
		}
	}

	if selectionsExists {
		err = tsc.ToolsSelectionRepo.UpdateById(userToolsSelection)
	} else {
		_, err = tsc.ToolsSelectionRepo.CreateNewToolSelections(userToolsSelection)
	}

	if err != nil {
		logger.Error("ToolsSelectionService", "SelectTools", err.Error(), requestId)
		return processingFailedMessage, http.StatusInternalServerError, nil, err
	}

	return processingSuceededMessage, http.StatusOK, nil, nil
}
func (tsc *ToolsSelectionService) GetSelectedTools(email string, requestId string) (string, int, any, any) {

	const processingFailedMessage = "Unable to fetch Selected Tools."
	const processingSuceededMessage = "List Of Selected Tools."

	userInfo, err := tsc.UserRepo.GetUserWithEmail(email)

	if err != nil {
		logger.Error("ToolsSelectionService", "GetSelectedTools", err.Error(), requestId)
		return processingFailedMessage, http.StatusInternalServerError, nil, err
	}

	userSelectedTools, err := tsc.ToolsSelectionRepo.FindById(userInfo.Id)

	if err != nil {
		logger.Error("ToolsSelectionService", "GetSelectedTools", err.Error(), requestId)
		return processingFailedMessage, http.StatusInternalServerError, nil, err
	}

	var selectedToolsMeta = []dto.GetSelectedToolsDTO{}

	for _, selectedTool := range userSelectedTools.ToolSelections {
		if selectedTool.IsSelected {
			selectedToolsMeta = append(selectedToolsMeta, dto.GetSelectedToolsDTO{Id: selectedTool.ToolId, Name: selectedTool.ToolName})
		}
	}

	return processingSuceededMessage, http.StatusOK, selectedToolsMeta, nil
}

func (tsc *ToolsSelectionService) GetTools(requestId string) (string, int, any, any) {
	toolsList, err := tsc.ToolsRepo.FindAll()
	if err != nil {
		logger.Error("ToolsSelectionService", "GetTools", err.Error(), requestId)
		return "Unable to fetch User Details", http.StatusInternalServerError, nil, err
	}
	// UserDtoList := structmappers.UserModelSliceToDtoSlice(*toolsList)
	return "List Of Tools", http.StatusOK, toolsList, nil
}
