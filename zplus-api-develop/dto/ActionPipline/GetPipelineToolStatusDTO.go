package dto_action_pipeline

import "go.mongodb.org/mongo-driver/bson/primitive"

type GetPipelineToolStatusDTO struct {
	PipelineId          string             `json:"pipeline_id"`
	ToolName            string             `json:"tool_name"`
	Status              string             `json:"status"`
	LastUpdateTimeStamp primitive.DateTime `json:"status_update_time_stamp"`
}
