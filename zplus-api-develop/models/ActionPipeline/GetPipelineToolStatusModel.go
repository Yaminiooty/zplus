package models_action_pipeline

import "go.mongodb.org/mongo-driver/bson/primitive"

type GetPipelineToolStatusModel struct {
	PipelineId          string             `bson:"pipeline_id"`
	ToolName            string             `bson:"tool_name"`
	Status              string             `bson:"status"`
	LastUpdateTimeStamp primitive.DateTime `bson:"status_update_time_stamp"`
}
