package api

import "github.com/google/uuid"

type UrlRequest struct {
	URL       string     `json:"URL"`                      //a correct url like: 'https://www.google.com' or 'www.google.com'
	IsEnabled *bool      `json:"IsEnabled,omitempty"`      //a boolean to know if enable or not a url
	UUID      *uuid.UUID `json:"UUID,omitempty"`           //an uuid to identify the shorten URL (used for update)
	Prefix    *string    `json:"Prefix,omitempty"`         //a string representing the new shorten URL: 'short'
	Exp       *string    `json:"ExpirationTime,omitempty"` //expiration time in RFC3339 format like: 2006-01-02T15:04:05Z or 2006-01-02T15:04:05-07:00
	Note      *string    `json:"Note,omitempty"`           //a text field to explain the purpose of the link
	Password  *string    `json:"Password,omitempty"`       //a text field (max 72 chars) that limits the access to the link
}

type ShortenResponse struct {
	LongUrl string `json:"longUrl"`
	ShortID string `json:"shortID"`
}

type RedirectRequest struct {
	ShortURL string `json:"ShortURL"`
	Password string `json:"Password"`
}

type DeleteRequest struct {
	UUID     uuid.UUID `json:"UUID"`
	Password string    `json:"Password"`
}

type UpdateResponse struct {
	LongUrl    string `json:"longUrl"`
	ShortID    string `json:"shortID"`
	UpdateTime string `json:"updateTime"`
}

type UrlData struct {
	UUID           uuid.UUID `json:"uuid"`
	LongUrl        string    `json:"longUrl"`
	ShortID        string    `json:"shortID"`
	IsEnabled      bool      `json:"isEnabled"`
	CreateTime     string    `json:"createTime"`
	UpdateTime     string    `json:"updateTime"`
	Prefix         *string   `json:"prefix,omitempty"`
	ExpirationTime *string   `json:"expirationTime,omitempty"`
	Note           *string   `json:"note,omitempty"`
}
