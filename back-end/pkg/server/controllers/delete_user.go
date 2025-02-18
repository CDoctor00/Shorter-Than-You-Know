package controllers

import (
	"database/sql"
	"errors"
	"fmt"
	"styk/pkg/database"
	"styk/pkg/types/api"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func DeleteUser(context *fiber.Ctx) error {
	var requestBody = api.UserRequest{}

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

		return serverError(context, errGet, "delete user")
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

		return serverError(context, errCompare, "delete user")
	}

	errDelete := usersDTO.DeleteUser(user.ID)
	if errDelete != nil {
		return serverError(context, errDelete, "delete user")
	}

	return context.Status(fiber.StatusOK).SendString("User deleted")
}
