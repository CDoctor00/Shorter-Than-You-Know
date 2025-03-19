package controllers

import (
	"database/sql"
	"errors"
	"fmt"
	"styk/pkg/database"
	"styk/pkg/types/api"
	dbType "styk/pkg/types/database"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func Shorten(context *fiber.Ctx) error {
	var requestBody = api.UrlRequest{}
	errParser := context.BodyParser(&requestBody)
	if errParser != nil {
		return context.Status(fiber.StatusNotAcceptable).JSON(
			api.ResponseError{
				Error:         errParser.Error(),
				FriendlyError: fmt.Sprintf("The system could not process the '%v' entity sended in the request", requestBody),
			})
	}

	//? Verify the correctness of the given URL
	check, errCheck := checkURL(requestBody.URL)
	if !check {
		return context.Status(fiber.StatusUnprocessableEntity).JSON(
			api.ResponseError{
				Error:         "Unacceptable URL",
				FriendlyError: errCheck,
			})
	}

	//? Verify the correctness of the given 'prefix' field
	check, errCheck = checkPrefix(requestBody.Prefix)
	if !check {
		return context.Status(fiber.StatusUnprocessableEntity).JSON(
			api.ResponseError{
				Error:         "Unacceptable Prefix",
				FriendlyError: errCheck,
			})
	}

	//? Verify if the 'note' field respects the min and max limits
	check, errCheck = checkNote(requestBody.Note)
	if !check {
		return context.Status(fiber.StatusUnprocessableEntity).JSON(
			api.ResponseError{
				Error:         "Unacceptable Note",
				FriendlyError: errCheck,
			})
	}

	//? Verify the validity of the given expirationTimes
	if requestBody.Exp != nil {
		date, errParse := time.Parse(time.RFC3339, *requestBody.Exp)

		if errParse != nil || time.Now().After(date) {
			return context.Status(fiber.StatusUnprocessableEntity).JSON(
				api.ResponseError{
					Error:         "Wrong expiration time",
					FriendlyError: "The system accepts only date expressed in the RFC3339 format (e.g. 2006-01-02T15:04:05Z or 2006-01-02T15:04:05-07:00)",
				})
		}
	}

	//? Get the userID from the JWT, if the user is logged, to link the new URL with the owner
	var userID sql.NullString

	user, errToken := getUserFromToken(context)
	if errToken != nil {
		return serverError(context, errToken, "URL shortening")
	}
	if user != nil {
		userID = sql.NullString{
			Valid:  true,
			String: user.ID,
		}
	}

	var newURL, errCreate = createNewURL(requestBody, userID)
	if errCreate != nil {
		if errors.Is(errors.Unwrap(errCreate), bcrypt.ErrPasswordTooLong) {
			return context.Status(fiber.StatusUnprocessableEntity).JSON(
				api.ResponseError{
					Error:         "Unacceptable Password",
					FriendlyError: "The system does not accept a password longer than 72 characters",
				})
		}

		return serverError(context, errCreate, "URL shortening")
	}

	var urlsDTO = database.NewUrlsDTO()
	errStoring := urlsDTO.InsertData(newURL)
	if errStoring != nil {
		return serverError(context, errStoring, "URL shortening")
	}

	return context.Status(fiber.StatusCreated).JSON(
		api.ShortenResponse{
			LongUrl: requestBody.URL,
			ShortID: newURL.ShortID,
		})
}

func createNewURL(requestBody api.UrlRequest, userID sql.NullString) (dbType.URL, error) {
	var url = dbType.URL{
		UUID:    uuid.New(),
		LongUrl: requestBody.URL,
		OwnerID: userID,
	}
	url.ShortID = url.UUID.String()[:8]

	if requestBody.Password != nil {
		hash, errGenerate := bcrypt.GenerateFromPassword(
			[]byte(*requestBody.Password), bcrypt.DefaultCost)
		if errGenerate != nil {
			return dbType.URL{}, fmt.Errorf("controllers.createNewURL: %w", errGenerate)
		}

		url.Password = sql.NullString{Valid: true, String: string(hash)}
	}

	if requestBody.Prefix != nil {
		url.ShortID = fmt.Sprintf("%s-%s", *requestBody.Prefix, url.ShortID)
		url.Prefix = sql.NullString{
			Valid:  true,
			String: *requestBody.Prefix,
		}
	}

	if requestBody.Exp != nil {
		date, _ := time.Parse(time.RFC3339, *requestBody.Exp)
		url.ExpirationTime = sql.NullTime{
			Valid: true,
			Time:  date,
		}
	}

	if requestBody.Note != nil {
		url.Note = sql.NullString{
			Valid:  true,
			String: *requestBody.Note,
		}
	}

	var actualTime = time.Now()
	url.InsertTime = actualTime
	url.UpdateTime = actualTime

	return url, nil
}
