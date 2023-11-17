import os
os.environ["RAY_memory_monitor_refresh_ms"]="0"
import ray
ray.init()

os.environ["PROJECT_ROOT_DIRECTORY"]=os.path.abspath(os.curdir)
import logging
from app.rabbitmq.consumer import RabbitMQConsumer
import dotenv
import pathlib

from app.utils.queue_metadata import get_queue_meta_data_list


if __name__ == "__main__":

    rabbitmq_consumer = None
    try:
        # Configure logging
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        )

        is_env_variables_loaded = dotenv.load_dotenv(pathlib.Path(".env"))

        if is_env_variables_loaded == False:
            logging.error("Unable to load Environment Variables.")
            os._exit(1)

        # Start RabbitMQ consumer
        rabbitmq_consumer = RabbitMQConsumer(
            os.getenv("RMQ_HOSTNAME"),
            os.getenv("RMQ_PORT"),
            os.getenv("RMQ_USERNAME"),
            os.getenv("RMQ_PASSWORD"),
            get_queue_meta_data_list(),
            {
                "host": os.getenv("OWASP_ZAP_HOSTNAME"),
                "port": os.getenv("OWASP_ZAP_PORT"),
                "api_key": os.getenv("OWASP_ZAP_API_KEY"),
            },
            {
                "username": os.getenv("DB_USERNAME"),
                "password": os.getenv("DB_PASSWORD"),
                "host": os.getenv("DB_HOSTNAME"),
                "database": os.getenv("DB_DATABASE_NAME"),
                "port": os.getenv("DB_PORT"),
                "collection": os.getenv("DB_COLLECTION_TOOLS_PIPELINE_NAME"),
            },
            {
                "socket_location": os.getenv("OPENVAS_SOCKET_LOCATION"),
                "username": os.getenv("OPENVAS_USERNAME"),
                "password": os.getenv("OPENVAS_PASSWORD"),
            },
            {
                "host": os.getenv("SQLMAP_HOSTNAME"),
                "port": os.getenv("SQLMAP_PORT"),
            },
            {
                "rpc_api": os.getenv("METASPLOIT_RPC_API")
            },
            os.getenv("PROJECT_ROOT_DIRECTORY")
        )
        rabbitmq_consumer.start_consuming()

    except Exception as ex:
        logging.error(ex)
    finally:
        if rabbitmq_consumer != None:
            rabbitmq_consumer.stop_consuming()
