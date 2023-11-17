package dto_tool_configuration

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type GetToolConfigurations struct {
	Tool          string             `json:"tool_name"`
	Time          primitive.DateTime `json:"timestamp"`
	Configuration bson.M             `json:"configuration"`
}
