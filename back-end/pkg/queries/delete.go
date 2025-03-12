package queries

import (
	"fmt"

	"github.com/google/uuid"
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

func (dto DTO) DeleteUrl(uuid uuid.UUID) error {
	var query = fmt.Sprintf("DELETE FROM %s.%s WHERE uuid = $1;",
		dto.Table.Schema, dto.Table.Name)

	_, errExec := dto.DB.Exec(query, uuid)
	if errExec != nil {
		return fmt.Errorf("queries.DeleteURL: %w", errExec)
	}

	return nil
}
