package api

type Request struct {
	URL        string `json:"URL"`        //a correct url like: https://www.google.com
	TimeToLive int64  `json:"TimeToLive"` //seconds to remain alive
}

type Response struct {
	OriginalURL string `json:"originalURL"`
	ShortURL    string `json:"shortURL"`
}
