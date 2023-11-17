package models_tool_selection

import "go.mongodb.org/mongo-driver/bson/primitive"

type ToolSelectionModel struct {
	ToolId     primitive.ObjectID `bson:"tool_id"`
	ToolName   string             `bson:"tool_name"`
	IsSelected bool               `bson:"is_selected"`
}
