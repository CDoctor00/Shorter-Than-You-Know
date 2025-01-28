package database

import (
	"time"

	"github.com/google/uuid"
)

type URL struct {
	UUID           uuid.UUID `db_name:"uuid" db_type:"UUID"`
	Original       string    `db_name:"original" db_type:"VARCHAR(2100)"`
	Short          string    `db_name:"short" db_type:"VARCHAR(20)"`
	Password       string    `db_name:"password" db_type:"VARCHAR(60)"`
	InsertTime     time.Time `db_name:"insert_time" db_type:"TIMESTAMPTZ"`
	ExpirationTime time.Time `db_name:"expiration_time" db_type:"TIMESTAMPTZ"`
	Note           string    `db_name:"note" db_type:"VARCHAR(500)"`
}

type User struct {
	Email        string    `db_name:"email" db_type:"VARCHAR(100)"`
	Password     string    `db_name:"password" db_type:"VARCHAR(60)"`
	UUID         uuid.UUID `db_name:"uuid" db_type:"UUID"`
	Name         string    `db_name:"name" db_type:"VARCHAR(50)"`
	Surname      string    `db_name:"surname" db_type:"VARCHAR(50)"`
	CreationTime time.Time `db_name:"created_at" db_type:"TIMESTAMPTZ"`
}
