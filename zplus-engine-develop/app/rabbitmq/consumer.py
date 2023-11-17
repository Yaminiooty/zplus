import pika
import json
import logging
from app.orchestrator import Orchestrator
from app.utils.queue_metadata import QueueMetaData


class RabbitMQConsumer:
    def __init__(
        self,
        host,
        port,
        username,
        password,
        list_queue_metadata: list[QueueMetaData],
        owasp_zap_env: dict,
        mongo_db_env: dict,
        openvas_env: dict,
        sqlmap_env: dict,
        metasploit_env: dict,
        project_root_directory,
    ):
        self.list_queue_metadata = list_queue_metadata
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(
                host=host,
                port=port,
                credentials=pika.PlainCredentials(username=username, password=password),
            )
        )

        self.owasp_zap_env = owasp_zap_env
        self.mongo_db_env = mongo_db_env
        self.openvas_env = openvas_env
        self.sqlmap_env = sqlmap_env
        self.metasploit_env = metasploit_env

        self.project_root_directory = project_root_directory
        self.logger = logging.getLogger(__name__)

        self.channel = self.connection.channel()

        for queue_meta in list_queue_metadata:
            self.channel.queue_declare(
                queue=queue_meta.name,
                durable=queue_meta.durable,
                exclusive=queue_meta.exclusive,
                auto_delete=queue_meta.auto_delete,
                arguments=queue_meta.args,
            )

        self.channel.close()

    def start_consuming(self):
        channel = self.connection.channel()
        for queue_meta in self.list_queue_metadata:
            channel.basic_consume(
                queue=queue_meta.name, on_message_callback=self.callback, auto_ack=True
            )

        print("RabbitMQ Consumer is waiting for messages. To exit press Ctrl+C")
        channel.start_consuming()

    def callback(self, ch, method, properties, body):
        try:
            # Parse the JSON message
            message = json.loads(body.decode())
            # Process the message using the orchestrator
            orchestrator = Orchestrator.remote(
                self.owasp_zap_env,
                self.mongo_db_env,
                self.openvas_env,
                self.sqlmap_env,
                self.metasploit_env,
                self.project_root_directory,
            )
            orchestrator.process_message.remote(message)
        except Exception as e:
            self.logger.error(f"Error processing message: {e}")

    def stop_consuming(self):
        self.channel.stop_consuming()
        self.connection.close()
