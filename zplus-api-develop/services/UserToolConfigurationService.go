package services

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"
	dto_tool_configuration "sec-tool/dto/ToolConfigurationDTO"
	dto_tool_configuration_zap "sec-tool/dto/ToolConfigurationDTO/OwaspZapDTO"
	"sec-tool/logger"
	model_tool_configuration "sec-tool/models/ToolConfigurationModel"
	"sec-tool/repositories"
	"sec-tool/utils"
	structmappers "sec-tool/utils/struct_mappers"
)

type UserToolConfigurationService struct {
	UserToolConfigurationRepo *repositories.UserToolConfigurationRepo
	ToolsSelectionRepo        *repositories.ToolsSelectionRepo
	UserRepo                  *repositories.UserRepo
}

func NewUserToolConfigurationService(userToolConfigurationRepo *repositories.UserToolConfigurationRepo, toolsSelectionRepo *repositories.ToolsSelectionRepo, userRepo *repositories.UserRepo) *UserToolConfigurationService {
	return &UserToolConfigurationService{UserToolConfigurationRepo: userToolConfigurationRepo, ToolsSelectionRepo: toolsSelectionRepo, UserRepo: userRepo}
}

func (utcs *UserToolConfigurationService) SaveJMeterLoadTestingConfiguration(user string, tool string, data dto_tool_configuration.JMeterLoadTestingConfigurationDTO, requestId string) (Message string, StatusCode int, Data any, Error any) {
	userToolModel, _ := utcs.UserToolConfigurationRepo.GetConfigurationsByEmailAndTool(user, tool)
	if userToolModel == nil {
		dataWithoutConfiguration := model_tool_configuration.UserToolModel{
			UserEmail:     user,
			Tool:          tool,
			ModifiedOn:    utils.GetCurrentDateTime(),
			Configuration: structmappers.JMeterLoadTestingDtoToModel(data),
		}
		err := utcs.UserToolConfigurationRepo.CreateDBToolConfigurationEntry(dataWithoutConfiguration)
		if err != nil {
			logger.Error("UserToolConfigurationService", "SaveJMeterLoadTestingConfiguration", err.Error(), requestId)
			return "Unable to create the tool configurations for user.", http.StatusInternalServerError, nil, err
		}
		return "Added tool configuration successfully", http.StatusCreated, dataWithoutConfiguration, nil
	}
	err := utcs.UserToolConfigurationRepo.UpdateConfigurationByEmailAndTool(user, tool, structmappers.JMeterLoadTestingDtoToModel(data))
	if err != nil {
		logger.Error("UserToolConfigurationService", "SaveJMeterLoadTestingConfiguration", err.Error(), requestId)
		return "Update configuration failed", http.StatusInternalServerError, nil, err
	}
	return "Updated tool configurations successfully", http.StatusOK, nil, nil
}

func (utcs *UserToolConfigurationService) SaveMetasploitConfiguration(user string, tool string, data dto_tool_configuration.MetasploitConfigurationDTO, requestId string) (Message string, StatusCode int, Data any, Error any) {
	userToolModel, _ := utcs.UserToolConfigurationRepo.GetConfigurationsByEmailAndTool(user, tool)
	if userToolModel == nil {
		dataWithoutConfiguration := model_tool_configuration.UserToolModel{
			UserEmail:     user,
			Tool:          tool,
			ModifiedOn:    utils.GetCurrentDateTime(),
			Configuration: structmappers.MetasploitDtoToModel(data),
		}
		err := utcs.UserToolConfigurationRepo.CreateDBToolConfigurationEntry(dataWithoutConfiguration)
		if err != nil {
			logger.Error("UserToolConfigurationService", "SaveMetasploitConfiguration", err.Error(), requestId)
			return "Unable to create the tool configurations for user.", http.StatusInternalServerError, nil, err
		}
		return "Added tool configuration successfully", http.StatusCreated, nil, nil
	}
	err := utcs.UserToolConfigurationRepo.UpdateConfigurationByEmailAndTool(user, tool, structmappers.MetasploitDtoToModel(data))
	if err != nil {
		logger.Error("UserToolConfigurationService", "SaveMetasploitConfiguration", err.Error(), requestId)
		return "Update configuration failed", http.StatusInternalServerError, nil, err
	}
	return "Updated tool configurations successfully", http.StatusOK, nil, nil
}

