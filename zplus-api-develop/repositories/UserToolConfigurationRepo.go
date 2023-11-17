package repositories

import (
	"context"
	"sec-tool/config"
	model_tool_configuration "sec-tool/models/ToolConfigurationModel"
	struct_errors "sec-tool/structs/errors"
	"sec-tool/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserToolConfigurationRepo struct {
	DatabaseConfig *config.DatabaseConfig
	CollectionRef  *mongo.Collection
}

func NewUserToolConfigurationRepo(databaseConfig *config.DatabaseConfig, collectionName string) *UserToolConfigurationRepo {
	return &UserToolConfigurationRepo{DatabaseConfig: databaseConfig, CollectionRef: databaseConfig.DatabaseRef.Collection(collectionName)}
}

func (utcr *UserToolConfigurationRepo) GetConfigurationsByEmailAndTool(email string, tool string) (*model_tool_configuration.GetUserToolModel, error) {
	var data model_tool_configuration.GetUserToolModel
	result := utcr.CollectionRef.FindOne(context.TODO(), bson.M{"email": email, "tool_name": tool})
	err := result.Decode(&data)
	if err != nil {
		return nil, err
	}
	return &data, nil
}

func (utcr *UserToolConfigurationRepo) GetConfigurationsByEmail(email string) ([]model_tool_configuration.UserToolModel, error) {
	var data []model_tool_configuration.UserToolModel
	result, err := utcr.CollectionRef.Find(context.TODO(), bson.M{"email": email})

	if err != nil {
		return nil, err
	}
	result.All(context.TODO(), &data)
	return data, nil
}

func (utcr *UserToolConfigurationRepo) CreateDBToolConfigurationEntry(data model_tool_configuration.UserToolModel) error {
	data.Id = primitive.NewObjectID()
	_, err := utcr.CollectionRef.InsertOne(context.TODO(), data)
	if err != nil {
		return struct_errors.InternalServerError{Message: "Error occurred during inserting document.", Err: err}
	}
	return nil
}

func (utcr *UserToolConfigurationRepo) UpdateConfigurationByEmailAndTool(email string, tool string, data any) error {
	toUpdate := bson.M{"configuration": data, "modified_on": utils.GetCurrentDateTime()}
	result := utcr.CollectionRef.FindOneAndUpdate(context.TODO(), bson.M{"email": email, "tool_name": tool}, bson.M{"$set": toUpdate})
	err := result.Decode(result)
	if err != nil {
		return struct_errors.InternalServerError{Message: "Error occurred during updating Document for given email.", Err: result.Err()}
	}
	return nil
}
