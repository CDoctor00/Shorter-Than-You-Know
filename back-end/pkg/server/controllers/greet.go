package controllers

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func Greet(context *fiber.Ctx) error {
	var value = context.Params("value")

	return context.Status(fiber.StatusOK).JSON(
		fiber.Map{
			"id":   1,
			"data": fmt.Sprintf("Hello %s", value),
		})
}