func (utcs *UserToolConfigurationService) SaveNmapConfiguration(user string, tool string, data dto_tool_configuration.NmapConfigurationDTO, requestId string) (Message string, StatusCode int, Data any, Error any) {
	userToolModel, _ := utcs.UserToolConfigurationRepo.GetConfigurationsByEmailAndTool(user, tool)
	if userToolModel == nil {
		dataWithoutConfiguration := model_tool_configuration.UserToolModel{
			UserEmail:     user,
			Tool:          tool,
			ModifiedOn:    utils.GetCurrentDateTime(),
			Configuration: structmappers.NmapDtoToModel(data),
		}
		err := utcs.UserToolConfigurationRepo.CreateDBToolConfigurationEntry(dataWithoutConfiguration)
		if err != nil {
			logger.Error("UserToolConfigurationService", "SaveNmapConfiguration", err.Error(), requestId)
			return "Unable to create the tool configurations for user.", http.StatusInternalServerError, nil, err
		}
		return "Added tool configuration successfully", http.StatusCreated, nil, nil
	}
	err := utcs.UserToolConfigurationRepo.UpdateConfigurationByEmailAndTool(user, tool, structmappers.NmapDtoToModel(data))
	if err != nil {
		logger.Error("UserToolConfigurationService", "SaveNmapConfiguration", err.Error(), requestId)
		return "Update configuration failed", http.StatusInternalServerError, nil, err
	}
	return "Updated tool configurations successfully", http.StatusOK, nil, nil
}

func (utcs *UserToolConfigurationService) SaveOpenVASConfiguration(user string, tool string, data dto_tool_configuration.OpenVASConfigurationDTO, requestId string) (Message string, StatusCode int, Data any, Error any) {
	userToolModel, _ := utcs.UserToolConfigurationRepo.GetConfigurationsByEmailAndTool(user, tool)
	if userToolModel == nil {
		dataWithoutConfiguration := model_tool_configuration.UserToolModel{
			UserEmail:     user,
			Tool:          tool,
			ModifiedOn:    utils.GetCurrentDateTime(),
			Configuration: structmappers.OpenVASDtoToModel(data),
		}
		err := utcs.UserToolConfigurationRepo.CreateDBToolConfigurationEntry(dataWithoutConfiguration)
		if err != nil {
			logger.Error("UserToolConfigurationService", "SaveOpenVASConfiguration", err.Error(), requestId)
			return "Unable to create the tool configurations for user.", http.StatusInternalServerError, nil, err
		}
		return "Added tool configuration successfully", http.StatusCreated, nil, nil
	}
	err := utcs.UserToolConfigurationRepo.UpdateConfigurationByEmailAndTool(user, tool, structmappers.OpenVASDtoToModel(data))
	if err != nil {
		logger.Error("UserToolConfigurationService", "SaveOpenVASConfiguration", err.Error(), requestId)
		return "Update configuration failed", http.StatusInternalServerError, nil, err
	}
	return "Updated tool configurations successfully", http.StatusOK, nil, nil
}

