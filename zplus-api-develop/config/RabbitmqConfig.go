package config

import (
	"context"
	"fmt"
	struct_errors "sec-tool/structs/errors"
	structs_rabbitmq "sec-tool/structs/rabbitmq"
	"time"
	amqp "github.com/rabbitmq/amqp091-go"
)

type RabbitmqConfig struct {
	Connection *amqp.Connection
	Ctx        context.Context
	CancelFunc context.CancelFunc
	Uri        string
	Retries    int
}

func InitRabbitMQConnection(uri string, queueMetaData []structs_rabbitmq.QueueMetaData) (*RabbitmqConfig, error) {
	conn, err := amqp.Dial(uri)

	if err != nil {
		return nil, struct_errors.InternalServerError{Message: "Unable to initialize connection to rabbitmq server.", Err: err}
	}

	ch, err := conn.Channel()

	if err != nil {
		return nil, struct_errors.InternalServerError{Message: "Unable to initialize a channel to rabbitmq server.", Err: err}
	}

	defer ch.Close()

	for _, queue := range queueMetaData {
		_, err := ch.QueueDeclare(
			queue.Name,       // name
			queue.Durable,    // durable
			queue.AutoDelete, // delete when unused
			queue.Exclusive,  // exclusive
			queue.NoWait,     // no-wait
			queue.Args,       // arguments
		)

		if err != nil {
			return nil, struct_errors.InternalServerError{Message: fmt.Sprintf("Error occurred during creation of RabbitMQ Queue: %s", queue.Name), Err: err}
		}

	}
	ctx, cancelFunc := context.WithTimeout(context.Background(), 10*time.Second)

	return &RabbitmqConfig{Connection: conn, Ctx: ctx, CancelFunc: cancelFunc, Uri: uri, Retries: 1}, nil
}

func (rmc *RabbitmqConfig) ReConnect() error {
	conn, err := amqp.Dial(rmc.Uri)

	if err != nil {
		return struct_errors.InternalServerError{Message: "Unable to reconnect to rabbitmq server.", Err: err}
	}

	rmc.Connection = conn

	return nil

}
