package controllers

import (
	"net/http"
	"path/filepath"
	dto_tool_configuration "sec-tool/dto/ToolConfigurationDTO"
	dto_tool_configuration_zap "sec-tool/dto/ToolConfigurationDTO/OwaspZapDTO"
	"sec-tool/logger"
	"sec-tool/services"
	"sec-tool/utils"
	"github.com/gin-gonic/gin"
)

type UserToolConfigurationController struct {
	UserToolConfigurationService *services.UserToolConfigurationService
}

func NewUserToolConfigurationController(userToolConfigurationService *services.UserToolConfigurationService) *UserToolConfigurationController {
	return &UserToolConfigurationController{UserToolConfigurationService: userToolConfigurationService}
}



func (utcc *UserToolConfigurationController) SaveUserToolConfiguration(ctx *gin.Context) {
	tool := ctx.Param("tool")
	switch tool {
	case utils.TOOL_NAME_JMETER:
		SaveJMeterLoadTestingConfiguration(ctx, utcc.UserToolConfigurationService)
	case utils.TOOL_NAME_METASPLOIT:
		SaveMetasploitConfiguration(ctx, utcc.UserToolConfigurationService)
	case utils.TOOL_NAME_NMAP:
		SaveNmapConfiguration(ctx, utcc.UserToolConfigurationService)
	case utils.TOOL_NAME_OPENVAS:
		SaveOpenVASConfiguration(ctx, utcc.UserToolConfigurationService)
	case utils.TOOL_NAME_OWASPDEPENDENCY:
		SaveOWASPDependencyCheckConfiguration(ctx, utcc.UserToolConfigurationService)
	case utils.TOOL_NAME_OWASPZAP:
		SaveOWASPZAPConfiguration(ctx, utcc.UserToolConfigurationService)
	case utils.TOOL_NAME_SQLMAP:
		SaveSQLMapConfiguration(ctx, utcc.UserToolConfigurationService)
	default:
		utils.SendJSONResponse("Tool not supported", http.StatusOK, nil, nil, ctx)
		return
	}
}

func (utcc *UserToolConfigurationController) GetCurrentPipelineConfigurations(ctx *gin.Context) {
	logger.Info("UserToolConfigurationController", "GetCurrentPipelineConfigurations", "Get current pipeline configuration started", ctx.Request.Header.Get("X-Request-ID"))
	user := ctx.Request.Header.Get("user")
	Message, StatusCode, Data, Error := utcc.UserToolConfigurationService.GetCurrentPipelineConfigurations(user, ctx.Request.Header.Get("X-Request-ID"))
	utils.SendJSONResponse(Message, StatusCode, Data, Error, ctx)
	logger.Info("UserToolConfigurationController", "GetCurrentPipelineConfigurations", "Finished processing create user request", ctx.Request.Header.Get("X-Request-ID"))
}

func SaveJMeterLoadTestingConfiguration(ctx *gin.Context, service *services.UserToolConfigurationService) {
	logger.Info("UserToolConfigurationController", "SaveJMeterLoadTestingConfiguration", "Save tool configuration Started.", ctx.Request.Header.Get("X-Request-ID"))
	user := ctx.Request.Header.Get("user")
	tool := utils.TOOL_NAME_JMETER
	var data dto_tool_configuration.JMeterLoadTestingConfigurationDTO
	err := ctx.ShouldBind(&data)
	if err != nil {
		logger.Error("UserToolConfigurationController", "SaveJMeterLoadTestingConfiguration", "Payload verification failed", ctx.Request.Header.Get("X-Request-ID"))
		ErrorResponseBody := utils.ParseBindingErrors(err)
		utils.SendJSONResponse("Invalid Payload.", http.StatusBadRequest, nil, ErrorResponseBody, ctx)
		return
	}

	form, err := ctx.MultipartForm()
	if err != nil {
		logger.Error("UserToolConfigurationController", "SaveJMeterLoadTestingConfiguration", "Error processing multipart files.", ctx.Request.Header.Get("X-Request-ID"))
		utils.SendJSONResponse("Error processing multipart files.", http.StatusBadRequest, nil, err, ctx)
		return
	}
	projectFile := form.File["test_plan_file"][0]
	saveFilePath := filepath.Join(utils.JMETER_TEST_PLAN_PATH, user+".jmx")
	err = ctx.SaveUploadedFile(projectFile, saveFilePath)
	if err != nil {
		logger.Error("UserToolConfigurationController", "SaveJMeterLoadTestingConfiguration", "Error saving project file.", ctx.Request.Header.Get("X-Request-ID"))
		utils.SendJSONResponse("Error saving project file.", http.StatusInternalServerError, nil, err, ctx)
		return
	}

	logger.Debug("UserToolConfigurationController", "SaveJMeterLoadTestingConfiguration", "Payload verification successful", ctx.Request.Header.Get("X-Request-ID"))
	Message, StatusCode, Data, Error := service.SaveJMeterLoadTestingConfiguration(user, tool, data, ctx.Request.Header.Get("X-Request-ID"))

	utils.SendJSONResponse(Message, StatusCode, Data, Error, ctx)
	logger.Info("UserToolConfigurationController", "SaveJMeterLoadTestingConfiguration", "Finished processing create user request", ctx.Request.Header.Get("X-Request-ID"))
}

