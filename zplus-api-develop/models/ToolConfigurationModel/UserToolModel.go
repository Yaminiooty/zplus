package model_tool_configuration

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserToolModel struct {
	Id            primitive.ObjectID `bson:"_id"`
	UserEmail     string             `bson:"email"`
	Tool          string             `bson:"tool_name"`
	ModifiedOn    primitive.DateTime `bson:"modified_on"`
	Configuration any                `bson:"configuration"`
}

type GetUserToolModel struct {
	Id            primitive.ObjectID `bson:"_id"`
	UserEmail     string             `bson:"email"`
	Tool          string             `bson:"tool_name"`
	ModifiedOn    primitive.DateTime `bson:"modified_on"`
	Configuration bson.M             `bson:"configuration"`
}
