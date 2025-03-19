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

	var usersDTO = database.NewUsersDTO()

	//? Get user's infos from the given email
	user, errGet := usersDTO.GetUserFromEmail(requestBody.Email)
	if errGet != nil {
		if errors.Is(errors.Unwrap(errGet), sql.ErrNoRows) {
			return context.Status(fiber.StatusUnauthorized).JSON(
				api.ResponseError{
					Error:         errGet.Error(),
					FriendlyError: "The email or password provided is incorrect",
				})
		}

		return serverError(context, errGet, "login")
	}

	//? Check if the given password corresponds with the stored one
	errCompare := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(requestBody.Password))
	if errCompare != nil {
		if errors.Is(errCompare, bcrypt.ErrMismatchedHashAndPassword) {
			return context.Status(fiber.StatusUnauthorized).JSON(
				api.ResponseError{
					Error:         errCompare.Error(),
					FriendlyError: "The email or password provided is incorrect",
				})
		}

		return serverError(context, errCompare, "login")
	}

	accessToken, errCreate := auth.CreateToken(user, auth.AccessToken)
	if errCreate != nil {
		return serverError(context, errCreate, "login")
	}

	refreshToken, errCreate := auth.CreateToken(user, auth.RefreshToken)
	if errCreate != nil {
		return serverError(context, errCreate, "login")
	}

	return context.Status(fiber.StatusOK).JSON(
		map[string]interface{}{
			auth.AccessToken:  accessToken,
			auth.RefreshToken: refreshToken,
		},
	)
}
