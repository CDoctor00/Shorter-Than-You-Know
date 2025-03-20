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
	var requestBody api.UrlRequest

	errParser := context.BodyParser(&requestBody)
	if errParser != nil {
		return context.Status(fiber.StatusNotAcceptable).JSON(
			api.ResponseError{
				Error:         errParser.Error(),
				FriendlyError: fmt.Sprintf("The system could not process the '%v' entity sended in the request", requestBody),
			})
	}

	var urlsDTO = database.NewUrlsDTO()

	ownerID, errGet := urlsDTO.GetUrlOwnerID(*requestBody.UUID)
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

	errCheckBody := checkRequestBody(requestBody)
	if errCheckBody != nil {
		return context.Status(fiber.StatusUnauthorized).JSON(*errCheckBody)
	}

	var url, errCreate = updateUrl(requestBody)
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
		api.UpdateUrlResponse{
			LongUrl:    requestBody.URL,
			ShortID:    *url.ShortID,
			UpdateTime: url.UpdateTime.Format(time.RFC3339),
		})
}

/*
This function create a new database.URL variable based on given parameters.
*/
func updateUrl(requestBody api.UrlRequest) (dbType.UpdateURL, error) {
	var (
		actualTime = time.Now()
		url        = dbType.UpdateURL{
			UUID:       *requestBody.UUID,
			LongUrl:    &requestBody.URL,
			UpdateTime: &actualTime,
			Enabled:    requestBody.IsEnabled,
		}
		shortID = url.UUID.String()[:8]
	)

	if requestBody.Password != nil {
		hash, errGenerate := bcrypt.GenerateFromPassword(
			[]byte(*requestBody.Password), bcrypt.DefaultCost)
		if errGenerate != nil {
			return dbType.UpdateURL{}, fmt.Errorf("controllers.updateUrl: %w", errGenerate)
		}

		url.Password = &sql.NullString{Valid: *requestBody.Password != "", String: string(hash)}
	}

	if requestBody.Exp != nil {
		date, _ := time.Parse(time.RFC3339, *requestBody.Exp)
		url.ExpirationTime = &sql.NullTime{
			Valid: *requestBody.Exp != "",
			Time:  date,
		}
	}

	if requestBody.Note != nil {
		url.Note = &sql.NullString{
			Valid:  *requestBody.Note != "",
			String: *requestBody.Note,
		}
	}

	if requestBody.Prefix != nil {
		if *requestBody.Prefix != "" {
			shortID = fmt.Sprintf("%s-%s", *requestBody.Prefix, shortID)
		}

		url.Prefix = &sql.NullString{
			Valid:  *requestBody.Prefix != "",
			String: *requestBody.Prefix,
		}

	}
	url.ShortID = &shortID

	return url, nil
}
