package queries

import (
	"fmt"
)

// ---------- CREATE FUNCTIONS ----------

func (dto DTO) CreateSchema() error {
	var query = fmt.Sprintf("CREATE SCHEMA IF NOT EXISTS %s;", dto.Table.Schema)

	_, errExec := dto.DB.Exec(query)
	if errExec != nil {
		return fmt.Errorf("queries.CreateSchema: %w", errExec)
	}

	return nil
}

func (dto DTO) CreateTable() error {
	var query = fmt.Sprintf("CREATE TABLE IF NOT EXISTS %s.%s (%s);",
		dto.Table.Schema, dto.Table.Name, generateTableStructure(dto.Table))

	_, errExec := dto.DB.Exec(query)
	if errExec != nil {
		return fmt.Errorf("queries.CreateTable: %w", errExec)
	}

	return nil
}

// ---------- INSERT FUNCTIONS ----------

func (dto DTO) InsertData(item interface{}) error {
	var (
		query = generateInsertQuery(dto.Table)
		args  = generateInsertArgs(item)
	)

	_, errExec := dto.DB.Exec(query, args...)
	if errExec != nil {
		return fmt.Errorf("queries.InsertData: %w", errExec)
	}

	return nil
}
