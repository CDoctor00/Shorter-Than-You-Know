package database

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type URL struct {
	UUID           uuid.UUID      `db_name:"uuid" db_type:"UUID NOT NULL"`
	Original       string         `db_name:"original" db_type:"VARCHAR(2100) NOT NULL"`
	Short          string         `db_name:"short" db_type:"VARCHAR(20) NOT NULL"`
	Password       sql.NullString `db_name:"password" db_type:"VARCHAR(60)"`
	OwnerID        sql.NullString `db_name:"owner_id" db_type:"CHAR(8)"`
	Enabled        bool           `db_name:"enabled" db_type:"BOOLEAN"`
	InsertTime     time.Time      `db_name:"insert_time" db_type:"TIMESTAMPTZ NOT NULL"`
	ExpirationTime time.Time      `db_name:"expiration_time" db_type:"TIMESTAMPTZ NOT NULL"`
	Note           sql.NullString `db_name:"note" db_type:"VARCHAR(500)"`
}

type User struct {
	Email        string         `db_name:"email" db_type:"VARCHAR(100) NOT NULL"`
	Password     string         `db_name:"password" db_type:"VARCHAR(60) NOT NULL"`
	ID           string         `db_name:"id" db_type:"CHAR(8) NOT NULL"`
	Name         sql.NullString `db_name:"name" db_type:"VARCHAR(50)"`
	Surname      sql.NullString `db_name:"surname" db_type:"VARCHAR(50)"`
	CreationTime time.Time      `db_name:"created_at" db_type:"TIMESTAMPTZ NOT NULL"`
}
