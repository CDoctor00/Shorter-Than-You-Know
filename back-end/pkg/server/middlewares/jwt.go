package middlewares

import (
	"os"

	jwtware "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v2"
)

func GetJWT() func(*fiber.Ctx) error {
	key := os.Getenv("JWT_KEY")

	return jwtware.New(
		jwtware.Config{
			SigningKey: jwtware.SigningKey{
				Key: []byte(key),
			},
		})
}
