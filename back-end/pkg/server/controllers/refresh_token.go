package controllers

import (
	"styk/pkg/server/auth"

	"github.com/gofiber/fiber/v2"
)

func RefreshToken(context *fiber.Ctx) error {
	user, errToken := getUserFromToken(context)
	if errToken != nil {
		return serverError(context, errToken, "refresh token")
	}

	token, errCreate := auth.CreateToken(*user, auth.AccessToken)
	if errCreate != nil {
		return serverError(context, errCreate, "refresh token")
	}

	return context.Status(fiber.StatusOK).JSON(
		map[string]interface{}{
			auth.AccessToken: token,
		},
	)
}
