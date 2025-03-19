package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"regexp"
	"styk/pkg/server/auth"
	"styk/pkg/types/api"
	"styk/pkg/types/database"

	"github.com/gofiber/fiber/v2"
)

const (
	prefixMaxLength = 10
	urlMaxLength    = 2100
	noteMaxLength   = 500
)

/*---------- GENERIC UTILITY FUNCTIONS ----------*/

func serverError(context *fiber.Ctx, err error, action string) error {
	return context.Status(fiber.StatusInternalServerError).JSON(
		api.ResponseError{
			Error:         err.Error(),
			FriendlyError: fmt.Sprintf("The system has encountered an error while the %s", action),
		})
}

func getUserFromToken(context *fiber.Ctx) (*database.User, error) {
	//? Retrieving user email from the JWT
	token := string(context.Request().Header.Peek("Authorization"))
	if token == "" {
		return nil, nil
	}
	token = token[len("Bearer "):]

	claims, errClaims := auth.GetClaimsFromToken(token)
	if errClaims != nil {
		return nil, fmt.Errorf("getUserFromToken: %w", errClaims)
	}

	jsonClaim, errMarshal := json.Marshal(claims[auth.UserClaimName])
	if errMarshal != nil {
		return nil, fmt.Errorf("getUserFromToken: %w", errMarshal)
	}

	var tokenUser api.TokenUserInfo
	errUnmarshal := json.Unmarshal(jsonClaim, &tokenUser)
	if errUnmarshal != nil {
		return nil, fmt.Errorf("getUserFromToken: %w", errUnmarshal)
	}

	var user = database.User{
		ID:    tokenUser.ID,
		Email: tokenUser.Email,
	}

	if tokenUser.Name != nil {
		user.Name = sql.NullString{
			Valid:  true,
			String: *tokenUser.Name,
		}
	}
	if tokenUser.Surname != nil {
		user.Surname = sql.NullString{
			Valid:  true,
			String: *tokenUser.Surname,
		}
	}

	return &user, nil
}

/*---------- SHORTEN/UPDATE UTILITY FUNCTIONS ----------*/

/*
This function check the correctness of the given URL.

It returns false if the URL doesn't respect length rules or
doesn't match the regex. Otherwise, it returns true.
In addition, it returns a string that explains the problem.
*/
func checkURL(url string) (bool, string) {
	if url == "" {
		return false, "The system does not accept an empty URL"
	}

	if len(url) > urlMaxLength {
		return false, fmt.Sprintf(
			"The system does not accept an URL longer than %d characters", urlMaxLength)
	}

	const expression = `^(https?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)$`
	regex, _ := regexp.Compile(expression)

	return regex.MatchString(url), "The system does not accept an URL with invalid syntax"
}

/*
This function check the correctness of the given Prefix.

It returns false only if the Prefix contains special characters or
doesn't respect length rules.
In addition, it returns a string that explains the problem.
*/
func checkPrefix(prefix *string) (bool, string) {
	if prefix == nil {
		return true, ""
	}

	if *prefix == "" {
		return false, "The system does not accept an empty string as prefix"
	}

	if len(*prefix) > prefixMaxLength {
		return false, fmt.Sprintf(
			"The system does not accept a prefix longer than %d characters", prefixMaxLength)
	}

	const expression = `[\W]` //Only alphanumeric characters
	regex, _ := regexp.Compile(expression)

	return !regex.MatchString(*prefix), "The system does not accept a prefix with special characters"
}

/*
This function check the correctness of the given Note.

It returns false only if the Note doesn't respect length rules.
In addition, it returns a string that explains the problem.
*/
func checkNote(note *string) (bool, string) {
	if note != nil {
		if *note == "" {
			return false, "The system does not accept an empty string as note"
		}

		if len(*note) > noteMaxLength {
			return false, fmt.Sprintf(
				"The system does not accept a prefix longer than %d characters", prefixMaxLength)
		}
	}

	return true, ""
}
