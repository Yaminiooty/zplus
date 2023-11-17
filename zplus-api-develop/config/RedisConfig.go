package config

import (
	"context"
	struct_errors "sec-tool/structs/errors"
	"github.com/redis/go-redis/v9"
)

type RedisConfig struct {
	Client *redis.Client
}

func InitRedisConnection(uri string, username string, password string) (*RedisConfig, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     uri,
		Username: username,
		Password: password,
		DB:       0,
	})
	_, err := client.Ping(context.TODO()).Result()
	if err != nil {
		return nil, struct_errors.InternalServerError{Message: "Unable to initialize connection to Redis server.", Err: err}
	}

	return &RedisConfig{Client: client}, nil
}
