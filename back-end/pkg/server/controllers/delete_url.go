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

func DeleteURL(context *fiber.Ctx) error {
	var requestBody = api.RedirectRequest{}

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
		return serverError(context, errGetInstance, "delete url")
	}

	//? Get url's infos from the given shortURL
	url, errGet := model.GetURLMainInfos(requestBody.ShortURL, database.TableURLs)
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

	//? Retrieving user email from the JWT
	tokenString := string(context.Request().Header.Peek("Authorization"))
	tokenString = tokenString[len("Bearer "):]

	claims, errClaims := auth.GetClaimsFromToken(tokenString)
	if errClaims != nil {
		return serverError(context, errClaims, "delete url")
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

	//? Check if the asked URL has a password
	if url.Password.Valid {

		//? Check if the given password corresponds with the stored one
		errCompare := bcrypt.CompareHashAndPassword([]byte(
			url.Password.String), []byte(requestBody.Password))
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

	errDelete := model.DeleteURL(url.Short, database.TableURLs)
	if errDelete != nil {
		return serverError(context, errDelete, "delete url")
	}

	return context.Status(fiber.StatusOK).SendString("URL deleted")
}
