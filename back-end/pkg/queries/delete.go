package queries

import (
	"fmt"
)

func (dto DTO) DeleteUser(userID string) error {
	var query = fmt.Sprintf("DELETE FROM %s.%s WHERE id = $1;",
		dto.Table.Schema, dto.Table.Name)

	_, errExec := dto.DB.Exec(query, userID)
	if errExec != nil {
		return fmt.Errorf("queries.DeleteUser: %w", errExec)
	}

	return nil
}

func (dto DTO) DeleteURL(shortURL string) error {
	var query = fmt.Sprintf("DELETE FROM %s.%s WHERE short = $1;",
		dto.Table.Schema, dto.Table.Name)

	_, errExec := dto.DB.Exec(query, shortURL)
	if errExec != nil {
		return fmt.Errorf("queries.DeleteURL: %w", errExec)
	}

	return nil
}
