package database

import (
	"fmt"
	"styk/pkg/queries"
	dbType "styk/pkg/types/database"
)

func Initialize() error {
	var (
		err error
		dto queries.DTO
	)

	err = connect()
	if err != nil {
		return fmt.Errorf("databate.Initialize: %w", err)
	}

	//? Initialize Users Table
	dto = NewUsersDTO()

	err = dto.CreateSchema()
	if err != nil {
		return fmt.Errorf("databate.Initialize: %w", err)
	}

	err = dto.CreateTable()
	if err != nil {
		return fmt.Errorf("databate.Initialize: %w", err)
	}

	//? Initialize Urls Table
	dto = NewUrlsDTO()

	err = dto.CreateSchema()
	if err != nil {
		return fmt.Errorf("databate.Initialize: %w", err)
	}

	err = dto.CreateTable()
	if err != nil {
		return fmt.Errorf("databate.Initialize: %w", err)
	}

	return nil
}

func NewUrlsDTO() queries.DTO {
	return queries.DTO{
		DB: instance,
		Table: dbType.Table{
			Name:      "urls",
			Schema:    "styk",
			Structure: dbType.URL{},
			Constraints: []string{
				"UNIQUE(uuid)",
				"UNIQUE(short)",
				"FOREIGN KEY(owner_id) REFERENCES styk.users(id) ON DELETE CASCADE",
			},
			AddIndex: true,
		},
	}
}

func NewUsersDTO() queries.DTO {
	return queries.DTO{
		DB: instance,
		Table: dbType.Table{
			Name:      "users",
			Schema:    "styk",
			Structure: dbType.User{},
			Constraints: []string{
				"UNIQUE(email)",
				"UNIQUE(id)",
			},
			AddIndex: true,
		},
	}
}
