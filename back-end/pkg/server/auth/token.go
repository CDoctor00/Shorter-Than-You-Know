package auth

import (
	"fmt"
	"os"
	"styk/pkg/types/database"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func CreateToken(user database.User) (string, error) {
	var token = jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		jwt.MapClaims{
			"userUUID":       user.UUID,
			"email":          user.Email,
			"name":           user.Name,
			"surname":        user.Surname,
			"expirationTime": time.Now().Add(time.Hour * 24).Unix(),
		})

	secret_key := []byte(os.Getenv("JWT_KEY"))

	tokenString, errSign := token.SignedString(secret_key)
	if errSign != nil {
		return "", fmt.Errorf("auth.CreateToken: %w", errSign)
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
