package models_tool_selection

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserToolsSelectionModel struct {
	UserId         primitive.ObjectID   `bson:"_id"`
	ToolSelections []ToolSelectionModel `bson:"tool_selections"`
}
