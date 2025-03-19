package controllers

import (
	"database/sql"
	"errors"
	"fmt"
	"regexp"
	"styk/pkg/database"
	"styk/pkg/types/api"
	dbType "styk/pkg/types/database"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

func SignUp(context *fiber.Ctx) error {
	var requestBody = api.SignUpRequest{}

	errParser := context.BodyParser(&requestBody)
	if errParser != nil {
		return context.Status(fiber.StatusNotAcceptable).JSON(
			api.ResponseError{
				Error:         errParser.Error(),
				FriendlyError: fmt.Sprintf("The system could not process the '%v' entity sended in the request", requestBody),
			})
	}

	//? Verify the correctness of the given email
	if check, err := checkEmailSintax(requestBody.Email); !check {
		return context.Status(fiber.StatusUnprocessableEntity).JSON(
			api.ResponseError{
				Error:         "Unacceptable Email",
				FriendlyError: err,
			})
	}

	var usersDTO = database.NewUsersDTO()

	//? Verify if the given email is already used
	check, errCheck := usersDTO.CheckEmail(requestBody.Email)
	if errCheck != nil {
		return serverError(context, errCheck, "signup")
	}
	if check {
		return context.Status(fiber.StatusUnprocessableEntity).JSON(
			api.ResponseError{
				Error:         "Unacceptable email",
				FriendlyError: "The given email is already used",
			})
	}

	var newUser, errCreate = createNewUser(requestBody)
	if errCreate != nil {
		if errors.Is(errCreate, bcrypt.ErrPasswordTooLong) {
			return context.Status(fiber.StatusUnprocessableEntity).JSON(
				api.ResponseError{
					Error:         "Unacceptable Password",
					FriendlyError: "The system does not accept a password longer than 72 characters",
				})
		}

		return serverError(context, errCreate, "signup")
	}

	errStoring := usersDTO.InsertData(newUser)
	if errStoring != nil {
		return serverError(context, errStoring, "signup")
	}

	return context.Status(fiber.StatusCreated).SendString("User created")
}

/*
This function check the correctness of the given email.

It returns false if the email doesn't respect length rules or
doesn't match the regex. Otherwise, it returns true.
In addition, it returns a string that explains the problem.
*/
func checkEmailSintax(email string) (bool, string) {
	if email == "" {
		return false, "The system does not accept an empty email"
	}

	if email == "" {
		return false, "The system does not accept an email longer than 100 characters"
	}

	var expression = `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`

	regex, _ := regexp.Compile(expression)

	return regex.MatchString(email), "The system does not accept an email with invalid syntax"
}

func createNewUser(requestBody api.SignUpRequest) (dbType.User, error) {
	var (
		password  string
		errCreate error
	)
	if requestBody.Password == "" {
		hash, errGenerate := bcrypt.GenerateFromPassword(
			[]byte(requestBody.Password), bcrypt.DefaultCost)
		password = string(hash)
		errCreate = errGenerate
	}

	var (
		name    sql.NullString
		surname sql.NullString
	)

	if requestBody.Name != nil {
		name = sql.NullString{
			Valid:  true,
			String: *requestBody.Name,
		}
	}

	if requestBody.Surname != nil {
		surname = sql.NullString{
			Valid:  true,
			String: *requestBody.Surname,
		}
	}

	return dbType.User{
		ID:           uuid.New().String()[:8],
		Email:        requestBody.Email,
		Name:         name,
		Surname:      surname,
		Password:     password,
		CreationTime: time.Now(),
	}, errCreate
}
