package controllers

import (
	"fmt"
	"regexp"
	"styk/pkg/database"
	"styk/pkg/types/api"
	dbType "styk/pkg/types/database"
	"styk/pkg/types/utils"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func Shorten(context *fiber.Ctx) error {
	// context.Accepts("application/json")

	var requestBody = api.Request{}
	errParser := context.BodyParser(&requestBody)
	if errParser != nil {
		return context.Status(fiber.StatusNotAcceptable).JSON(
			utils.ResponseError{
				Error:         errParser.Error(),
				FriendlyError: fmt.Sprintf("The system could not process the '%v' entity sended in the request", requestBody),
			})
	}

	if requestBody.URL == "" {
		return context.Status(fiber.StatusUnprocessableEntity).JSON(
			utils.ResponseError{
				Error:         "Empty body",
				FriendlyError: "The system does not accept an empty string",
			})
	}

	if !checkURL(requestBody.URL) {
		return context.Status(fiber.StatusUnprocessableEntity).JSON(
			utils.ResponseError{
				Error:         "Wrong url",
				FriendlyError: "The system does not accept a malformed url",
			})
	}

	var newURL = createNewURL(requestBody)

	errStoring := storeData(newURL)
	if errStoring != nil {
		return context.Status(fiber.StatusInternalServerError).JSON(
			utils.ResponseError{
				Error:         errStoring.Error(),
				FriendlyError: "The system has encountered an error while saving the data",
			})
	}

	return context.Status(fiber.StatusOK).JSON(
		api.Response{
			OriginalURL: requestBody.URL,
			ShortURL:    newURL.Short,
		})
}

func checkURL(url string) bool {
	var expression = `^https?:\/\/(www\.)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)$`

	regex, _ := regexp.Compile(expression)

	return regex.MatchString(url)
}

func createNewURL(requestBody api.Request) dbType.URL {
	urlUUID := uuid.New()

	insertTime := time.Now()

	return dbType.URL{
		UUID:           urlUUID,
		Original:       requestBody.URL,
		Short:          urlUUID.String()[:8],
		InsertTime:     insertTime,
		ExpirationTime: time.Unix(insertTime.Unix()+requestBody.TimeToLive, 0),
	}
}

func storeData(url dbType.URL) error {
	model, errGetInstance := database.GetInstance()
	if errGetInstance != nil {
		return errGetInstance
	}

	return model.InsertData(url, database.TableURLs)
}
