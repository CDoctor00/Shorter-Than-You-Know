package controllers

import (
	"database/sql"
	"errors"
	"fmt"
	"styk/pkg/database"
	"styk/pkg/types/api"
	"time"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func RedirectWithPwd(context *fiber.Ctx) error {
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
		return serverError(context, errGetInstance, "redirect")
	}

	//? Get original URL's infos from the given shorten one
	originalURL, errRetrieve := model.RetrieveOriginalURL(
		requestBody.ShortURL, database.TableURLs)
	if errRetrieve != nil {
		if errors.Is(errors.Unwrap(errRetrieve), sql.ErrNoRows) {
			return context.Status(fiber.StatusNotFound).JSON(
				api.ResponseError{
					Error:         errRetrieve.Error(),
					FriendlyError: "The system did not found the specified resource asked",
				})
		}

		return serverError(context, errRetrieve, "redirect")
	}

	//? Check if the given password corresponds with the stored one
	errCompare := bcrypt.CompareHashAndPassword([]byte(
		originalURL.Password.String), []byte(requestBody.Password))
	if errCompare != nil {
		if errors.Is(errCompare, bcrypt.ErrMismatchedHashAndPassword) {
			return context.Status(fiber.StatusUnauthorized).JSON(
				api.ResponseError{
					Error:         errCompare.Error(),
					FriendlyError: "The password provided is incorrect",
				})
		}

		return serverError(context, errCompare, "redirect")
	}

	//? Check if the shorten URL is enabled
	if originalURL.Enabled {
		return context.Status(fiber.StatusNotFound).JSON(
			api.ResponseError{
				Error:         "Resource disabled",
				FriendlyError: "The system found the resource but it is disabled",
			})
	}

	//? Check if the shorten URL has been expired
	if originalURL.ExpirationTime.Before(time.Now()) {
		return context.Status(fiber.StatusNotFound).JSON(
			api.ResponseError{
				Error:         "Resource expired",
				FriendlyError: "The system found the resource but it is expired",
			})
	}

	errRedirect := context.Redirect(addProtocolIfNotExists(originalURL.Original))
	if errRedirect != nil {
		return serverError(context, errRedirect, "redirect")
	}

	return nil
}
