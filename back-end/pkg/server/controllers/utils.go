package controllers

import (
	"fmt"
	"regexp"
	"styk/pkg/types/api"
	"time"

	"github.com/gofiber/fiber/v2"
)

/*---------- GENERIC UTILITY FUNCTIONS ----------*/

func serverError(context *fiber.Ctx, err error, action string) error {
	return context.Status(fiber.StatusInternalServerError).JSON(
		api.ResponseError{
			Error:         err.Error(),
			FriendlyError: fmt.Sprintf("The system has encountered an error while the %s", action),
		})
}

/*---------- REDIRECT UTILITY FUNCTIONS ----------*/

/*
This function check if the given URL has or not the protocol.
If it hasn't, the 'https://' will be added.

It returns the given URL with the certainty that the protocol is present.
*/
func addProtocolIfNotExists(url string) string {
	var expression = `^(http|https):\/\/`

	regex, _ := regexp.Compile(expression)

	if regex.MatchString(url) {
		return url
	}

	return fmt.Sprintf("https://%s", url)
}

/*---------- REDIRECT AND UPDATE UTILITY FUNCTIONS ----------*/

/*
This function checks the correctness of the given expiration time.

It returns true if the given time is after current time and before
the 9999999999 (2286/11/20 05:46:39 GMT), else it returns false.
*/
func checkExpirationTime(expirationTime int64) bool {
	//? Accept only timestamp in seconds and not in milliseconds

	if time.Now().Unix() > expirationTime || expirationTime > 9999999999 {
		return false
	}

	return true
}
