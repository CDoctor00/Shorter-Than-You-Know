package api

type ShortenRequest struct {
	URL      string `json:"URL"`            //a correct url like: 'https://www.google.com' or 'www.google.com'
	Prefix   string `json:"Prefix"`         //a string representing the new shorten URL: 'short'
	Exp      string `json:"ExpirationTime"` //expiration time in RFC3339 format like: 2006-01-02T15:04:05Z or 2006-01-02T15:04:05-07:00
	Note     string `json:"Note"`           //a text field to explain the purpose of the link
	Password string `json:"Password"`       //a text field (max 72 chars) that limits the access to the link
}

type ShortenResponse struct {
	OriginalURL string `json:"originalURL"`
	ShortURL    string `json:"shortURL"`
}

type RedirectRequest struct {
	ShortURL string `json:"ShortURL"`
	Password string `json:"Password"`
}

type StatusRequest struct {
	ShortURL string `json:"ShortURL"`
	Enabled  bool   `json:"Enabled"`
}

type ExpirationRequest struct {
	ShortURL string `json:"ShortURL"`
	NewExp   string `json:"NewExpirationTime"`
}
