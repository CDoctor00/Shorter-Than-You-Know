package auth

import (
	"fmt"
	"os"
	"styk/pkg/types/api"
	"styk/pkg/types/database"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const ( //Token type
	AccessToken  = "accessToken"
	RefreshToken = "refreshToken"
)
const UserClaimName = "user" //Token Claim

func CreateToken(user database.User, tokenType string) (string, error) {
	var duration time.Duration

	switch tokenType {
	case AccessToken:
		duration = time.Minute * 30
	case RefreshToken:
		duration = time.Hour * 24 * 30
	}

	var claims = api.Token{
		RegisteredClaims: jwt.RegisteredClaims{
			// ID:        uuid.NewString(),
			// Subject:   "styk",
			// Issuer:    "back-end",
			// Audience:  jwt.ClaimStrings{"front-end"},
			// NotBefore: jwt.NewNumericDate(time.Now()),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(duration)),
		},
		User: api.TokenUserInfo{
			ID:    user.ID,
			Email: user.Email,
		},
	}
	if user.Name.Valid {
		claims.User.Name = &user.Name.String
	}
	if user.Surname.Valid {
		claims.User.Surname = &user.Surname.String
	}

	var token = jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

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
