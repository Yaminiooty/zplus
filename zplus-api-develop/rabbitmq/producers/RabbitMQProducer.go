package rabbitmq_producers

import (
	"fmt"
	"sec-tool/config"
	struct_errors "sec-tool/structs/errors"
	utils_rabbitmq "sec-tool/utils/rabbitmq"

	amqp "github.com/rabbitmq/amqp091-go"
)

type RabbitMQProducer struct {
	RabbitmqConfig   *config.RabbitmqConfig
	RMQQueueMetaData *utils_rabbitmq.RMQQueues
}

func NewRabbitMQProducer(rabbitmqConfig *config.RabbitmqConfig, rMQQueueMetaData *utils_rabbitmq.RMQQueues) *RabbitMQProducer {
	return &RabbitMQProducer{RabbitmqConfig: rabbitmqConfig, RMQQueueMetaData: rMQQueueMetaData}
}

func (rmp *RabbitMQProducer) SendTaskToQueue(message []byte, toolName string) error {

	queueMeta := rmp.RMQQueueMetaData.FindQueueMetaDataByToolName(toolName)
	channel, err := rmp.RabbitmqConfig.Connection.Channel()
	if err != nil {
		if err.(*amqp.Error).Code == 504 && rmp.RabbitmqConfig.Retries != 0 {
			rmp.RabbitmqConfig.Retries = rmp.RabbitmqConfig.Retries - 1

			rmp.RabbitmqConfig.ReConnect()

			err = rmp.SendTaskToQueue(message, toolName)
			if err != nil {
				return struct_errors.InternalServerError{Message: fmt.Sprintf("Unable to Send message to Queue: %s .", queueMeta.Name), Err: err}
			}
			rmp.RabbitmqConfig.Retries = rmp.RabbitmqConfig.Retries + 1
			return nil
		} else {
			return struct_errors.InternalServerError{Message: fmt.Sprintf("Unable to Send message to Queue: %s .", queueMeta.Name), Err: err}
		}
	}
	defer channel.Close()

	channel.PublishWithContext(rmp.RabbitmqConfig.Ctx, "", queueMeta.Name, false, false,
		amqp.Publishing{
			DeliveryMode: amqp.Persistent,
			Body:         message,
		},
	)

	return nil
}
