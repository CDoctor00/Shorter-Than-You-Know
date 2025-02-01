package queries

import (
	"fmt"
	"styk/pkg/types/database"
	"time"
)

func (m Model) UpdateURLStatus(shortURL string, enabled bool, table database.Table) error {
	var query = fmt.Sprintf("UPDATE %s.%s SET enabled = $1 WHERE short = $2;", table.Schema, table.Name)

	_, errExec := m.DB.Exec(query, enabled, shortURL)
	if errExec != nil {
		return fmt.Errorf("queries.UpdateURLStatus: %w", errExec)
	}

	return nil
}

func (m Model) UpdateURLExp(shortURL string, newEXP time.Time, table database.Table) error {
	var query = fmt.Sprintf("UPDATE %s.%s SET expiration_time = $1 WHERE short = $2;", table.Schema, table.Name)

	_, errExec := m.DB.Exec(query, newEXP, shortURL)
	if errExec != nil {
		return fmt.Errorf("queries.UpdateURLExp: %w", errExec)
	}

	return nil
}
