package controllers

import (
	"database/sql"
	"errors"
	"fmt"
	"styk/pkg/database"
	"styk/pkg/server/auth"
	"styk/pkg/types/api"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func Login(context *fiber.Ctx) error {
	var requestBody = api.LoginRequest{}

	errParser := context.BodyParser(&requestBody)
	if errParser != nil {
		return context.Status(fiber.StatusNotAcceptable).JSON(
			api.ResponseError{
				Error:         errParser.Error(),
				FriendlyError: fmt.Sprintf("The system could not process the '%v' entity sended in the request", requestBody),
			})
	}

	model, errGetInstance := database.GetInstance()
	if errGetInstance != nil {
		return serverError(context, errGetInstance.Error())
	}

	user, errGet := model.GetUserFromEmail(requestBody.Email, database.TableUsers)
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

	errCompare := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(requestBody.Password))
	if errCompare != nil {
		if errors.Is(errCompare, bcrypt.ErrMismatchedHashAndPassword) {
			return context.Status(fiber.StatusUnauthorized).JSON(
				api.ResponseError{
					Error:         errCompare.Error(),
					FriendlyError: "The email or password provided is incorrect.",
				})
		}

		return serverError(context, errCompare.Error())
	}

	token, errCreate := auth.CreateToken(user)
	if errCreate != nil {
		return serverError(context, errCreate.Error())
	}

	return context.Status(fiber.StatusOK).JSON(
		map[string]interface{}{
			"token": token,
		},
	)
}

func serverError(context *fiber.Ctx, err string) error {
	return context.Status(fiber.StatusInternalServerError).JSON(
		api.ResponseError{
			Error:         err,
			FriendlyError: "The system has encountered an error while checking the data",
		})
}
