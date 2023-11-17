package test

import (
	"context"
	"fmt"
	"io"
	"os"
	"path"
	"path/filepath"
	"sec-tool/config"
	"sec-tool/dto"
	rabbitmq_producers "sec-tool/rabbitmq/producers"
	"sec-tool/repositories"
	"sec-tool/services"
	"sec-tool/structs"
	struct_errors "sec-tool/structs/errors"
	test_structs "sec-tool/tests/structs"
	"sec-tool/utils"
	utils_rabbitmq "sec-tool/utils/rabbitmq"
	"testing"
	"time"

	"github.com/joho/godotenv"
	log "github.com/sirupsen/logrus"
	"github.com/stretchr/testify/suite"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func TestRunAllSuites(t *testing.T) {

	err := godotenv.Load(filepath.Join("..", "env", "test.env"))
	if err != nil {
		ise := err.Error()
		fmt.Println(ise)
		os.Exit(1)
	}

	// setup logrus
	logLevel, err := log.ParseLevel(os.Getenv("LOG_LEVEL"))
	if err != nil {
		logLevel = log.InfoLevel
	}
	log.SetLevel(logLevel)

	// create root log directory if it does not exist
	error := os.MkdirAll(os.Getenv("LOG_ROOT_DIR"), os.ModePerm)
	if error != nil {
		log.Fatalf("Error creating ROOT log directory: %v", err)
	}

	logFile, err := os.OpenFile(path.Join(os.Getenv("LOG_ROOT_DIR"), time.Now().Format("01-02-2006"))+".log", os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0666)
	if err != nil {
		log.Fatalf("Error opening log file: %v", err)
	}
	log.SetOutput(io.MultiWriter(os.Stdout, logFile))
	log.SetFormatter(&log.JSONFormatter{})

	//Database Configuration
	dbUri := fmt.Sprintf("mongodb://%s:%s@%s/?retryWrites=true&w=majority", os.Getenv("DB_USERNAME"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_HOSTNAME"))
	dbConfig, err := config.InitDatabaseConnection(dbUri, os.Getenv("DB_DATABASE_NAME"))
	if err != nil {
		ise := err.(struct_errors.InternalServerError)
		fmt.Println(ise.Message, ise.Err)
		os.Exit(1)
	}

	rabbitmqUri := fmt.Sprintf("amqp://%s:%s@%s:%s/", os.Getenv("RMQ_USERNAME"), os.Getenv("RMQ_PASSWORD"), os.Getenv("RMQ_HOSTNAME"), os.Getenv("RMQ_PORT"))

	rmqQueueMetaData := utils_rabbitmq.InitQueueMetaData()

	rabbitMqConfig, err := config.InitRabbitMQConnection(rabbitmqUri, *rmqQueueMetaData.GetRabbitMQQueueMetaData())

	redisUri := fmt.Sprintf("%s:%s", os.Getenv("REDIS_SERVER"), os.Getenv("REDIS_PORT"))
	redisConfig, err := config.InitRedisConnection(redisUri, os.Getenv("REDIS_USERNAME"), os.Getenv("REDIS_PASSWORD"))

	if err != nil {
		ise := err.(struct_errors.InternalServerError)
		fmt.Println(ise.Message, ise.Err)
		os.Exit(1)
	}

	if err != nil {
		ise := err.(struct_errors.InternalServerError)
		fmt.Println(ise.Message, ise.Err)
		os.Exit(1)
	}

	// Create RabbitMq Producers
	rabbitMQProducer := rabbitmq_producers.NewRabbitMQProducer(rabbitMqConfig, rmqQueueMetaData)

	// Create Repos
	userRepo := repositories.NewUserRepo(dbConfig, os.Getenv("DB_COLLECTION_USERS_NAME"))
	toolsRepo := repositories.NewToolsRepo(dbConfig, os.Getenv("DB_COLLECTION_TOOLS_NAME"))
	toolsSelectionRepo := repositories.NewToolsSelctionRepo(dbConfig, os.Getenv("DB_COLLECTION_TOOLS_SELECTION_NAME"))
	actionPipelineRepo := repositories.NewActionPipelineRepo(dbConfig, os.Getenv("DB_COLLECTION_TOOLS_PIPELINE_NAME"))
	userToolRepo := repositories.NewUserToolConfigurationRepo(dbConfig, os.Getenv("DB_COLLECTION_USER_TOOL_CONFIGURATION_NAME"))

	// Service Creation
	userService := services.NewUserService(userRepo, redisConfig)
	toolsSelectionService := services.NewToolsSelectionService(toolsSelectionRepo, toolsRepo, userRepo)

	rabbitMqService := services.NewRabbitMQService(rabbitMQProducer)
	actionPipelineService := services.NewActionPipelineService(actionPipelineRepo, rabbitMqService, userRepo, userToolRepo, toolsSelectionRepo)
	userToolService := services.NewUserToolConfigurationService(userToolRepo, toolsSelectionRepo, userRepo)

	// Populate the Tools Info in MongoDB

	toolsMeta := utils.GetToolsMetaData()

	for idx, _ := range toolsMeta {
		id, _ := primitive.ObjectIDFromHex("64f9e31f5f6857da6ea7731" + fmt.Sprintf("%d", idx))
		toolsMeta[idx].Id = id

		toolsRepo.CreateNew(toolsMeta[idx])
	}

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	testEnv := &test_structs.TestEnv{
		App: &structs.App{
			DbConfig:    dbConfig,
			RedisConfig: redisConfig,
		},
		Services: &test_structs.Services{
			ActionPipelineService:        actionPipelineService,
			UserService:                  userService,
			ToolsSelectionService:        toolsSelectionService,
			UserToolConfigurationService: userToolService,
		},
		Repo: &test_structs.Repo{
			UserRepository: userRepo,
		},
	}

	// Setting up a sample  User
	userService.CreateNewUser(dto.CreteNewUserDTO{Name: "Dummy User", Email: "dummy_user@gmail.com", Password: "Dummy@77"})

	suite.Run(t, &TestToolSelectionServiceSuite{TestEnv: *testEnv})
	suite.Run(t, &TestActionPipelinServiceSuite{TestEnv: *testEnv})
	suite.Run(t, &TestAuthMiddlewareSuite{TestEnv: *testEnv})
	suite.Run(t, &TestUserServiceSuite{TestEnv: *testEnv})
	suite.Run(t, &TestUserToolConfigurationServiceSuite{TestEnv: *testEnv})

	dbConfig.DbClient.Database(os.Getenv("DB_DATABASE_NAME")).Drop(context.TODO())
	ch, err := rabbitMqConfig.Connection.Channel()

	if err != nil {
		log.Error("Unable to open channel to RabbitMq to destroy testing queues.")
	}

	for _, queueMeta := range *rmqQueueMetaData.GetRabbitMQQueueMetaData() {
		_, err := ch.QueueDelete(queueMeta.Name, false, false, false)
		if err != nil {
			fmt.Println(err)
		}
	}
}
