package database

import (
	"database/sql"
	"fmt"
	"os"
	"styk/pkg/queries"
	"sync"

	_ "github.com/lib/pq" //PostgreSQL driver
)

var (
	instance *sql.DB
	once     sync.Once
)

func GetInstance() (queries.Model, error) {
	var err error

	once.Do(func() {
		db, errConnection := sql.Open("postgres", os.Getenv("DB_CONNECTION"))
		if errConnection != nil {
			err = errConnection
		}

		instance = db
	})
	if err != nil {
		return queries.Model{},
			fmt.Errorf("database.GetInstance: %w", err)
	}

	err = instance.Ping()
	if err != nil {
		return queries.Model{},
			fmt.Errorf("database.GetInstance: %w", err)
	}

	return queries.Model{DB: instance}, nil
}
