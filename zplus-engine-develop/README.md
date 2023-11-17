# zplus-engine
# Tornado RabbitMQ and MongoDB Integration

This is zplus-engine in Python Tornado framework that demonstrates how to consume tasks messages from RabbitMQ and process them, then write the results to MongoDB. The application includes a modular structure with an orchestrator class that handles various types of tasks based on message content.

## Prerequisites

Before running the application, make sure you have the following installed:

- Python 3.x
- RabbitMQ (Make sure it's running and properly configured)
- MongoDB (Make sure it's running and properly configured)
- Python packages listed in `requirements.txt`. You can install them using `pip install -r requirements.txt`.

## Project Structure

The project is organized as follows:

- `main.py`: The entry point of the Tornado application.
- `app/`: The main application folder.
  - `__init__.py`: Initialization file for the application package.
  - `orchestrator.py`: Contains the Orchestrator class that handles message processing and task execution.
  - `tasks.py`: Contains task classes (e.g., MetaSploitScanTask, OwaspZapScanTask, NmapScanTask) that implement specific task logic.
  - `rabbitmq/`: Folder for RabbitMQ related code.
    - `consumer.py`: The RabbitMQ consumer class that consumes messages and delegates tasks to the Orchestrator.
  - `mongo/`: Folder for MongoDB related code.
    - `mongodb_connection.py`: MongoDB connection and interaction code.

## Usage

1. Clone this repository to your local machine.

2. Install the required Python packages by running the following command in the project root directory:

   ```bash
   pip install -r requirements.txt

3. Create a .env file in the project root directory and configure MongoDB connection details as follows:

MONGODB_HOST=your_mongodb_host
MONGODB_PORT=your_mongodb_port
MONGODB_DATABASE=your_database_name

4. Run the Tornado application using the following command:
    ```bash
    python main.py

The application will start consuming messages from RabbitMQ, process them using the Orchestrator, and insert results into MongoDB.
