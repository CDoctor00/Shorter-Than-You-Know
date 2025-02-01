package controllers

import (
	"database/sql"
	"errors"
	"styk/pkg/database"
	"styk/pkg/types/api"
	"time"

	"github.com/gofiber/fiber/v2"
)

func Redirect(context *fiber.Ctx) error {
	var shortURL = context.Path()[1:]

	model, errGetInstance := database.GetInstance()
	if errGetInstance != nil {
		return serverError(context, errGetInstance, "redirect")
	}

	//? Get original URL's infos from the given shorten one
	originalURL, errRetrieve := model.RetrieveOriginalURL(shortURL, database.TableURLs)
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

	if originalURL.Password.Valid {
		return context.Status(fiber.StatusOK).SendString(
			"The requested resource needs the password to be returned")
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
