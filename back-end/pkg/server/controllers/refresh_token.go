package controllers

import (
	"database/sql"
	"errors"
	"styk/pkg/database"
	"styk/pkg/server/auth"
	"styk/pkg/types/api"

	"github.com/gofiber/fiber/v2"
)

func RefreshToken(context *fiber.Ctx) error {
	var userEmail string

	//? Retrieving user email from the JWT
	tokenString := string(context.Request().Header.Peek("Authorization"))
	tokenString = tokenString[len("Bearer "):]

	claims, errClaims := auth.GetClaimsFromToken(tokenString)
	if errClaims != nil {
		return serverError(context, errClaims, "refresh token")
	}

	userEmail, _ = claims["userEmail"].(string)

	model, errGetInstance := database.GetInstance()
	if errGetInstance != nil {
		return serverError(context, errGetInstance, "refresh token")
	}

	//? Get user's infos from the given email
	user, errGet := model.GetUserFromEmail(userEmail, database.TableUsers)
	if errGet != nil {
		if errors.Is(errors.Unwrap(errGet), sql.ErrNoRows) {
			return context.Status(fiber.StatusUnauthorized).JSON(
				api.ResponseError{
					Error:         errGet.Error(),
					FriendlyError: "The email or password provided is incorrect.",
				})
		}

		return serverError(context, errGet, "refresh token")
	}

	accessToken, errCreate := auth.CreateAccessToken(user)
	if errCreate != nil {
		return serverError(context, errCreate, "refresh token")
	}

	return context.Status(fiber.StatusOK).JSON(
		map[string]interface{}{
			"accessToken": accessToken,
		},
	)
}
