import logging


def get_logger(filename):
    # Create a logger
    logger = logging.getLogger(filename)

    # Set the log level (you can adjust this as needed)
    logger.setLevel(logging.DEBUG)

    # Create a console handler and set the level to INFO
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)

    # Create a file handler to write logs to a file
    file_handler = logging.FileHandler('app.log')

    # Create a formatter and attach it to the handlers
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    console_handler.setFormatter(formatter)
    file_handler.setFormatter(formatter)

    # Add the handlers to the logger
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

    return logger
