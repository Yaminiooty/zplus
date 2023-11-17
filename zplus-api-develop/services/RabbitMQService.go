package services

import (
	"encoding/json"
	models_action_pipeline "sec-tool/models/ActionPipeline"
	rabbitmq_producers "sec-tool/rabbitmq/producers"
	struct_errors "sec-tool/structs/errors"
)

type RabbitMQService struct {
	RabbitMQProducer *rabbitmq_producers.RabbitMQProducer
}

func NewRabbitMQService(rmqProducer *rabbitmq_producers.RabbitMQProducer) *RabbitMQService {

	return &RabbitMQService{RabbitMQProducer: rmqProducer}
}

func (nms *RabbitMQService) PushConfiguration(toolConfigModel models_action_pipeline.ActionPipeLineModel, toolName string) (*string, error) {

	processingFailedMessage := "Unable to create new  Task Configuration"
	processingSucceededMessage := "Task Configuration Created Successfully"

	message, err := json.Marshal(toolConfigModel)

	if err != nil {
		return &processingFailedMessage, struct_errors.InternalServerError{Message: "Error Occurred during serialization of tool configuration Object To JSON.", Err: err}
	}

	err = nms.RabbitMQProducer.SendTaskToQueue(message, toolName)

	if err != nil {
		return &processingFailedMessage, err
	}

	return &processingSucceededMessage, nil
}
