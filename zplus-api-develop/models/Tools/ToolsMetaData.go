package models_tools

import "go.mongodb.org/mongo-driver/bson/primitive"

type ToolMetaData struct {
	Id          primitive.ObjectID `bson:"_id" json:"id"`
	Name        string             `bson:"name" json:"name"`
	Description string             `bson:"description" json:"description"`
	IsEnabled   bool               `bson:"is_enabled" json:"is_enabled"`
}
