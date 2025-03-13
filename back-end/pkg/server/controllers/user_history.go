package controllers

import (
	"styk/pkg/database"
	"styk/pkg/server/auth"
	"styk/pkg/types/api"
	"time"

	"github.com/gofiber/fiber/v2"
)

func UserHistory(context *fiber.Ctx) error {
	//? Retrieving user email from the JWT
	tokenString := string(context.Request().Header.Peek("Authorization"))
	tokenString = tokenString[len("Bearer "):]

	claims, errClaims := auth.GetClaimsFromToken(tokenString)
	if errClaims != nil {
		return serverError(context, errClaims, "get user history")
	}

	userID, _ := claims[auth.UserID].(string)

	var urlsDTO = database.NewUrlsDTO()

	rows, errGet := urlsDTO.GetUserUrls(userID)
	if errGet != nil {
		return serverError(context, errGet, "get user history")
	}

	var history = []api.UrlData{}

	for _, row := range rows {
		var url = api.UrlData{
			UUID:       row.UUID,
			LongURL:    row.Original,
			ShortURL:   row.Short,
			IsEnabled:  row.Enabled,
			CreateTime: row.InsertTime.Format(time.RFC3339),
			UpdateTime: row.UpdateTime.Format(time.RFC3339),
		}

		if row.ExpirationTime.Valid {
			var exp = row.ExpirationTime.Time.Format(time.RFC3339)
			url.ExpirationTime = &exp
		}
		if row.Prefix.Valid {
			url.Prefix = &row.Prefix.String
		}
		if row.Note.Valid {
			url.Note = &row.Note.String
		}

		history = append(history, url)
	}

	return context.Status(fiber.StatusOK).JSON(history)
}