func (utcs *UserToolConfigurationService) SaveOWASPDependencyCheckConfiguration(user string, tool string, data dto_tool_configuration.OWASPDependencyCheckDTO, requestId string) (Message string, StatusCode int, Data any, Error any) {
	userToolModel, _ := utcs.UserToolConfigurationRepo.GetConfigurationsByEmailAndTool(user, tool)
	if userToolModel == nil {
		dataWithoutConfiguration := model_tool_configuration.UserToolModel{
			UserEmail:     user,
			Tool:          tool,
			ModifiedOn:    utils.GetCurrentDateTime(),
			Configuration: structmappers.OWASPDependencyCheckDtoToModel(data),
		}
		err := utcs.UserToolConfigurationRepo.CreateDBToolConfigurationEntry(dataWithoutConfiguration)
		if err != nil {
			logger.Error("UserToolConfigurationService", "SaveOWASPDependencyCheckConfiguration", err.Error(), requestId)
			return "Unable to create the tool configurations for user.", http.StatusInternalServerError, nil, err
		}

		return "Added tool configuration successfully", http.StatusCreated, nil, nil
	}
	err := utcs.UserToolConfigurationRepo.UpdateConfigurationByEmailAndTool(user, tool, structmappers.OWASPDependencyCheckDtoToModel(data))
	if err != nil {
		logger.Error("UserToolConfigurationService", "SaveOWASPDependencyCheckConfiguration", err.Error(), requestId)
		return "Update configuration failed", http.StatusInternalServerError, nil, err
	}
	return "Updated tool configurations successfully", http.StatusOK, nil, nil
}

func (utcs *UserToolConfigurationService) SaveOWASPZAPConfiguration(user string, tool string, data dto_tool_configuration_zap.OWASPZAPConfigurationDTO, requestId string) (Message string, StatusCode int, Data any, Error any) {
	userToolModel, _ := utcs.UserToolConfigurationRepo.GetConfigurationsByEmailAndTool(user, tool)
	if userToolModel == nil {
		dataWithoutConfiguration := model_tool_configuration.UserToolModel{
			UserEmail:     user,
			Tool:          tool,
			ModifiedOn:    utils.GetCurrentDateTime(),
			Configuration: structmappers.OWASPZAPDtoToModel(data),
		}
		err := utcs.UserToolConfigurationRepo.CreateDBToolConfigurationEntry(dataWithoutConfiguration)
		if err != nil {
			logger.Error("UserToolConfigurationService", "SaveOWASPZAPConfiguration", err.Error(), requestId)
			return "Unable to create the tool configurations for user.", http.StatusInternalServerError, nil, err
		}

		return "Added tool configuration successfully", http.StatusCreated, nil, nil
	}
	err := utcs.UserToolConfigurationRepo.UpdateConfigurationByEmailAndTool(user, tool, structmappers.OWASPZAPDtoToModel(data))
	if err != nil {
		logger.Error("UserToolConfigurationService", "SaveOWASPZAPConfiguration", err.Error(), requestId)
		return "Update configuration failed", http.StatusInternalServerError, nil, err
	}
	return "Updated tool configurations successfully", http.StatusOK, nil, nil
}

func (utcs *UserToolConfigurationService) SaveSQLMapConfiguration(user string, tool string, data dto_tool_configuration.SQLMapConfigurationDTO, requestId string) (Message string, StatusCode int, Data any, Error any) {
	userToolModel, _ := utcs.UserToolConfigurationRepo.GetConfigurationsByEmailAndTool(user, tool)
	if userToolModel == nil {
		dataWithoutConfiguration := model_tool_configuration.UserToolModel{
			UserEmail:     user,
			Tool:          tool,
			ModifiedOn:    utils.GetCurrentDateTime(),
			Configuration: structmappers.SQLMapDtoToModel(data),
		}
		err := utcs.UserToolConfigurationRepo.CreateDBToolConfigurationEntry(dataWithoutConfiguration)
		if err != nil {
			logger.Error("UserToolConfigurationService", "SaveSQLMapConfiguration", err.Error(), requestId)
			return "Unable to create the tool configurations for user.", http.StatusInternalServerError, nil, err
		}
		return "Added tool configuration successfully", http.StatusCreated, nil, nil
	}
	err := utcs.UserToolConfigurationRepo.UpdateConfigurationByEmailAndTool(user, tool, structmappers.SQLMapDtoToModel(data))
	if err != nil {
		logger.Error("UserToolConfigurationService", "SaveSQLMapConfiguration", err.Error(), requestId)
		return "Update configuration failed", http.StatusInternalServerError, nil, err
	}
	return "Updated tool configurations successfully", http.StatusOK, nil, nil
}

