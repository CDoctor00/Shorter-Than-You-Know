package utils

import (
	"bufio"
	"fmt"
	"os"
	"regexp"
	"strings"
)

func LoadEnv() {
	file, errOpen := os.Open(".env")
	if errOpen != nil {
		fmt.Println("Error encountered during opening the env file: %w", errOpen)
		os.Exit(-1)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}

		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			fmt.Println("Error encountered during reading the env variable (wrong format)")
			os.Exit(-1)
		}

		key := strings.TrimSpace(parts[0])
		value := strings.TrimSpace(parts[1])

		regex, _ := regexp.Compile(`^(['"` + "`" + `]).*\\1$`)
		if regex.MatchString(value) {
			value = value[1 : len(value)-1]
		}

		errSet := os.Setenv(key, value)
		if errSet != nil {
			fmt.Println("Error encountered during setting the env variable: %w", errSet)
			os.Exit(-1)
		}
	}

	errScan := scanner.Err()
	if errScan != nil {
		fmt.Println("Error encountered during reading of the env file: %w", errScan)
		os.Exit(-1)
	}
}
