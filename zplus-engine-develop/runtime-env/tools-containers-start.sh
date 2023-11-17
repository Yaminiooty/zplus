#! bash
input=$1

if [[ $# -gt 0 && ($input == "build") ]]
then
  
docker build -t security_tool -f ./runtime-env/docker-containers-setup/Dockerfile-Tools ./runtime-env/docker-containers-setup


fi

if [[ $# -gt 0 && ($input == "create") ]]
then
  
docker run --name security_tool_container -it -d -p 8004:22 -p 8775:8775  -v $(pwd)/security_tool_volume:/security_tool_volume  security_tool


docker run --name security_tool_owaspzap_container -v $(pwd)/security_tool_volume/OWASPZAP:/home/zap -u zap -p 8005:8005 -d owasp/zap2docker-stable zap-x.sh -daemon -host 0.0.0.0 -port 8005 -config api.addrs.addr.name=.* -config api.addrs.addr.regex=true -config api.key=1234

# docker-compose -f ./runtime-env/openvas_docker-compose.yml -d up

fi

if [[ $# -gt 0 && ($input == "start") ]]
then
    docker stop security_tool_container

    docker stop security_tool_owaspzap_container 

    # docker-compose -f ./runtime-env/openvas_docker-compose.yml start
fi

if [[ $# -gt 0 && ($input == "stop") ]]
then
    docker stop security_tool_container

    docker stop security_tool_owaspzap_container 

    # docker-compose -f ./runtime-env/openvas_docker-compose.yml stop
fi

if [[ $# -gt 0 && ($input == "remove") ]]
then
    docker rm -f  security_tool_container

    docker rm -f  security_tool_owaspzap_container 

    # docker-compose -f ./runtime-env/openvas_docker-compose.yml down

fi

if [[ $# -gt 0 && ($input == "build-openvas") ]]
then
    docker-compose -f ./runtime-env/openvas_docker-compose.yml down --volumes
    docker-compose -f ./runtime-env/openvas_docker-compose.yml build
    docker-compose -f ./runtime-env/openvas_docker-compose.yml up
fi

if [[ $# -gt 0 && ($input == "restart-openvas") ]]
then
    docker-compose -f ./runtime-env/openvas_docker-compose.yml down
    docker-compose -f ./runtime-env/openvas_docker-compose.yml up -d
fi