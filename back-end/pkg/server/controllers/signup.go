package controllers

import (
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

	if check, err := checkEmail(requestBody.Email); !check {
		return context.Status(fiber.StatusUnprocessableEntity).JSON(
			api.ResponseError{
				Error:         "Unacceptable Email",
				FriendlyError: err,
			})
	}

	model, errGetInstance := database.GetInstance()
	if errGetInstance != nil {
		return serverError(context, errGetInstance, "signup")
	}

	check, errCheck := model.CheckEmail(requestBody.Email, database.TableUsers)
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

	errStoring := model.InsertData(newUser, database.TableUsers)
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
func checkEmail(email string) (bool, string) {
	if email == "" {
		return false, "The system does not accept an empty email"
	}

	if len(email) > 100 {
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
	if len(requestBody.Password) > 0 {
		hash, errGenerate := bcrypt.GenerateFromPassword(
			[]byte(requestBody.Password), bcrypt.DefaultCost)
		password = string(hash)
		errCreate = errGenerate
	}

	return dbType.User{
		UUID:         uuid.New(),
		Email:        requestBody.Email,
		Name:         requestBody.Name,
		Surname:      requestBody.Surname,
		Password:     password,
		CreationTime: time.Now(),
	}, errCreate
}
