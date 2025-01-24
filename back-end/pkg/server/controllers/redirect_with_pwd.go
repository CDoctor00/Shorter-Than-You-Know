package controllers

import (
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
		return errGetInstance
	}

	originalURL, errRetrieve := model.RetrieveOriginalURL(
		requestBody.ShortURL, database.TableURLs)
	if errRetrieve != nil {
		return context.Status(fiber.StatusNotFound).JSON(
			api.ResponseError{
				Error:         errRetrieve.Error(),
				FriendlyError: "The system did not found the specified resource asked",
			})
	}

	if bcrypt.CompareHashAndPassword(
		[]byte(originalURL.Password), []byte(requestBody.Password)) != nil {
		return context.Status(fiber.StatusUnauthorized).JSON(
			api.ResponseError{
				Error:         "Wrong password",
				FriendlyError: "The given password isn't correct",
			})
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
