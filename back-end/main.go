package main

import (
	"fmt"
	"os"
	"styk/pkg/database"
	"styk/pkg/server"
	"styk/pkg/utils"
)

func main() {
	utils.LoadEnv()

	model, err := database.GetInstance()
	if err != nil {
		fmt.Println(err)
		os.Exit(-1)
	}

	err = model.CreateSchema(database.TableURLs.Schema)
	if err != nil {
		fmt.Println(err)
		os.Exit(-1)
	}

	err = model.CreateTable(database.TableURLs)
	if err != nil {
		fmt.Println(err)
		os.Exit(-1)
	}

	server.Start()
}
