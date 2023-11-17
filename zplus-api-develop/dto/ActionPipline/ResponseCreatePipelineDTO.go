package dto_action_pipeline

type ResponseCreateActionPipelineDTO struct {
	PipelineId           string                 `json:"pipeline_id"`
	ActionPipeLineStatus []ActionPipelineStatus `json:"action_pipeline_status"`
}
type ActionPipelineStatus struct {
	ToolName string  `json:"tool_name"`
	Status   string  `json:"status"`
	Error    *string `json:"error"`
}
