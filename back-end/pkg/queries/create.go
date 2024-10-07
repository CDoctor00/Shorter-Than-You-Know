package queries

import (
	"fmt"
	dbType "styk/pkg/types/database"
)

// ---------- CREATE FUNCTIONS ----------

func (m Model) CreateSchema(schemaName string) error {
	var query = fmt.Sprintf("CREATE SCHEMA IF NOT EXISTS %s;", schemaName)

	_, errExec := m.DB.Exec(query)
	if errExec != nil {
		return fmt.Errorf("queries.CreateSchema: %w", errExec)
	}

	return nil
}

func (m Model) CreateTable(table dbType.Table) error {
	var query = fmt.Sprintf("CREATE TABLE IF NOT EXISTS %s.%s (%s);",
		table.Schema, table.Name, generateTableStructure(table))

	_, errExec := m.DB.Exec(query)
	if errExec != nil {
		return fmt.Errorf("queries.CreateTable: %w", errExec)
	}

	return nil
}

// ---------- INSERT FUNCTIONS ----------

func (m Model) InsertData(item interface{}, table dbType.Table) error {
	var (
		query = generateInsertQuery(table)
		args  = generateInsertArgs(item)
	)

	_, errExec := m.DB.Exec(query, args...)
	if errExec != nil {
		return fmt.Errorf("queries.InsertData: %w", errExec)
	}

	return nil
}
