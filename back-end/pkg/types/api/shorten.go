package api

type Request struct {
	URL            string `json:"URL"`            //a correct url like: https://www.google.com or www.google.com
	ExpirationTime int64  `json:"ExpirationTime"` //timestamp of expiration time like: 1735689600 = 2025/01/01 00:00:00
}

type Response struct {
	OriginalURL string `json:"originalURL"`
	ShortURL    string `json:"shortURL"`
}
