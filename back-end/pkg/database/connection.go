package database

import (
	"database/sql"
	"fmt"
	"os"
	"sync"

	_ "github.com/lib/pq" //PostgreSQL driver
)

var (
	instance *sql.DB
	once     sync.Once
)

func connect() error {
	var err error

	once.Do(func() {
		db, errConnection := sql.Open("postgres", os.Getenv("DB_CONNECTION"))
		if errConnection != nil {
			err = errConnection
		}

		instance = db
	})
	if err != nil {
		return fmt.Errorf("database.connect: %w", err)
	}

	err = instance.Ping()
	if err != nil {
		return fmt.Errorf("database.connect: %w", err)
	}

	return nil
}
