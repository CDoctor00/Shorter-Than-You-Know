package controllers

import (
	"database/sql"
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
	var requestBody = api.ShortenRequest{}
	errParser := context.BodyParser(&requestBody)
	if errParser != nil {
		return context.Status(fiber.StatusNotAcceptable).JSON(
			api.ResponseError{
				Error:         errParser.Error(),
				FriendlyError: fmt.Sprintf("The system could not process the '%v' entity sended in the request", requestBody),
			})
	}

	//? Verify the correctness of the given URL
	check, errCheckSintax := checkURLSintax(requestBody.URL)
	if !check {
		return context.Status(fiber.StatusUnprocessableEntity).JSON(
			api.ResponseError{
				Error:         "Unacceptable URL",
				FriendlyError: errCheckSintax,
			})
	}

	//? Verify if the 'prefix' field respects the max limit (10 chars)
	if len(requestBody.Prefix) > 10 {
		return context.Status(fiber.StatusUnprocessableEntity).JSON(
			api.ResponseError{
				Error:         "Unacceptable Custom URL",
				FriendlyError: "The system does not accept a custom URL longer than 10 characters",
			})
	}

	//? Verify the validity of the given expirationTimes
	if len(requestBody.Exp) > 0 {
		date, errParse := time.Parse(time.RFC3339, requestBody.Exp)

		if errParse != nil || time.Now().After(date) {
			return context.Status(fiber.StatusUnprocessableEntity).JSON(
				api.ResponseError{
					Error:         "Wrong expiration time",
					FriendlyError: "The system accepts only date expressed in the RFC3339 format (e.g. 2006-01-02T15:04:05Z or 2006-01-02T15:04:05-07:00)",
				})
		}
	}

	//? Verify if the 'note' field respects the max limit (500 chars)
	if len(requestBody.Note) > 500 {
		return context.Status(fiber.StatusUnprocessableEntity).JSON(
			api.ResponseError{
				Error:         "Unacceptable Note",
				FriendlyError: "The system does not accept a note longer than 500 characters",
			})
	}

	//? Get the userID from the JWT, if the user is logged, to link the new URL with the owner
	var userID sql.NullString

	tokenString := string(context.Request().Header.Peek("Authorization"))
	if len(tokenString) > 0 {
		tokenString = tokenString[len("Bearer "):]
		claims, errGetClaim := auth.GetClaimsFromToken(tokenString)
		if errGetClaim != nil {
			return serverError(context, errGetClaim, "URL shortening")
		}

		claim, _ := claims[auth.UserID].(string)
		userID = sql.NullString{
			Valid:  true,
			String: claim,
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
func checkURLSintax(url string) (bool, string) {
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

func createNewURL(requestBody api.ShortenRequest, userID sql.NullString) (dbType.URL, error) {
	var (
		urlUUID  = uuid.New()
		shortURL = urlUUID.String()[:8]
		password sql.NullString
		note     sql.NullString
		exp      sql.NullTime
	)

	if len(requestBody.Password) > 0 {
		hash, errGenerate := bcrypt.GenerateFromPassword(
			[]byte(requestBody.Password), bcrypt.DefaultCost)
		if errGenerate != nil {
			return dbType.URL{}, fmt.Errorf("controllers.createNewURL: %w", errGenerate)
		}

		password = sql.NullString{Valid: true, String: string(hash)}
	}

	if len(requestBody.Prefix) > 0 {
		shortURL = fmt.Sprintf("%s-%s", requestBody.Prefix, shortURL)
	}

	if len(requestBody.Note) > 0 {
		note = sql.NullString{
			Valid:  true,
			String: requestBody.Note,
		}
	}

	if len(requestBody.Exp) > 0 {
		date, _ := time.Parse(time.RFC3339, requestBody.Exp)
		exp = sql.NullTime{
			Valid: true,
			Time:  date,
		}
	}

	return dbType.URL{
		UUID:           urlUUID,
		Original:       requestBody.URL,
		Short:          shortURL,
		Password:       password,
		OwnerID:        userID,
		Enabled:        true,
		InsertTime:     time.Now(),
		ExpirationTime: exp,
		Note:           note,
	}, nil
}
