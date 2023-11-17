package dto

import "go.mongodb.org/mongo-driver/bson/primitive"

type GetSelectedToolsDTO struct {
	Id   primitive.ObjectID `json:"id"`
	Name string             `json:"name"`
}
