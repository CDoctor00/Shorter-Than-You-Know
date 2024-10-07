package utils

import (
	"fmt"

	"github.com/joho/godotenv"
)

func LoadEnv () {
		err := godotenv.Load(".env")
	if err != nil {
		fmt.Print("Error loading .env file")
	}
}