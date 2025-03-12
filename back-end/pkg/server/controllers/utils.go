package controllers

import (
	"fmt"
	"styk/pkg/types/api"

	"github.com/gofiber/fiber/v2"
)

/*---------- GENERIC UTILITY FUNCTIONS ----------*/

func serverError(context *fiber.Ctx, err error, action string) error {
	return context.Status(fiber.StatusInternalServerError).JSON(
		api.ResponseError{
			Error:         err.Error(),
			FriendlyError: fmt.Sprintf("The system has encountered an error while the %s", action),
		})
}
