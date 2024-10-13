package server

import (
	"styk/pkg/server/controllers"
	"styk/pkg/server/middleware"

	"github.com/gofiber/fiber/v2"
)

func Start() {
	var config = fiber.Config{
		AppName:      "Shorter Than You Know Back-End",
		ServerHeader: "Back-End",
	}

	var server = fiber.New(config)
	server.Server().MaxConnsPerIP = 2
	server.Use(middleware.GetCorsMiddleware())
	setupRoutes(server)

	server.Listen(":10000")
}

func setupRoutes(server *fiber.App) {
	server.Get("/greet/:value", controllers.Greet)
	server.Post("/shorten", controllers.Shorten)
	server.Get("/*", controllers.Redirect)
}
