package controllers

import (
	"errors"
	"fmt"
	"regexp"
	"styk/pkg/database"
	"styk/pkg/server/auth"
	"styk/pkg/types/api"
	dbType "styk/pkg/types/database"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func Shorten(context *fiber.Ctx) error {
	// context.Accepts("application/json")

	var requestBody = api.ShortenRequest{}
	errParser := context.BodyParser(&requestBody)
	if errParser != nil {
		return context.Status(fiber.StatusNotAcceptable).JSON(
			api.ResponseError{
				Error:         errParser.Error(),
				FriendlyError: fmt.Sprintf("The system could not process the '%v' entity sended in the request", requestBody),
			})
	}

	if check, err := checkURL(requestBody.URL); !check {
		return context.Status(fiber.StatusUnprocessableEntity).JSON(
			api.ResponseError{
				Error:         "Unacceptable URL",
				FriendlyError: err,
			})
	}

	model, errGetInstance := database.GetInstance()
	if errGetInstance != nil {
		return errGetInstance
	}
	check, errCheck := model.CheckCustomURL(requestBody.CustomURL, database.TableURLs)
	if errCheck != nil {
		return context.Status(fiber.StatusInternalServerError).JSON(
			api.ResponseError{
				Error:         errCheck.Error(),
				FriendlyError: "The system has encountered an error while saving the data",
			})
	}
	if check {
		return context.Status(fiber.StatusUnprocessableEntity).JSON(
			api.ResponseError{
				Error:         "Unacceptable Custom URL",
				FriendlyError: "The chosen URL is already used",
			})
	}

	if !checkExpirationTime(requestBody.ExpirationTime) {
		return context.Status(fiber.StatusUnprocessableEntity).JSON(
			api.ResponseError{
				Error:         "Wrong expiration time",
				FriendlyError: "The system accepts only timestamp greater than actual time and less than 9999999999 (2286/11/20 05:46:39 GMT) in seconds",
			})
	}

	if len(requestBody.Note) > 500 {
		return context.Status(fiber.StatusUnprocessableEntity).JSON(
			api.ResponseError{
				Error:         "Unacceptable Note",
				FriendlyError: "The system does not accept a note longer than 500 characters",
			})
	}

	userUUID, errGetClaim := getUserUUIDFromToken(context)
	if errGetClaim != nil {
		return context.Status(fiber.StatusInternalServerError).JSON(
			api.ResponseError{
				Error:         errGetClaim.Error(),
				FriendlyError: "The system has encountered an error while creating the new URL",
			})
	}

	var newURL, errCreate = createNewURL(requestBody, userUUID)
	if errCreate != nil {
		if errors.Is(errors.Unwrap(errCreate), bcrypt.ErrPasswordTooLong) {
			return context.Status(fiber.StatusUnprocessableEntity).JSON(
				api.ResponseError{
					Error:         "Unacceptable Password",
					FriendlyError: "The system does not accept a password longer than 72 characters",
				})
		} else {
			return context.Status(fiber.StatusInternalServerError).JSON(
				api.ResponseError{
					Error:         errCreate.Error(),
					FriendlyError: "The system has encountered an error while creating the new URL",
				})
		}
	}

	errStoring := model.InsertData(newURL, database.TableURLs)
	if errStoring != nil {
		return context.Status(fiber.StatusInternalServerError).JSON(
			api.ResponseError{
				Error:         errStoring.Error(),
				FriendlyError: "The system has encountered an error while saving the data",
			})
	}

	return context.Status(fiber.StatusCreated).JSON(
		api.ShortenResponse{
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

func getUserUUIDFromToken(context *fiber.Ctx) (uuid.UUID, error) {
	var userUUID uuid.UUID

	tokenString := string(context.Request().Header.Peek("Authorization"))
	if tokenString != "" {
		tokenString = tokenString[len("Bearer "):]
		claims, errToken := auth.GetClaimsFromToken(tokenString)
		if errToken != nil {
			return userUUID, fmt.Errorf("controllers.getUserUUIDFromToken: %w", errToken)
		}

		var (
			stringUUID, _ = claims["userUUID"].(string)
			errParse      error
		)
		userUUID, errParse = uuid.Parse(stringUUID)
		if errParse != nil {
			return userUUID, fmt.Errorf("controllers.getUserUUIDFromToken: %w", errParse)
		}
	}

	return userUUID, nil
}

func createNewURL(requestBody api.ShortenRequest, userUUID uuid.UUID) (dbType.URL, error) {
	var (
		urlUUID  = uuid.New()
		password string
		shortURL = urlUUID.String()[:8]
	)

	if len(requestBody.Password) > 0 {
		hash, errGenerate := bcrypt.GenerateFromPassword(
			[]byte(requestBody.Password), bcrypt.DefaultCost)
		password = string(hash)

		if errGenerate != nil {
			return dbType.URL{}, fmt.Errorf("controllers.createNewURL: %w", errGenerate)
		}
	}

	if len(requestBody.CustomURL) > 0 {
		shortURL = requestBody.CustomURL
	}

	return dbType.URL{
		UUID:           urlUUID,
		Original:       requestBody.URL,
		Short:          shortURL,
		Password:       password,
		OwnerUUID:      userUUID,
		InsertTime:     time.Now(),
		ExpirationTime: time.Unix(requestBody.ExpirationTime, 0),
		Note:           requestBody.Note,
	}, nil
}
