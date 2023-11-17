package utils_rabbitmq

import (
	structs_rabbitmq "sec-tool/structs/rabbitmq"
	"sec-tool/utils"

	"golang.org/x/exp/slices"
)

type RMQQueues struct {
	RabbitMqQueueMetaData []structs_rabbitmq.QueueMetaData
}

func InitQueueMetaData() *RMQQueues {
	var rabbitMqQueueMetaData = []structs_rabbitmq.QueueMetaData{
		{Name: utils.RMQ_NMAP_TASK_CONFIGURATIONS_QUEUE_NAME, Durable: true, AutoDelete: false, Exclusive: false, NoWait: false, Args: nil, ToolName: utils.TOOL_NAME_NMAP},
		{Name: utils.RMQ_METASPLOIT_TASK_CONFIGURATIONS_QUEUE_NAME, Durable: true, AutoDelete: false, Exclusive: false, NoWait: false, Args: nil, ToolName: utils.TOOL_NAME_METASPLOIT},
		{Name: utils.RMQ_JMETER_TASK_CONFIGURATIONS_QUEUE_NAME, Durable: true, AutoDelete: false, Exclusive: false, NoWait: false, Args: nil, ToolName: utils.TOOL_NAME_JMETER},
		{Name: utils.RMQ_OPENVAS_TASK_CONFIGURATIONS_QUEUE_NAME, Durable: true, AutoDelete: false, Exclusive: false, NoWait: false, Args: nil, ToolName: utils.TOOL_NAME_OPENVAS},
		{Name: utils.RMQ_OWASPDEPENDENCY_TASK_CONFIGURATIONS_QUEUE_NAME, Durable: true, AutoDelete: false, Exclusive: false, NoWait: false, Args: nil, ToolName: utils.TOOL_NAME_OWASPDEPENDENCY},
		{Name: utils.RMQ_OWASPZAP_TASK_CONFIGURATIONS_QUEUE_NAME, Durable: true, AutoDelete: false, Exclusive: false, NoWait: false, Args: nil, ToolName: utils.TOOL_NAME_OWASPZAP},
		{Name: utils.RMQ_SQLMAP_TASK_CONFIGURATIONS_QUEUE_NAME, Durable: true, AutoDelete: false, Exclusive: false, NoWait: false, Args: nil, ToolName: utils.TOOL_NAME_SQLMAP},
	}
	return &RMQQueues{RabbitMqQueueMetaData: rabbitMqQueueMetaData}
}

func (rmq *RMQQueues) GetRabbitMQQueueMetaData() *[]structs_rabbitmq.QueueMetaData {
	return &rmq.RabbitMqQueueMetaData
}

func (rmq *RMQQueues) FindQueueMetaDataByName(queueName string) *structs_rabbitmq.QueueMetaData {

	idx := slices.IndexFunc(rmq.RabbitMqQueueMetaData, func(queue structs_rabbitmq.QueueMetaData) bool {
		return queue.Name == queueName
	})
	if idx == -1 {
		return nil
	}

	return &rmq.RabbitMqQueueMetaData[idx]
}

func (rmq *RMQQueues) FindQueueMetaDataByToolName(toolName string) *structs_rabbitmq.QueueMetaData {

	idx := slices.IndexFunc(rmq.RabbitMqQueueMetaData, func(queue structs_rabbitmq.QueueMetaData) bool {
		return queue.ToolName == toolName
	})
	if idx == -1 {
		return nil
	}

	return &rmq.RabbitMqQueueMetaData[idx]
}