func SaveMetasploitConfiguration(ctx *gin.Context, service *services.UserToolConfigurationService) {
	logger.Info("UserToolConfigurationController", "SaveMetasploitConfiguration", "Save tool configuration Started.", ctx.Request.Header.Get("X-Request-ID"))
	user := ctx.Request.Header.Get("user")
	tool := utils.TOOL_NAME_METASPLOIT
	var data dto_tool_configuration.MetasploitConfigurationDTO
	err := ctx.ShouldBindJSON(&data)
	if err != nil {
		logger.Error("UserToolConfigurationController", "SaveMetasploitConfiguration", "Payload verification failed", ctx.Request.Header.Get("X-Request-ID"))
		ErrorResponseBody := utils.ParseBindingErrors(err)
		utils.SendJSONResponse("Invalid Payload.", http.StatusBadRequest, nil, ErrorResponseBody, ctx)
		return
	}
	logger.Debug("UserToolConfigurationController", "SaveMetasploitConfiguration", "Payload verification successful", ctx.Request.Header.Get("X-Request-ID"))
	Message, StatusCode, Data, Error := service.SaveMetasploitConfiguration(user, tool, data, ctx.Request.Header.Get("X-Request-ID"))

	utils.SendJSONResponse(Message, StatusCode, Data, Error, ctx)
	logger.Info("UserToolConfigurationController", "SaveMetasploitConfiguration", "Finished processing create user request", ctx.Request.Header.Get("X-Request-ID"))
}

func SaveNmapConfiguration(ctx *gin.Context, service *services.UserToolConfigurationService) {
	logger.Info("UserToolConfigurationController", "SaveNmapConfiguration", "Save tool configuration Started.", ctx.Request.Header.Get("X-Request-ID"))
	user := ctx.Request.Header.Get("user")
	tool := utils.TOOL_NAME_NMAP
	var data dto_tool_configuration.NmapConfigurationDTO
	data.Script_Scan = ""
	data.Version_Detection_Intensity = ""
	err := ctx.ShouldBindJSON(&data)
	if err != nil {
		logger.Error("UserToolConfigurationController", "SaveNmapConfiguration", "Payload verification failed", ctx.Request.Header.Get("X-Request-ID"))
		ErrorResponseBody := utils.ParseBindingErrors(err)
		utils.SendJSONResponse("Invalid Payload.", http.StatusBadRequest, nil, ErrorResponseBody, ctx)
		return
	}
	logger.Debug("UserToolConfigurationController", "SaveNmapConfiguration", "Payload verification successful", ctx.Request.Header.Get("X-Request-ID"))
	Message, StatusCode, Data, Error := service.SaveNmapConfiguration(user, tool, data, ctx.Request.Header.Get("X-Request-ID"))

	utils.SendJSONResponse(Message, StatusCode, Data, Error, ctx)
	logger.Info("UserToolConfigurationController", "SaveNmapConfiguration", "Finished processing create user request", ctx.Request.Header.Get("X-Request-ID"))
}

