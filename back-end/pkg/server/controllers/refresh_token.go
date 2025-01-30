package controllers

import (
	"styk/pkg/server/auth"

	"github.com/gofiber/fiber/v2"
)

func RefreshToken(context *fiber.Ctx) error {
	//? Retrieving user email from the JWT
	tokenString := string(context.Request().Header.Peek("Authorization"))
	tokenString = tokenString[len("Bearer "):]

	claims, errClaims := auth.GetClaimsFromToken(tokenString)
	if errClaims != nil {
		return serverError(context, errClaims, "refresh token")
	}

	userID, _ := claims[auth.UserID].(string)

	token, errCreate := auth.CreateToken(userID, auth.AccessToken)
	if errCreate != nil {
		return serverError(context, errCreate, "refresh token")
	}

	return context.Status(fiber.StatusOK).JSON(
		map[string]interface{}{
			auth.AccessToken: token,
		},
	)
}
