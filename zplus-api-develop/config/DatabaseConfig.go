package config

import (
	"context"
	struct_errors "sec-tool/structs/errors"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DatabaseConfig struct {
	DbClient    *mongo.Client
	DatabaseRef *mongo.Database
	CancelFunc  context.CancelFunc
}

func InitDatabaseConnection(uri string, databaseName string) (*DatabaseConfig, error) {
	ctx, cancelFunc := context.WithTimeout(context.Background(), 20*time.Second)

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		cancelFunc() 
		return nil, struct_errors.InternalServerError{Message: "Unable to initialize connection to Mongodb server.", Err: err}
	}
	err = client.Ping(context.Background(), nil)
	if err != nil {
		cancelFunc() 
		return nil, struct_errors.InternalServerError{Message: "Unable to initialize connection to Mongodb server.", Err: err}
	}
	return &DatabaseConfig{DbClient: client, DatabaseRef: client.Database(databaseName), CancelFunc: cancelFunc}, nil
}
