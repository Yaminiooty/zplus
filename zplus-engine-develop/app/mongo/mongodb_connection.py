import pymongo
from bson.objectid import ObjectId
import logging

class MongoDBConnection:
    def __init__(self, mongo_db_env):
        self.database_name = mongo_db_env["database"]
        self.collection_name = mongo_db_env["collection"]
        
        self.uri = f"mongodb://{mongo_db_env['username']}:{mongo_db_env['password']}@{mongo_db_env['host']}:{mongo_db_env['port']}/?retryWrites=true&w=majority"
        
        self.logger = logging.getLogger(__name__)

    def insert_message(self, message):
        messages_collection = self.db["pipeline_task"]
        messages_collection.insert_one(message)

    def update_status_of_pipeline(
        self, document_id: str, **kwargs
    ):
        client=None
        try:
            self.logger.info("Obtaining Connecteion to mongo Db.")
            client = pymongo.MongoClient(self.uri)
            client.server_info()

            db = client[self.database_name]
            pipeline_collection = db[self.collection_name]
            
            self.logger.info("Obtained Connecteion to mongo Db.")
            
            object_id = ObjectId(document_id)

            query = {"_id": object_id}

            pipeline_collection.update_one(
                query, {"$set":kwargs}
            )
            self.logger.info("Updated Status in mongo Db.")
            
        except Exception as ex:
            self.logger.error(f"Unable to update the Pipeline status. {ex}")
        finally:
            client.close()
            self.logger.info("Closed the Connection to mongo Db.")
