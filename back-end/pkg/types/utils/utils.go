package utils

type ResponseError struct {
	Error         string `json:"error"`
	FriendlyError string `json:"friendlyError"`
}
