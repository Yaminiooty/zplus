package dto_action_pipeline

type ReportDTO struct {
	PipelineId   string `json:"pipeline_id" binding:"required"`
	ToolName     string `json:"tool_name" binding:"required"`
	ToolHtmlData string `json:"data" binding:"required"`
}
