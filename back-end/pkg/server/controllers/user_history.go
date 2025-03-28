package controllers

import (
	"styk/pkg/database"
	"styk/pkg/types/api"
	"time"

	"github.com/gofiber/fiber/v2"
)

func UserHistory(context *fiber.Ctx) error {
	user, errToken := getUserFromToken(context)
	if errToken != nil {
		return serverError(context, errToken, "URL shortening")
	}

	var urlsDTO = database.NewUrlsDTO()

	rows, errGet := urlsDTO.GetUserUrls(user.ID)
	if errGet != nil {
		return serverError(context, errGet, "get user history")
	}

	var history = []api.UrlData{}

	for _, row := range rows {
		var url = api.UrlData{
			UUID:        row.UUID,
			LongUrl:     row.LongUrl,
			ShortID:     row.ShortID,
			IsEnabled:   row.Enabled,
			CreateTime:  row.InsertTime.Format(time.RFC3339),
			UpdateTime:  row.UpdateTime.Format(time.RFC3339),
			Clicks:      row.Clicks,
			HasPassword: row.Password.Valid,
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
