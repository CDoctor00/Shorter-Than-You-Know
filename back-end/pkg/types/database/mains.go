package database

import (
	"time"

	"github.com/google/uuid"
)

type URL struct {
	UUID           uuid.UUID `db_name:"uuid" db_type:"UUID"`
	Original       string    `db_name:"original" db_type:"TEXT"`
	Short          string    `db_name:"short" db_type:"VARCHAR(20)"`
	InsertTime     time.Time `db_name:"insert_time" db_type:"TIMESTAMPTZ"`
	ExpirationTime time.Time `db_name:"expiration_time" db_type:"TIMESTAMPTZ"`
}
