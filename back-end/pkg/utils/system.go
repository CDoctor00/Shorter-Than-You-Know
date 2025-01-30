package utils

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

func LoadEnv() {
	errLoad := godotenv.Load(".env")
	if errLoad != nil {
		fmt.Print("utils.LoadEnv: %w", errLoad)
		os.Exit(-1)
	}
}
