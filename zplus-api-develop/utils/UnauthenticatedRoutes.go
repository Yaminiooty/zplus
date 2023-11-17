package utils

import (
	"net/http"
	"sec-tool/structs"
)

func GetUnauthenticatedRoutes() []structs.RouteMetaData {
	return []structs.RouteMetaData{
		{Url: "/users", MethodType: http.MethodPost},
		{Url: "/login", MethodType: http.MethodPost},
		{Url: "/reset_password", MethodType: http.MethodPost},
		{Url: "/update_password", MethodType: http.MethodPatch},
		{Url: "/verify_account", MethodType: http.MethodPost},
		{Url: "/get_verification_code", MethodType: http.MethodPost},
	}
}
