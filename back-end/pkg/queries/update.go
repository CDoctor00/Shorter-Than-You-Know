package queries

import (
	"fmt"
	"styk/pkg/types/database"
)

func (m Model) UpdateURLStatus(shortURL string, enabled bool, table database.Table) error {
	var query = fmt.Sprintf("UPDATE %s.%s SET enabled = $1 WHERE short = $2;", table.Schema, table.Name)

	_, errExec := m.DB.Exec(query, enabled, shortURL)
	if errExec != nil {
		return fmt.Errorf("queries.UpdateURLStatus: %w", errExec)
	}

	return nil
}
