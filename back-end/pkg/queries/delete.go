package queries

import (
	"fmt"
	"styk/pkg/types/database"
)

func (m Model) DeleteUser(userID string, table database.Table) error {
	var query = fmt.Sprintf("DELETE FROM %s.%s WHERE id = $1;", table.Schema, table.Name)

	_, errExec := m.DB.Exec(query, userID)
	if errExec != nil {
		return fmt.Errorf("queries.DeleteUser: %w", errExec)
	}

	return nil
}

func (m Model) DeleteURL(shortURL string, table database.Table) error {
	var query = fmt.Sprintf("DELETE FROM %s.%s WHERE short = $1;", table.Schema, table.Name)

	_, errExec := m.DB.Exec(query, shortURL)
	if errExec != nil {
		return fmt.Errorf("queries.DeleteURL: %w", errExec)
	}

	return nil
}
