import docker, dotenv, pathlib, os

dotenv.load_dotenv(pathlib.Path("..", "..", ".env"))
def execute_command_in_container(container_name, command):
    try:
        # Initialize the Docker client
        client = docker.DockerClient(base_url=os.getenv("DOCKER_REMOTE_URL"))

        # Get the container object by its name
        container = client.containers.get(container_name)

        # Execute the command inside the container
        exec_result = container.exec_run(command)

        # Get the command's exit code and output
        exit_code = exec_result.exit_code
        output = exec_result.output.decode("utf-8")

        # Return the exit code and output
        return exit_code, output
    except Exception as e:
        return 1, str(e)
