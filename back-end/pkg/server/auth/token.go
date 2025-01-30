package auth

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const ( //Token type
	AccessToken  = "accessToken"
	RefreshToken = "refreshToken"
)

const ( //Token claims
	UserID         = "userID"
	CreationTime   = "iat"
	ExpirationTime = "exp"
)

func CreateToken(userID string, tokenType string) (string, error) {
	var duration time.Duration

	switch tokenType {
	case AccessToken:
		duration = time.Minute * 30
	case RefreshToken:
		duration = time.Hour * 24 * 30
	}

	var token = jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		jwt.MapClaims{
			UserID:         userID,
			CreationTime:   time.Now().Unix(),
			ExpirationTime: time.Now().Add(duration).Unix(),
		})

	secret_key := []byte(os.Getenv("JWT_KEY"))

	tokenString, errSign := token.SignedString(secret_key)
	if errSign != nil {
		return "", fmt.Errorf("auth.CreateRefreshToken: %w", errSign)
	}

	return tokenString, nil
}

func GetClaimsFromToken(tokenString string) (jwt.MapClaims, error) {
	var claims jwt.MapClaims

	token, errParse := jwt.Parse(tokenString,
		func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_KEY")), nil
		})
	if errParse != nil {
		return claims, fmt.Errorf("auth.GetClaimsFromToken: %w", errParse)
	}

	if !token.Valid {
		return nil, fmt.Errorf("auth.GetClaimsFromToken: invalid token")
	}

	claims, _ = token.Claims.(jwt.MapClaims)

	return claims, nil
}
