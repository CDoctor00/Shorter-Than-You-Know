package controllers

import (
	"database/sql"
	"errors"
	"fmt"
	"styk/pkg/database"
	"styk/pkg/types/api"
	dbType "styk/pkg/types/database"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func UpdateUser(context *fiber.Ctx) error {
	var requestBody = api.UpdateUserRequest{}

	errParser := context.BodyParser(&requestBody)
	if errParser != nil {
		return context.Status(fiber.StatusNotAcceptable).JSON(
			api.ResponseError{
				Error:         errParser.Error(),
				FriendlyError: fmt.Sprintf("The system could not process the '%v' entity sended in the request", requestBody),
			})
	}

	user, errToken := getUserFromToken(context)
	if errToken != nil {
		return serverError(context, errToken, "update user")
	}

	var usersDTO = database.NewUsersDTO()

	//? Get user's infos from the token user ID
	userInfo, errGet := usersDTO.GetUserFromID(user.ID)
	if errGet != nil {
		if errors.Is(errors.Unwrap(errGet), sql.ErrNoRows) {
			return context.Status(fiber.StatusNotFound).JSON(
				api.ResponseError{
					Error:         errGet.Error(),
					FriendlyError: "The system did not found the specified resource asked",
				})
		}

		return serverError(context, errGet, "update user")
	}

	//? Check if the given password corresponds with the stored one
	errCompare := bcrypt.CompareHashAndPassword([]byte(
		userInfo.Password), []byte(requestBody.Password))
	if errCompare != nil {
		if errors.Is(errCompare, bcrypt.ErrMismatchedHashAndPassword) {
			return context.Status(fiber.StatusUnauthorized).JSON(
				api.ResponseError{
					Error:         errCompare.Error(),
					FriendlyError: "The password provided is incorrect",
				})
		}

		return serverError(context, errCompare, "update user")
	}

	newUser, errUser := updateUser(userInfo, requestBody)
	if errUser != nil {
		if errors.Is(errUser, bcrypt.ErrPasswordTooLong) {
			return context.Status(fiber.StatusUnprocessableEntity).JSON(
				api.ResponseError{
					Error:         "Unacceptable Password",
					FriendlyError: "The system does not accept a password longer than 72 characters",
				})
		}

		return serverError(context, errUser, "update user")
	}

	errUpdate := usersDTO.UpdateUser(newUser)
	if errUpdate != nil {
		return serverError(context, errUpdate, "update user")
	}

	return context.Status(fiber.StatusOK).SendString("User info updated")
}

func updateUser(user dbType.User, requestBody api.UpdateUserRequest) (dbType.UpdateUser, error) {
	var newUser = dbType.UpdateUser{
		ID: user.ID,
	}

	if requestBody.NewPassword != nil {
		if *requestBody.NewPassword == "" {
			return dbType.UpdateUser{}, fmt.Errorf("controllers.updateUser: the system doesn't accept an empty password")
		}

		hash, errGenerate := bcrypt.GenerateFromPassword(
			[]byte(*requestBody.NewPassword), bcrypt.DefaultCost)
		if errGenerate != nil {
			return dbType.UpdateUser{}, fmt.Errorf("controllers.updateUser: %w", errGenerate)
		}
		user.Password = string(hash)
	}

	if requestBody.Name != nil {
		newUser.Name = &sql.NullString{
			Valid:  *requestBody.Name != "",
			String: *requestBody.Name,
		}
	}

	if requestBody.Surname != nil {
		newUser.Surname = &sql.NullString{
			Valid:  *requestBody.Surname != "",
			String: *requestBody.Surname,
		}
	}

	return newUser, nil
}
