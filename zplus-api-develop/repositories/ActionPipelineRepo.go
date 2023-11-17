package repositories

import (
	"context"
	"sec-tool/config"
	models_action_pipeline "sec-tool/models/ActionPipeline"
	struct_errors "sec-tool/structs/errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ActionPipelineRepo struct {
	DatabaseConfig *config.DatabaseConfig
	CollectionRef  *mongo.Collection
}

func NewActionPipelineRepo(databaseConfig *config.DatabaseConfig, collectionName string) *ActionPipelineRepo {
	return &ActionPipelineRepo{DatabaseConfig: databaseConfig, CollectionRef: databaseConfig.DatabaseRef.Collection(collectionName)}
}

func (apr *ActionPipelineRepo) CreateNewPipelineConfiguration(actionPipelineModel models_action_pipeline.ActionPipeLineModel) (*mongo.InsertOneResult, error) {
	result, err := apr.CollectionRef.InsertOne(context.TODO(), actionPipelineModel)

	if err != nil {
		return nil, struct_errors.InternalServerError{Message: "Error Occurred during inserting Action Pipeline Configuration."}
	}

	return result, nil
}

func (apr *ActionPipelineRepo) FindById(objectId primitive.ObjectID) ([]models_action_pipeline.ActionPipeLineModel, error) {

	var actionPipelineModel []models_action_pipeline.ActionPipeLineModel
	result, err := apr.CollectionRef.Find(context.TODO(), bson.M{
		"pipeline_id": objectId,
	})
	if err != nil {
		return nil, struct_errors.InternalServerError{Message: "Error occured during fetching documents.", Err: err}
	}
	result.All(context.TODO(), &actionPipelineModel)
	if len(actionPipelineModel) == 0 {
		return nil, struct_errors.NotFoundError{Message: "No Documents with given pipeline Id found.", Err: nil}
	}
	return actionPipelineModel, nil
}

func (apr *ActionPipelineRepo) UpdateStatusById(objectId primitive.ObjectID, newStatus string) error {

	_, err := apr.CollectionRef.UpdateOne(context.TODO(), bson.D{{"_id", objectId}}, bson.D{
		{"$set", bson.D{
			{"status", newStatus},
		}},
	})

	if err != nil {
		return struct_errors.InternalServerError{Message: "Unable to update status of the tool pipeline Document."}
	}

	return nil
}
func (apr *ActionPipelineRepo) GetToolsInPipeline(pipelineId string, email string) (*[]models_action_pipeline.GetPipelineToolStatusModel, error) {
	var pipelineToolData []models_action_pipeline.GetPipelineToolStatusModel
	pipeline_id, err := primitive.ObjectIDFromHex(pipelineId)
	if err != nil {
		return nil, struct_errors.InternalServerError{Message: "Error occurred during object id from hex.", Err: err}
	}
	filter := bson.M{"pipeline_id": pipeline_id, "email": email}
	projection := bson.M{"pipeline_id": 1, "status": 1, "tool_name": 1, "status_update_time_stamp": 1, "_id": 0}
	cursor, err := apr.CollectionRef.Find(context.TODO(), filter, options.Find().SetProjection(projection))
	if err != nil {
		return nil, struct_errors.InternalServerError{Message: "Error occurred during fetching documents.", Err: err}
	}
	cursor.All(context.TODO(), &pipelineToolData)
	return &pipelineToolData, nil
}

func (apr *ActionPipelineRepo) GetAvailableResultByPipelineIdAndToolName(pipelineId string, toolName string) (*models_action_pipeline.PipelineResultModel, error) {
	// var result bson.M
	var result models_action_pipeline.PipelineResultModel
	pipeline_id, err := primitive.ObjectIDFromHex(pipelineId)
	if err != nil {
		return nil, struct_errors.InternalServerError{Message: "Error occurred during object id from hex.", Err: err}
	}
	filter := bson.M{"pipeline_id": pipeline_id, "tool_name": toolName}
	opts := options.FindOne().SetProjection(bson.M{"results": 1, "_id": 0})
	doc_err := apr.CollectionRef.FindOne(context.TODO(), filter, opts).Decode(&result)
	if doc_err != nil {
		return nil, struct_errors.InternalServerError{Message: "Error occurred during fetching documents.", Err: err}
	}
	return &result, nil
}