func SaveOpenVASConfiguration(ctx *gin.Context, service *services.UserToolConfigurationService) {
	logger.Info("UserToolConfigurationController", "SaveOpenVASConfiguration", "Save tool configuration Started.", ctx.Request.Header.Get("X-Request-ID"))
	user := ctx.Request.Header.Get("user")
	tool := utils.TOOL_NAME_OPENVAS
	var data dto_tool_configuration.OpenVASConfigurationDTO
	err := ctx.ShouldBindJSON(&data)
	if err != nil {
		logger.Error("UserToolConfigurationController", "SaveOpenVASConfiguration", "Payload verification failed", ctx.Request.Header.Get("X-Request-ID"))
		ErrorResponseBody := utils.ParseBindingErrors(err)
		utils.SendJSONResponse("Invalid Payload.", http.StatusBadRequest, nil, ErrorResponseBody, ctx)
		return
	}
	logger.Debug("UserToolConfigurationController", "SaveOpenVASConfiguration", "Payload verification successful", ctx.Request.Header.Get("X-Request-ID"))
	Message, StatusCode, Data, Error := service.SaveOpenVASConfiguration(user, tool, data, ctx.Request.Header.Get("X-Request-ID"))

	utils.SendJSONResponse(Message, StatusCode, Data, Error, ctx)
	logger.Info("UserToolConfigurationController", "SaveOpenVASConfiguration", "Finished processing create user request", ctx.Request.Header.Get("X-Request-ID"))
}

func SaveOWASPDependencyCheckConfiguration(ctx *gin.Context, service *services.UserToolConfigurationService) {
	logger.Info("UserToolConfigurationController", "SaveOWASPDependencyCheckConfiguration", "Save tool configuration Started.", ctx.Request.Header.Get("X-Request-ID"))
	user := ctx.Request.Header.Get("user")
	tool := utils.TOOL_NAME_OWASPDEPENDENCY
	var data dto_tool_configuration.OWASPDependencyCheckDTO
	err := ctx.ShouldBind(&data)
	if err != nil {
		logger.Error("UserToolConfigurationController", "SaveOWASPDependencyCheckConfiguration", "Payload verification failed", ctx.Request.Header.Get("X-Request-ID"))
		ErrorResponseBody := utils.ParseBindingErrors(err)
		utils.SendJSONResponse("Invalid Payload.", http.StatusBadRequest, nil, ErrorResponseBody, ctx)
		return
	}

	form, err := ctx.MultipartForm()
	if err != nil {
		logger.Error("UserToolConfigurationController", "SaveOWASPDependencyCheckConfiguration", "Error processing multipart files.", ctx.Request.Header.Get("X-Request-ID"))
		utils.SendJSONResponse("Error processing multipart files.", http.StatusBadRequest, nil, err, ctx)
		return
	}
	projectFile := form.File["project_file"][0]
	saveFilePath := filepath.Join(utils.OWASP_DEPENDENCY_CHECK_FILE_PATH, user+"_project_file.zip")
	err = ctx.SaveUploadedFile(projectFile, saveFilePath)
	if err != nil {
		logger.Error("UserToolConfigurationController", "SaveOWASPDependencyCheckConfiguration", "Error saving project file.", ctx.Request.Header.Get("X-Request-ID"))
		utils.SendJSONResponse("Error saving project file.", http.StatusInternalServerError, nil, err, ctx)
		return
	}
	if data.Suppress_CVE_Reports {
		suppressCveReportsFile := form.File["suppress_cve_reports_file"][0]
		saveSuppressionFilePath := filepath.Join(utils.OWASP_DEPENDENCY_CHECK_FILE_PATH, user+"_suppress_cve_reports_file.zip")
		err = ctx.SaveUploadedFile(suppressCveReportsFile, saveSuppressionFilePath)
		if err != nil {
			logger.Error("UserToolConfigurationController", "SaveOWASPDependencyCheckConfiguration", "Error saving suppress cve reports file.", ctx.Request.Header.Get("X-Request-ID"))
			utils.SendJSONResponse("Error saving suppress cve reports file.", http.StatusInternalServerError, nil, err, ctx)
			return
		}
	}

	logger.Debug("UserToolConfigurationController", "SaveOWASPDependencyCheckConfiguration", "Payload verification successful", ctx.Request.Header.Get("X-Request-ID"))
	Message, StatusCode, Data, Error := service.SaveOWASPDependencyCheckConfiguration(user, tool, data, ctx.Request.Header.Get("X-Request-ID"))

	utils.SendJSONResponse(Message, StatusCode, Data, Error, ctx)
	logger.Info("UserToolConfigurationController", "SaveOWASPDependencyCheckConfiguration", "Finished processing create user request", ctx.Request.Header.Get("X-Request-ID"))
}

