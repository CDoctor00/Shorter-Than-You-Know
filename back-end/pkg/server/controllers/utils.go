package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"regexp"
	"styk/pkg/server/auth"
	"styk/pkg/types/api"
	"styk/pkg/types/database"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

const (
	prefixMaxLength = 10
	urlMaxLength    = 2100
	noteMaxLength   = 500
	ShortenAction   = "shorten"
	UpdateAction    = "update"
)

/*---------- GENERIC UTILITY FUNCTIONS ----------*/

func serverError(context *fiber.Ctx, err error, action string) error {
	return context.Status(fiber.StatusInternalServerError).JSON(
		api.ResponseError{
			Error:         err.Error(),
			FriendlyError: fmt.Sprintf("The system has encountered an error while the %s", action),
		})
}

func getUserFromToken(context *fiber.Ctx) (*database.User, error) {
	//? Retrieving user email from the JWT
	token := string(context.Request().Header.Peek("Authorization"))
	if token == "" {
		return nil, nil
	}
	token = token[len("Bearer "):]

	claims, errClaims := auth.GetClaimsFromToken(token)
	if errClaims != nil {
		return nil, fmt.Errorf("getUserFromToken: %w", errClaims)
	}

	jsonClaim, errMarshal := json.Marshal(claims[auth.UserClaimName])
	if errMarshal != nil {
		return nil, fmt.Errorf("getUserFromToken: %w", errMarshal)
	}

	var tokenUser api.TokenUserInfo
	errUnmarshal := json.Unmarshal(jsonClaim, &tokenUser)
	if errUnmarshal != nil {
		return nil, fmt.Errorf("getUserFromToken: %w", errUnmarshal)
	}

	var user = database.User{
		ID:    tokenUser.ID,
		Email: tokenUser.Email,
	}

	if tokenUser.Name != nil {
		user.Name = sql.NullString{
			Valid:  true,
			String: *tokenUser.Name,
		}
	}
	if tokenUser.Surname != nil {
		user.Surname = sql.NullString{
			Valid:  true,
			String: *tokenUser.Surname,
		}
	}

	return &user, nil
}

/*---------- SHORTEN/UPDATE UTILITY FUNCTIONS ----------*/

/*
This function check the correctness of the given request body
(url, prefix, note and exp).

It returns a *api.ResponseError nil if the functions hasn't
encountered an error during the checking, otherwise is populated
with the specific error.
*/
func checkRequestBody(requestBody api.UrlRequest) *api.ResponseError {
	//? Verify the correctness of the given URL
	check, errCheck := checkURL(requestBody.URL)
	if !check {
		return &api.ResponseError{
			Error:         "Unacceptable URL",
			FriendlyError: errCheck,
		}
	}

	//? Verify the correctness of the given 'prefix' field
	check, errCheck = checkPrefix(requestBody.Prefix)
	if !check {
		return &api.ResponseError{
			Error:         "Unacceptable Prefix",
			FriendlyError: errCheck,
		}
	}

	//? Verify if the 'note' field respects the max and min limits
	check, errCheck = checkNote(requestBody.Note)
	if !check {
		if len(*requestBody.Note) > noteMaxLength {
			return &api.ResponseError{
				Error:         "Unacceptable Note",
				FriendlyError: errCheck,
			}
		}
	}

	//? Verify the validity of the given expirationTimes
	if requestBody.Exp != nil {
		date, errParse := time.Parse(time.RFC3339, *requestBody.Exp)

		if errParse != nil || time.Now().After(date) {
			return &api.ResponseError{
				Error:         "Wrong expiration time",
				FriendlyError: "The system accepts only date expressed in the RFC3339 format (e.g. 2006-01-02T15:04:05Z or 2006-01-02T15:04:05-07:00)",
			}
		}
	}

	return nil
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

	if len(url) > urlMaxLength {
		return false, fmt.Sprintf(
			"The system does not accept an URL longer than %d characters", urlMaxLength)
	}

	const expression = `^(https?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)$`
	regex, _ := regexp.Compile(expression)

	return regex.MatchString(url), "The system does not accept an URL with invalid syntax"
}

/*
This function check the correctness of the given Prefix.

It returns false only if the Prefix contains special characters or
doesn't respect length rules.
In addition, it returns a string that explains the problem.
*/
func checkPrefix(prefix *string) (bool, string) {
	if prefix == nil {
		return true, ""
	}

	if *prefix == "" {
		return false, "The system does not accept an empty string as prefix"
	}

	if len(*prefix) > prefixMaxLength {
		return false, fmt.Sprintf(
			"The system does not accept a prefix longer than %d characters", prefixMaxLength)
	}

	const expression = `[\W]` //Only alphanumeric characters
	regex, _ := regexp.Compile(expression)

	return !regex.MatchString(*prefix), "The system does not accept a prefix with special characters"
}

/*
This function check the correctness of the given Note.

It returns false only if the Note doesn't respect length rules.
In addition, it returns a string that explains the problem.
*/
func checkNote(note *string) (bool, string) {
	if note != nil {
		if *note == "" {
			return false, "The system does not accept an empty string as note"
		}

		if len(*note) > noteMaxLength {
			return false, fmt.Sprintf(
				"The system does not accept a prefix longer than %d characters", noteMaxLength)
		}
	}

	return true, ""
}

/*
This function create a new database.URL variable based on given parameters.

If action is equal to `ShortenAction` the fuction creates an URL
from scratch, otherwise if action is equal to `UpdateAction` it
reacreates the URL with the same UUID and InsertTime.
*/
func createNewURL(requestBody api.UrlRequest, userID sql.NullString, action string) (database.URL, error) {
	var (
		actualTime = time.Now()
		url        = database.URL{
			LongUrl:    requestBody.URL,
			OwnerID:    userID,
			UpdateTime: actualTime,
			Enabled:    true,
		}
	)

	switch action {
	case ShortenAction:
		url.UUID = uuid.New()
		url.InsertTime = actualTime
	case UpdateAction:
		url.UUID = *requestBody.UUID
	}
	url.ShortID = url.UUID.String()[:8]

	if requestBody.IsEnabled != nil {
		url.Enabled = *requestBody.IsEnabled
	}

	if requestBody.Password != nil {
		hash, errGenerate := bcrypt.GenerateFromPassword(
			[]byte(*requestBody.Password), bcrypt.DefaultCost)
		if errGenerate != nil {
			return database.URL{}, fmt.Errorf("controllers.createNewURL: %w", errGenerate)
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

	return url, nil
}
