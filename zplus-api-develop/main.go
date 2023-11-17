package main

import (
	"fmt"
	"io"
	"os"
	"path"
	"path/filepath"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"

	"github.com/joho/godotenv"

	"sec-tool/config"
	"sec-tool/controllers"
	"sec-tool/middleware"
	rabbitmq_producers "sec-tool/rabbitmq/producers"
	"sec-tool/repositories"
	"sec-tool/routes"
	"sec-tool/services"
	"sec-tool/structs"
	struct_errors "sec-tool/structs/errors"
	"sec-tool/utils"
	utils_rabbitmq "sec-tool/utils/rabbitmq"

	log "github.com/sirupsen/logrus"
)

type App structs.App

func NewServer(dbConfig *config.DatabaseConfig, rabbitMQConfig *config.RabbitmqConfig, redisConfig *config.RedisConfig) *App {

	router := gin.New()

	router.Use(gin.Recovery())

	// Register Custom Validators for "binding" struct tag
	currentValidator := binding.Validator.Engine()
	currentValidator.(*validator.Validate).RegisterValidation("valid_password", utils.ValidatePassword)
	currentValidator.(*validator.Validate).RegisterValidation("valid_phone", utils.ValidatePhone)

	config := cors.DefaultConfig()

	//CORS middleware
	config.AllowOrigins = []string{os.Getenv("FRONTEND_SERVER_URL"), "*"} // Replace with your frontend URL

	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "PATCH"}
	config.AllowHeaders = []string{"Authorization", "Content-Type"}
	router.Use(cors.New(config))

	//Register Request Id generator Middleware
	router.Use(middleware.GenerateUUIDMiddleware())

	//Register Logging Middleware
	router.Use(middleware.LoggingMiddleware())

	//Register Authentication Middleware
	router.Use(middleware.JwtAuthentication(utils.GetUnauthenticatedRoutes(), redisConfig))

	app := &App{Router: router, DbConfig: dbConfig, RedisConfig: redisConfig, RabbitMqConfig: rabbitMQConfig}

	return app
}

func (app *App) StartServer(url string) {
	app.Router.Run(url)
}

func init() {

	// environment variable loading
	err := godotenv.Load(filepath.Join("env", "test.env"))
	if err != nil {
		ise := err.(struct_errors.InternalServerError)
		fmt.Println(ise.Message, ise.Err)
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
}

func main() {

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
	if err != nil {
		ise := err.(struct_errors.InternalServerError)
		fmt.Println(ise.Message, ise.Err)
		os.Exit(1)
	}

	redisUri := fmt.Sprintf("%s:%s", os.Getenv("REDIS_SERVER"), os.Getenv("REDIS_PORT"))
	redisConfig, err := config.InitRedisConnection(redisUri, os.Getenv("REDIS_USERNAME"), os.Getenv("REDIS_PASSWORD"))
	if err != nil {
		ise := err.(struct_errors.InternalServerError)
		fmt.Println(ise.Message, ise.Err)
		os.Exit(1)
	}
	//Server Initialization
	app := NewServer(dbConfig, rabbitMqConfig, redisConfig)

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

	// Controller Creation
	userController := controllers.NewUserController(userService)
	toolSelectionController := controllers.NewToolsSelectionController(toolsSelectionService)
	actionPipeLineController := controllers.NewActionPipelineController(actionPipelineService)
	userToolController := controllers.NewUserToolConfigurationController(userToolService)

	// Routes Declaration
	routes.NewUserRoutes(app.Router, userController)
	routes.NewToolsSelectionRoutes(app.Router, toolSelectionController)
	routes.NewActionPipelineRoutes(app.Router, actionPipeLineController)
	routes.NewUserToolConfigurationRoutes(app.Router, userToolController)

	// Populate the Tools Info in MongoDB
	err = toolsRepo.UpdateSupportedToolsMeta(utils.GetToolsMetaData())

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	//Server Start
	app.StartServer(os.Getenv("HOST") + ":" + os.Getenv("PORT"))
}
