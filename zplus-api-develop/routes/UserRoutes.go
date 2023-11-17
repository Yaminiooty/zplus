package routes

import (
	"sec-tool/controllers"

	"github.com/gin-gonic/gin"
)

type UserRoutes struct {
	Router         *gin.Engine
	UserController *controllers.UserController
}

func NewUserRoutes(Router *gin.Engine, userController *controllers.UserController) *UserRoutes {
	userRoutes := &UserRoutes{Router: Router, UserController: userController}
	userRoutes.RegisterRoutes()
	return userRoutes
}

func (ur *UserRoutes) RegisterRoutes() {
	ur.Router.POST("/users", ur.UserController.CreateNewUser)
	ur.Router.GET("/users", ur.UserController.FindAll)
	ur.Router.GET("/users/:id", ur.UserController.FindById)
	ur.Router.DELETE("/users/:id", ur.UserController.DeleteById)
	ur.Router.POST("/login", ur.UserController.LoginWithEmailAndPassword)
	ur.Router.POST("/reset_password", ur.UserController.ResetPassword)
	ur.Router.PATCH("/update_password", ur.UserController.UpdatePassword)
	ur.Router.GET("/access_token", ur.UserController.NewAccessToken)
	ur.Router.GET("/logout", ur.UserController.Logout)
	ur.Router.POST("/verify_account", ur.UserController.VerifyAccount)
	ur.Router.POST("/get_verification_code", ur.UserController.GetVerificationCode)
	ur.Router.GET("/user", ur.UserController.GetUserDetails)
	ur.Router.PATCH("/update_user_details", ur.UserController.UpdateUserDetails)
	ur.Router.PATCH("/change-password", ur.UserController.ChangeUserPassword)
}
