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

func ChangeURLStatus(context *fiber.Ctx) error {
	var requestBody = api.StatusRequest{}

	errParser := context.BodyParser(&requestBody)
	if errParser != nil {
		return context.Status(fiber.StatusNotAcceptable).JSON(
			api.ResponseError{
				Error:         errParser.Error(),
				FriendlyError: fmt.Sprintf("The system could not process the '%v' entity sended in the request", requestBody),
			})
	}

	var urlsDTO = database.NewUrlsDTO()

	//? Get url's infos from the given shortURL
	url, errGet := urlsDTO.GetURLMainInfos(requestBody.ShortURL)
	if errGet != nil {
		if errors.Is(errors.Unwrap(errGet), sql.ErrNoRows) {
			return context.Status(fiber.StatusNotFound).JSON(
				api.ResponseError{
					Error:         errGet.Error(),
					FriendlyError: "The system did not found the specified resource asked",
				})
		}

		return serverError(context, errGet, "change status")
	}

	//? Retrieving user email from the JWT
	tokenString := string(context.Request().Header.Peek("Authorization"))
	tokenString = tokenString[len("Bearer "):]

	claims, errClaims := auth.GetClaimsFromToken(tokenString)
	if errClaims != nil {
		return serverError(context, errClaims, "change status")
	}
	userID, _ := claims[auth.UserID].(string)

	//? Check if the request's user is the url's owner
	if !url.OwnerID.Valid || userID != url.OwnerID.String {
		return context.Status(fiber.StatusUnauthorized).JSON(
			api.ResponseError{
				Error:         "The user can't update the asked resource",
				FriendlyError: "The user isn't the url's owner",
			})
	}

	errUpdate := urlsDTO.UpdateURLStatus(requestBody.ShortURL, requestBody.Enabled)
	if errUpdate != nil {
		return serverError(context, errUpdate, "change status")
	}

	return context.Status(fiber.StatusOK).SendString("Status updated")
}
