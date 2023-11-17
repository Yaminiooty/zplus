#! bash
input=$1

if [[ $# -gt 0 && ($input == "create") ]]
then
    docker run --name z_redis -d -p 6379:6379 redis redis-server --requirepass root

    docker run --name z_rabbitmq -d -e RABBITMQ_DEFAULT_USER=user -e RABBITMQ_DEFAULT_PASS=password -p 5672:5672 -p 8080:15672 rabbitmq:3-management

    docker run --name z_mongo -d  -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=root -p 27017:27017 mongo:4.4.6

fi

if [[ $# -gt 0 && ($input == "stop") ]]
then
    docker stop  z+_redis 

    docker stop  z+_rabbitmq 

    docker stop  z+_mongo 

fi

if [[ $# -gt 0 && ($input == "remove") ]]
then
    docker rm -f  z+_redis 

    docker rm -f  z+_rabbitmq 

    docker rm -f  z+_mongo 

fi



# windows
# docker run -it -d -p 8004:22 -v ${pwd}/results:/security_tool_results -v ${pwd}/inputs:/security_tool_inputs -v ${pwd}/helper:/security_tool_helper --name security_tool_container security_tool

# to get shell access of container
# docker exec -it security_tool_container bash
