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

func DeleteURL(context *fiber.Ctx) error {
	var requestBody = api.DeleteRequest{}

	errParser := context.BodyParser(&requestBody)
	if errParser != nil {
		return context.Status(fiber.StatusNotAcceptable).JSON(
			api.ResponseError{
				Error:         errParser.Error(),
				FriendlyError: fmt.Sprintf("The system could not process the '%v' entity sended in the request", requestBody),
			})
	}

	var urlsDTO = database.NewUrlsDTO()

	//? Get url's infos from the given UUID
	urlInfo, errGet := urlsDTO.GetUrlSecurityInfos(requestBody.UUID)
	if errGet != nil {
		if errors.Is(errors.Unwrap(errGet), sql.ErrNoRows) {
			return context.Status(fiber.StatusNotFound).JSON(
				api.ResponseError{
					Error:         errGet.Error(),
					FriendlyError: "The system did not found the specified resource asked",
				})
		}

		return serverError(context, errGet, "delete url")
	}

	user, errToken := getUserFromToken(context)
	if errToken != nil {
		return serverError(context, errToken, "delete url")
	}

	//? Check if the request's user is the url's owner
	if !urlInfo.OwnerID.Valid || user.ID != urlInfo.OwnerID.String {
		return context.Status(fiber.StatusUnauthorized).JSON(
			api.ResponseError{
				Error:         "The user can't update the asked resource",
				FriendlyError: "The user isn't the url's owner",
			})
	}

	//? Check if the asked URL has a password
	if urlInfo.Password.Valid {

		//? Check if the given password corresponds with the stored one
		errCompare := bcrypt.CompareHashAndPassword([]byte(
			urlInfo.Password.String), []byte(requestBody.Password))
		if errCompare != nil {
			if errors.Is(errCompare, bcrypt.ErrMismatchedHashAndPassword) {
				return context.Status(fiber.StatusUnauthorized).JSON(
					api.ResponseError{
						Error:         errCompare.Error(),
						FriendlyError: "The password provided is incorrect",
					})
			}

			return serverError(context, errCompare, "delete url")
		}
	}

	errDelete := urlsDTO.DeleteUrl(requestBody.UUID)
	if errDelete != nil {
		return serverError(context, errDelete, "delete url")
	}

	return context.Status(fiber.StatusOK).SendString("URL deleted")
}