func SaveOWASPZAPConfiguration(ctx *gin.Context, service *services.UserToolConfigurationService) {
	logger.Info("UserToolConfigurationController", "SaveOWASPZAPConfiguration", "Save tool configuration Started.", ctx.Request.Header.Get("X-Request-ID"))
	user := ctx.Request.Header.Get("user")
	tool := utils.TOOL_NAME_OWASPZAP
	var data dto_tool_configuration_zap.OWASPZAPConfigurationDTO
	err := ctx.ShouldBindJSON(&data)
	if err != nil {
		logger.Error("UserToolConfigurationController", "SaveOWASPZAPConfiguration", "Payload verification failed", ctx.Request.Header.Get("X-Request-ID"))
		ErrorResponseBody := utils.ParseBindingErrors(err)
		utils.SendJSONResponse("Invalid Payload.", http.StatusBadRequest, nil, ErrorResponseBody, ctx)
		return
	}
	logger.Debug("UserToolConfigurationController", "SaveOWASPZAPConfiguration", "Payload verification successful", ctx.Request.Header.Get("X-Request-ID"))
	Message, StatusCode, Data, Error := service.SaveOWASPZAPConfiguration(user, tool, data, ctx.Request.Header.Get("X-Request-ID"))

	utils.SendJSONResponse(Message, StatusCode, Data, Error, ctx)
	logger.Info("UserToolConfigurationController", "SaveOWASPZAPConfiguration", "Finished processing create user request", ctx.Request.Header.Get("X-Request-ID"))
}

func SaveSQLMapConfiguration(ctx *gin.Context, service *services.UserToolConfigurationService) {
	logger.Info("UserToolConfigurationController", "SaveSQLMapConfiguration", "Save tool configuration Started.", ctx.Request.Header.Get("X-Request-ID"))
	user := ctx.Request.Header.Get("user")
	tool := utils.TOOL_NAME_SQLMAP
	var data dto_tool_configuration.SQLMapConfigurationDTO
	err := ctx.ShouldBindJSON(&data)
	if err != nil {
		logger.Error("UserToolConfigurationController", "SaveSQLMapConfiguration", "Payload verification failed", ctx.Request.Header.Get("X-Request-ID"))
		ErrorResponseBody := utils.ParseBindingErrors(err)
		utils.SendJSONResponse("Invalid Payload.", http.StatusBadRequest, nil, ErrorResponseBody, ctx)
		return
	}

	logger.Debug("UserToolConfigurationController", "SaveSQLMapConfiguration", "Payload verification successful", ctx.Request.Header.Get("X-Request-ID"))
	Message, StatusCode, Data, Error := service.SaveSQLMapConfiguration(user, tool, data, ctx.Request.Header.Get("X-Request-ID"))

	utils.SendJSONResponse(Message, StatusCode, Data, Error, ctx)
	logger.Info("UserToolConfigurationController", "SaveSQLMapConfiguration", "Finished processing create user request", ctx.Request.Header.Get("X-Request-ID"))
}

func (utcc *UserToolConfigurationController) MetasploitHelperSearch(ctx *gin.Context) {
	logger.Info("UserToolConfigurationController", "MetasploitHelperSearch", "Run Metasploit Helper", ctx.Request.Header.Get("X-Request-ID"))
	module := ctx.Query("search_field")
	Message, StatusCode, Data, Error := utcc.UserToolConfigurationService.MetasploitHelperSearch(module, ctx.Request.Header.Get("X-Request-ID"))
	utils.SendJSONResponse(Message, StatusCode, Data, Error, ctx)
	logger.Info("UserToolConfigurationController", "MetasploitHelperSearch", "Metasploit Helper finished", ctx.Request.Header.Get("X-Request-ID"))
}

func (utcc *UserToolConfigurationController) MetasploitHelperOptions(ctx *gin.Context) {
	logger.Info("UserToolConfigurationController", "MetasploitHelperOptions", "Run Metasploit Helper", ctx.Request.Header.Get("X-Request-ID"))
	moduleType := ctx.Query("module_type")
	moduleName := ctx.Query("module_name")
	if moduleType == "" || moduleName == "" {
		logger.Debug("UserToolConfigurationController", "MetasploitHelperOptions", "Payload verification failed", ctx.Request.Header.Get("X-Request-ID"))
		utils.SendJSONResponse("Provide valid query parameters", http.StatusBadRequest, nil, nil, ctx)
		return
	}
	Message, StatusCode, Data, Error := utcc.UserToolConfigurationService.MetasploitHelperOptions(moduleType, moduleName, ctx.Request.Header.Get("X-Request-ID"))
	utils.SendJSONResponse(Message, StatusCode, Data, Error, ctx)
	logger.Info("UserToolConfigurationController", "MetasploitHelperOptions", "Metasploit Helper finished", ctx.Request.Header.Get("X-Request-ID"))
}
