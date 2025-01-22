package api

type RedirectRequest struct {
	ShortURL string `json:"ShortURL"`
	Password string `json:"Password"`
}
