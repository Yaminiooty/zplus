package test_structs

import (
	"sec-tool/repositories"
	"sec-tool/services"
	"sec-tool/structs"
)

type TestEnv struct {
	App      *structs.App
	Services *Services
	Repo     *Repo
}

type Services struct {
	UserService                  *services.UserService
	ToolsSelectionService        *services.ToolsSelectionService
	ActionPipelineService        *services.ActionPipelineService
	UserToolConfigurationService *services.UserToolConfigurationService
}

type Repo struct {
	UserRepository *repositories.UserRepo
}
