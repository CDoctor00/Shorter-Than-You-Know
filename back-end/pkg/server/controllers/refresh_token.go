package controllers

import (
	"database/sql"
	"errors"
	"fmt"
	"styk/pkg/database"
	"styk/pkg/server/auth"
	"styk/pkg/types/api"

	"github.com/gofiber/fiber/v2"
)

func RefreshToken(context *fiber.Ctx) error {

	userEmail, errExtract := getUserEmailFromToken(context)
	if errExtract != nil {
		return context.Status(fiber.StatusInternalServerError).JSON(
			api.ResponseError{
				Error:         errExtract.Error(),
				FriendlyError: "The system has encountered an error while refreshing the token",
			})
	}

	model, errGetInstance := database.GetInstance()
	if errGetInstance != nil {
		return serverError(context, errGetInstance.Error())
	}

	user, errGet := model.GetUserFromEmail(userEmail, database.TableUsers)
	if errGet != nil {
		if errors.Is(errors.Unwrap(errGet), sql.ErrNoRows) {
			return context.Status(fiber.StatusUnauthorized).JSON(
				api.ResponseError{
					Error:         errGet.Error(),
					FriendlyError: "The email or password provided is incorrect.",
				})
		}

		return serverError(context, errGet.Error())
	}

	accessToken, errCreate := auth.CreateAccessToken(user)
	if errCreate != nil {
		return serverError(context, errCreate.Error())
	}

	return context.Status(fiber.StatusOK).JSON(
		map[string]interface{}{
			"accessToken": accessToken,
		},
	)
}

func getUserEmailFromToken(context *fiber.Ctx) (string, error) {
	tokenString := string(context.Request().Header.Peek("Authorization"))
	tokenString = tokenString[len("Bearer "):]

	claims, errClaims := auth.GetClaimsFromToken(tokenString)
	if errClaims != nil {
		return "", fmt.Errorf("controllers.getUserEmailFromToken: %w", errClaims)
	}

	userUUID, _ := claims["userEmail"].(string)

	return userUUID, nil
}