func (utcs *UserToolConfigurationService) GetCurrentPipelineConfigurations(email string, requestId string) (Message string, StatusCode int, Data any, Error any) {
	userInfo, err := utcs.UserRepo.GetUserWithEmail(email)
	if err != nil {
		logger.Error("UserToolConfigurationService", "GetCurrentPipelineConfigurations", err.Error(), requestId)
		return "User not found.", http.StatusBadRequest, nil, err
	}

	userSelectedTools, err := utcs.ToolsSelectionRepo.FindById(userInfo.Id)
	if err != nil {
		logger.Error("UserToolConfigurationService", "GetCurrentPipelineConfigurations", err.Error(), requestId)
		return "Unable to get selected tools for user", http.StatusInternalServerError, nil, err
	}
	var selectedTools = []dto_tool_configuration.GetToolConfigurations{}
	for _, selectedTool := range userSelectedTools.ToolSelections {
		if selectedTool.IsSelected {
			toolConfiguration, err := utcs.UserToolConfigurationRepo.GetConfigurationsByEmailAndTool(userInfo.Email, selectedTool.ToolName)
			if err != nil {
				return "error occurred while getting configurations of " + selectedTool.ToolName + " tool", http.StatusInternalServerError, nil, err
			}
			selectedTools = append(selectedTools, dto_tool_configuration.GetToolConfigurations{
				Tool:          toolConfiguration.Tool,
				Time:          toolConfiguration.ModifiedOn,
				Configuration: toolConfiguration.Configuration,
			})
		}
	}

	return "Tools configuration extracted successfully", http.StatusOK, selectedTools, nil
}

func (utcs *UserToolConfigurationService) MetasploitHelperSearch(module string, requestId string) (string, int, any, any) {
	url := os.Getenv("METASPLOIT_RPC_API")
	jsonReq, _ := json.Marshal(map[string]any{
		"jsonrpc": "2.0",
		"method":  "module.search",
		"id":      1,
		"params":  []string{module},
	})
	resp, err := http.Post(
		url,
		"application/json; charset=utf-8",
		bytes.NewBuffer(jsonReq),
	)
	if err != nil {
		logger.Error("UserToolConfigurationService", "MetasploitHelperSearch", err.Error(), requestId)
		return "Something went wrong with request", http.StatusInternalServerError, nil, err
	}
	defer resp.Body.Close()
	bodyBytes, _ := ioutil.ReadAll(resp.Body)
	var result dto_tool_configuration.MetasploitHelperResponseDTO
	json.Unmarshal(bodyBytes, &result)
	return "Successfully got metadata for metasploit module", http.StatusOK, result.Result, nil
}

func (utcs *UserToolConfigurationService) MetasploitHelperOptions(moduleType string, moduleName string, requestId string) (string, int, any, any) {
	url := os.Getenv("METASPLOIT_RPC_API")
	jsonReq, _ := json.Marshal(map[string]any{
		"jsonrpc": "2.0",
		"method":  "module.options",
		"id":      1,
		"params":  []string{moduleType, moduleName},
	})
	resp, err := http.Post(
		url,
		"application/json; charset=utf-8",
		bytes.NewBuffer(jsonReq),
	)
	if err != nil {
		logger.Error("UserToolConfigurationService", "MetasploitHelperOptions", err.Error(), requestId)
		return "Something went wrong with request", http.StatusInternalServerError, nil, err
	}
	defer resp.Body.Close()
	bodyBytes, _ := ioutil.ReadAll(resp.Body)
	var result dto_tool_configuration.MetasploitHelperResponseDTO
	json.Unmarshal(bodyBytes, &result)
	return "Successfully got metadata for metasploit module", http.StatusOK, result.Result, nil
}
