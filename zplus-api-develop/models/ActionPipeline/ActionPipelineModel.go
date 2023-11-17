package models_action_pipeline

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ActionPipeLineModel struct {
	Id                  primitive.ObjectID `bson:"_id" json:"_id"`
	ConfigurationId     primitive.ObjectID `bson:"configuration_id" json:"configuration_id"`
	PipelineId          primitive.ObjectID `bson:"pipeline_id" json:"pipeline_id"`
	UserEmail           string             `bson:"email" json:"email"`
	Tool                string             `bson:"tool_name" json:"tool_name"`
	Status              string             `bson:"status" json:"status"`
	LastUpdateTimeStamp primitive.DateTime `bson:"status_update_time_stamp" json:"status_update_time_stamp"`
	Configuration       any                `bson:"configuration" json:"configuration"`
}
