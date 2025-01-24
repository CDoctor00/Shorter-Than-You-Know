package controllers

import (
	"fmt"
	"regexp"
	"styk/pkg/database"
	"styk/pkg/types/api"
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
			api.ResponseError{
				Error:         errRetrieve.Error(),
				FriendlyError: "The system did not found the specified resource asked",
			})
	}

	if len(originalURL.Password) > 0 {
		return context.Status(fiber.StatusOK).SendString(
			"The requested resource needs the password to be returned")
	}

	if originalURL.ExpirationTime.Before(time.Now()) {
		return context.Status(fiber.StatusNotFound).JSON(
			api.ResponseError{
				Error:         "Resource expired",
				FriendlyError: "The system found the resource but it is expired",
			})
	}

	errRedirect := context.Redirect(addProtocolIfNotExists(originalURL.Original))
	if errRedirect != nil {
		return context.Status(fiber.StatusInternalServerError).JSON(
			api.ResponseError{
				Error:         errRedirect.Error(),
				FriendlyError: "The system has encountered an error to redirect to the original URL",
			})
	}

	return nil
}

/*
This function check if the given URL has or not the protocol.
If it hasn't, the 'https://' will be added.

It returns the given URL with the certainty that the protocol is present.
*/
func addProtocolIfNotExists(url string) string {
	var expression = `^(http|https):\/\/`

	regex, _ := regexp.Compile(expression)

	if regex.MatchString(url) {
		return url
	}

	return fmt.Sprintf("https://%s", url)
}
