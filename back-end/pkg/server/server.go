package server

import (
	"styk/pkg/server/controllers"
	"styk/pkg/server/middlewares"

	"github.com/gofiber/fiber/v2"
)

func Start() {
	var config = fiber.Config{
		AppName:      "Shorter Than You Know Back-End",
		ServerHeader: "Back-End",
	}

	var server = fiber.New(config)
	server.Server().MaxConnsPerIP = 2
	server.Use(middlewares.GetCors())
	setupRoutes(server)

	server.Listen(":10000")
}

func setupRoutes(server *fiber.App) {
	api := server.Group("api")

	api.Get("/greet/:value", controllers.Greet)
	api.Post("/redirect", controllers.Redirect)
	api.Post("/shorten", controllers.Shorten)
	api.Post("/signup", controllers.SignUp)
	api.Post("/login", controllers.Login)

	authGroup := api.Group("auth", middlewares.GetJWT())
	authGroup.Get("/refreshToken", controllers.RefreshToken)
	authGroup.Put("/deleteUser", controllers.DeleteUser)
	authGroup.Put("/deleteURL", controllers.DeleteURL)
	authGroup.Put("/changeURLStatus", controllers.ChangeURLStatus)
	authGroup.Put("/changeURLExp", controllers.ChangeExpirationTime)
}
