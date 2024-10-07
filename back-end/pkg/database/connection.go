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
			fmt.Errorf("error encountered during the connection to the database: %w", err)
	}

	err = instance.Ping()
	if err != nil {
		return queries.Model{},
			fmt.Errorf("error encountered during the ping to the database: %w", err)
	}

	return queries.Model{DB: instance}, nil
}
