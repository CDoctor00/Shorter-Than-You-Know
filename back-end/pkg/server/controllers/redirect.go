package controllers

import (
	"styk/pkg/database"
	"styk/pkg/types/utils"
	"time"

	"github.com/gofiber/fiber/v2"
)

func Redirect(context *fiber.Ctx) error {
	var shortURL = context.Path()[1:]

	model, errGetInstance := database.GetInstance()
	if errGetInstance != nil {
		return errGetInstance
	}

	originalURL, errRetrieve := model.RetrieveOriginalURL(shortURL, database.TableURLs)
	if errRetrieve != nil {
		return context.Status(fiber.StatusNotFound).JSON(
			utils.ResponseError{
				Error:         errRetrieve.Error(),
				FriendlyError: "The system did not found the specified resource asked",
			})
	}

	if originalURL.ExpirationTime.Before(time.Now()) {
		return context.Status(fiber.StatusNotFound).JSON(
			utils.ResponseError{
				Error:         "Resource expired",
				FriendlyError: "The system found the resource but it is expired",
			})
	}

	errRedirect := context.Redirect(originalURL.Original)
	if errRedirect != nil {
		return context.Status(fiber.StatusInternalServerError).JSON(
			utils.ResponseError{
				Error:         errRedirect.Error(),
				FriendlyError: "The system has encountered an error to redirect to the original URL",
			})
	}

	return nil
}
