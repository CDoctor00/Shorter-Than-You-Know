package middlewares

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func GetLogger() func(*fiber.Ctx) error {
	return logger.New(logger.Config{
		TimeFormat: time.DateTime,
		Format:     "${time} | ${method} | ${path} | ${status} | ${latency} | ${ip} | ${error}\n",
	})
}
