package repositories

import (
	"context"
	"errors"
	"sec-tool/config"
	models_tools "sec-tool/models/Tools"
	struct_errors "sec-tool/structs/errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/exp/slices"
)

type ToolsRepo struct {
	DatabaseConfig *config.DatabaseConfig
	CollectionRef  *mongo.Collection
}

func NewToolsRepo(databaseConfig *config.DatabaseConfig, collectionName string) *ToolsRepo {
	return &ToolsRepo{DatabaseConfig: databaseConfig, CollectionRef: databaseConfig.DatabaseRef.Collection(collectionName)}
}

func (tr *ToolsRepo) UpdateSupportedToolsMeta(newToolsMetaData []models_tools.ToolMetaData) error {
	toolsMetaData, err := tr.FindAll()

	if err != nil {
		return err
	}

	for _, newToolMetaData := range newToolsMetaData {
		idx := slices.IndexFunc(*toolsMetaData, func(toolMetaData models_tools.ToolMetaData) bool {
			return newToolMetaData.Name == toolMetaData.Name
		})

		if idx == -1 {
			newToolMetaData.Id = primitive.NewObjectID()
			_, err := tr.CreateNew(newToolMetaData)
			if err != nil {
				return err
			}
		} else {
			newToolMetaData.Id = (*toolsMetaData)[idx].Id
			err := tr.UpdateById(newToolMetaData)
			if err != nil {
				return err
			}
		}
	}
	return nil
}

func (tr *ToolsRepo) CreateNew(toolMetaData models_tools.ToolMetaData) (*mongo.InsertOneResult, error) {
	result, err := tr.CollectionRef.InsertOne(context.TODO(), toolMetaData)

	if err != nil {
		return nil, struct_errors.InternalServerError{Message: "Error Occurred during inserting Tool MetaData"}
	}

	return result, nil
}

func (tr *ToolsRepo) UpdateById(toolMetaData models_tools.ToolMetaData) error {
	var oldMetaData models_tools.ToolMetaData

	result := tr.CollectionRef.FindOneAndReplace(context.TODO(), bson.M{"_id": toolMetaData.Id}, toolMetaData)

	err := result.Decode(&oldMetaData)

	if err != nil {
		return struct_errors.InternalServerError{Message: "Error occurred during updating Document for Tool.", Err: result.Err()}
	}
	return nil

}

func (tr *ToolsRepo) FindAll() (*[]models_tools.ToolMetaData, error) {
	var toolsMetaData []models_tools.ToolMetaData

	result, err := tr.CollectionRef.Find(context.TODO(), bson.D{})

	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return &[]models_tools.ToolMetaData{}, nil
		}
		return nil, struct_errors.InternalServerError{Message: "Error occured during fetching Tools Metadata.", Err: err}
	}

	result.All(context.TODO(), &toolsMetaData)

	return &toolsMetaData, nil
}

func (tr *ToolsRepo) FindById(objectId primitive.ObjectID) (*models_tools.ToolMetaData, error) {
	var toolMetaData models_tools.ToolMetaData
	result := tr.CollectionRef.FindOne(context.TODO(), bson.D{})

	err := result.Decode(&toolMetaData)

	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, struct_errors.NotFoundError{Message: "Unable to find Tool document with given Object Id.", Err: nil}
		}

		return nil, struct_errors.InternalServerError{Message: "Error occurred during fetching Tool Document with given Object Id.", Err: result.Err()}
	}

	return &toolMetaData, nil
}
