package api

import "github.com/golang-jwt/jwt/v5"

type ResponseError struct {
	Error         string `json:"error"`
	FriendlyError string `json:"friendlyError"`
}

type Token struct {
	jwt.RegisteredClaims
	User TokenUserInfo `json:"user"`
}

type TokenUserInfo struct {
	ID      string  `json:"id"`
	Email   string  `json:"email"`
	Name    *string `json:"name,omitempty"`
	Surname *string `json:"surname,omitempty"`
}
