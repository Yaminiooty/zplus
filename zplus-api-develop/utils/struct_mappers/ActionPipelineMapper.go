package structmappers

import (
	dto_action_pipeline "sec-tool/dto/ActionPipline"
	models_action_pipeline "sec-tool/models/ActionPipeline"
)

func ActionPipelineResponseModelToDto(input []models_action_pipeline.GetPipelineToolStatusModel) *[]dto_action_pipeline.GetPipelineToolStatusDTO {
	var result []dto_action_pipeline.GetPipelineToolStatusDTO

	for _, pipelineToolStatus := range input {
		result = append(result, dto_action_pipeline.GetPipelineToolStatusDTO{
			PipelineId:          pipelineToolStatus.PipelineId,
			ToolName:            pipelineToolStatus.ToolName,
			Status:              pipelineToolStatus.Status,
			LastUpdateTimeStamp: pipelineToolStatus.LastUpdateTimeStamp,
		})
	}
	return &result
}

func PipelineToolResultModelToDto(input models_action_pipeline.PipelineResultModel) dto_action_pipeline.PipelineResultDTO {
	var result dto_action_pipeline.PipelineResultDTO

	result.Results.ExecutedCommand = input.Results.ExecutedCommand
	result.Results.ExecutionError = input.Results.ExecutionError
	result.Results.ExecutionMessage = input.Results.ExecutionMessage
	result.Results.ReportFiles = input.Results.ReportFiles
	result.Results.JsonReport = input.Results.JsonReport

	return result
}
