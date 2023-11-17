package repositories

import (
	"context"
	"errors"
	"sec-tool/config"
	models_tool_selection "sec-tool/models/ToolSelection"

	struct_errors "sec-tool/structs/errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ToolsSelectionRepo struct {
	DatabaseConfig *config.DatabaseConfig
	CollectionRef  *mongo.Collection
}

func NewToolsSelctionRepo(databaseConfig *config.DatabaseConfig, collectionName string) *ToolsSelectionRepo {
	return &ToolsSelectionRepo{DatabaseConfig: databaseConfig, CollectionRef: databaseConfig.DatabaseRef.Collection(collectionName)}
}

func (ur *ToolsSelectionRepo) CreateNewToolSelections(ObjUserModel *models_tool_selection.UserToolsSelectionModel) (*mongo.InsertOneResult, error) {
	result, err := ur.CollectionRef.InsertOne(context.TODO(), ObjUserModel)

	if err != nil {
		return nil, struct_errors.InternalServerError{Message: "Error occured during inserting Tool Selection document.", Err: err}
	}
	return result, nil
}

func (tsr *ToolsSelectionRepo) FindById(id primitive.ObjectID) (*models_tool_selection.UserToolsSelectionModel, error) {

	var userToolsSelectionModel models_tool_selection.UserToolsSelectionModel
	result := tsr.CollectionRef.FindOne(context.TODO(), bson.D{{Key: "_id", Value: id}})

	err := result.Decode(&userToolsSelectionModel)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, struct_errors.NotFoundError{Message: "Unable to find Tool Selection document with given Object Id.", Err: nil}
		}
		return nil, struct_errors.InternalServerError{Message: "Error occurred during fetching Tool Selection Document with given Object Id.", Err: result.Err()}

	}

	return &userToolsSelectionModel, nil
}

func (tr *ToolsSelectionRepo) UpdateById(userToolsSelection *models_tool_selection.UserToolsSelectionModel) error {
	var oldUserToolsSelection models_tool_selection.UserToolsSelectionModel

	result := tr.CollectionRef.FindOneAndReplace(context.TODO(), bson.M{"_id": userToolsSelection.UserId}, userToolsSelection)

	err := result.Decode(&oldUserToolsSelection)

	if err != nil {
		return struct_errors.InternalServerError{Message: "Error occurred during updating Tool Selection Document.", Err: result.Err()}
	}
	return nil

}
