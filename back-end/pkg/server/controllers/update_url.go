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
	"golang.org/x/crypto/bcrypt"
)

func UpdateURL(context *fiber.Ctx) error {
	var requestBody api.UpdateRequest

	errParser := context.BodyParser(&requestBody)
	if errParser != nil {
		return context.Status(fiber.StatusNotAcceptable).JSON(
			api.ResponseError{
				Error:         errParser.Error(),
				FriendlyError: fmt.Sprintf("The system could not process the '%v' entity sended in the request", requestBody),
			})
	}

	var urlsDTO = database.NewUrlsDTO()

	ownerID, errGet := urlsDTO.GetUrlOwnerID(requestBody.UUID)
	if errGet != nil {
		if errors.Is(errors.Unwrap(errGet), sql.ErrNoRows) {
			return context.Status(fiber.StatusNotFound).JSON(
				api.ResponseError{
					Error:         errGet.Error(),
					FriendlyError: "The system did not found the specified resource asked",
				})
		}

		return serverError(context, errGet, "update url")
	}

	user, errToken := getUserFromToken(context)
	if errToken != nil {
		return serverError(context, errToken, "update url")
	}

	//? Check if the request's user is the url's owner
	if !ownerID.Valid || user.ID != ownerID.String {
		return context.Status(fiber.StatusUnauthorized).JSON(
			api.ResponseError{
				Error:         "The user can't update the asked resource",
				FriendlyError: "The user isn't the url's owner",
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
				Error:         "Unacceptable Custom URL",
				FriendlyError: errCheck,
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

	//? Verify if the 'note' field respects the max limit
	if len(requestBody.Note) > noteMaxLength {
		return context.Status(fiber.StatusUnprocessableEntity).JSON(
			api.ResponseError{
				Error:         "Unacceptable Note",
				FriendlyError: "The system does not accept a note longer than 500 characters",
			})
	}

	var url, errCreate = createUrl(requestBody)
	if errCreate != nil {
		if errors.Is(errors.Unwrap(errCreate), bcrypt.ErrPasswordTooLong) {
			return context.Status(fiber.StatusUnprocessableEntity).JSON(
				api.ResponseError{
					Error:         "Unacceptable Password",
					FriendlyError: "The system does not accept a password longer than 72 characters",
				})
		}

		return serverError(context, errCreate, "update url")
	}

	errUpdate := urlsDTO.UpdateUrl(url)
	if errUpdate != nil {
		return serverError(context, errUpdate, "update url")
	}

	return context.Status(fiber.StatusCreated).JSON(
		api.UpdateResponse{
			LongUrl:    requestBody.URL,
			ShortID:    url.ShortID,
			UpdateTime: url.UpdateTime.Format(time.RFC3339),
		})
}

func createUrl(requestBody api.UpdateRequest) (dbType.URL, error) {
	var url = dbType.URL{
		UUID:       requestBody.UUID,
		LongUrl:    requestBody.URL,
		ShortID:    requestBody.UUID.String()[:8],
		UpdateTime: time.Now(),
		Enabled:    true,
	}

	if len(requestBody.Password) > 0 {
		hash, errGenerate := bcrypt.GenerateFromPassword(
			[]byte(requestBody.Password), bcrypt.DefaultCost)
		if errGenerate != nil {
			return dbType.URL{}, fmt.Errorf("controllers.createNewURL: %w", errGenerate)
		}

		url.Password = sql.NullString{Valid: true, String: string(hash)}
	}

	if len(requestBody.Prefix) > 0 {
		url.ShortID = fmt.Sprintf("%s-%s", requestBody.Prefix, url.ShortID)
		url.Prefix = sql.NullString{
			Valid:  true,
			String: requestBody.Prefix,
		}
	}

	if len(requestBody.Exp) > 0 {
		date, _ := time.Parse(time.RFC3339, requestBody.Exp)
		url.ExpirationTime = sql.NullTime{
			Valid: true,
			Time:  date,
		}
	}

	if requestBody.IsEnabled != nil {
		url.Enabled = *requestBody.IsEnabled
	}

	url.Note = sql.NullString{
		Valid:  len(requestBody.Note) > 0,
		String: requestBody.Note,
	}

	return url, nil
}
