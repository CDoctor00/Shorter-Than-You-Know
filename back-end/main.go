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

	//? Database initialization
	var errDB = database.Initialize()
	if errDB != nil {
		fmt.Println(errDB)
		os.Exit(-1)
	}

	server.Start()
}
