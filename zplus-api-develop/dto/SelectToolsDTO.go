package dto

type SelectedToolsDTO struct {
	ToolIDs []string `json:"tool_ids" binding:"required"`
	Email   string   `json:"email"`
}
