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
	server.Get("/greet/:value", controllers.Greet)
	server.Post("/redirect", controllers.RedirectWithPwd)
	server.Post("/shorten", controllers.Shorten)
	server.Post("/signup", controllers.SignUp)
	server.Post("/login", controllers.Login)

	authGroup := server.Group("auth", middlewares.GetJWT())
	authGroup.Get("/refreshToken", controllers.RefreshToken)

	server.Get("/*", controllers.Redirect)
}
