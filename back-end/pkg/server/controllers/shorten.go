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

	if check, err := checkURL(requestBody.URL); !check {
		return context.Status(fiber.StatusUnprocessableEntity).JSON(
			utils.ResponseError{
				Error:         "Unacceptable URL",
				FriendlyError: err,
			})
	}

	if !checkExpirationTime(requestBody.ExpirationTime) {
		return context.Status(fiber.StatusUnprocessableEntity).JSON(
			utils.ResponseError{
				Error:         "Wrong expiration time",
				FriendlyError: "The system accepts only timestamp greater than actual time and less than 9999999999 (2286/11/20 05:46:39 GMT) in seconds",
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

/*
This function check the correctness of the given URL.

It returns false if the URL doesn't respect length rules or
doesn't match the regex. Otherwise, it returns true.
In addition, it returns a string that explains the problem.
*/
func checkURL(url string) (bool, string) {
	if url == "" {
		return false, "The system does not accept an empty URL"
	}

	if len(url) > 2100 {
		return false, "The system does not accept an URL longer than 2100 characters"
	}

	var expression = `^(https?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)$`

	regex, _ := regexp.Compile(expression)

	return regex.MatchString(url), "The system does not accept an URL with invalid syntax"
}

/*
This function check the correctness of the given expiration time.

It returns true if the given time is after current time and before
the 9999999999 (2286/11/20 05:46:39 GMT), else it returns false.
*/
func checkExpirationTime(expirationTime int64) bool {
	//? Accept only timestamp in seconds and not in milliseconds

	if time.Now().Unix() > expirationTime || expirationTime > 9999999999 {
		return false
	}

	return true
}

func createNewURL(requestBody api.Request) dbType.URL {
	urlUUID := uuid.New()

	return dbType.URL{
		UUID:           urlUUID,
		Original:       requestBody.URL,
		Short:          urlUUID.String()[:8],
		InsertTime:     time.Now(),
		ExpirationTime: time.Unix(requestBody.ExpirationTime, 0),
	}
}

func storeData(url dbType.URL) error {
	model, errGetInstance := database.GetInstance()
	if errGetInstance != nil {
		return errGetInstance
	}

	return model.InsertData(url, database.TableURLs)
}
