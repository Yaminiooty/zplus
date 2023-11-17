package structs_rabbitmq

import amqp "github.com/rabbitmq/amqp091-go"

type QueueMetaData struct {
	Name       string
	Durable    bool
	AutoDelete bool
	Exclusive  bool
	NoWait     bool
	Args       amqp.Table
	ToolName   string
}
