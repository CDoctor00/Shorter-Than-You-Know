package queries

import (
	"fmt"
	"time"
)

func (dto DTO) UpdateURLStatus(shortURL string, enabled bool) error {
	var query = fmt.Sprintf("UPDATE %s.%s SET enabled = $1 WHERE short = $2;",
		dto.Table.Schema, dto.Table.Name)

	_, errExec := dto.DB.Exec(query, enabled, shortURL)
	if errExec != nil {
		return fmt.Errorf("queries.UpdateURLStatus: %w", errExec)
	}

	return nil
}

func (dto DTO) UpdateURLExp(shortURL string, newEXP time.Time) error {
	var query = fmt.Sprintf("UPDATE %s.%s SET expiration_time = $1 WHERE short = $2;",
		dto.Table.Schema, dto.Table.Name)

	_, errExec := dto.DB.Exec(query, newEXP, shortURL)
	if errExec != nil {
		return fmt.Errorf("queries.UpdateURLExp: %w", errExec)
	}

	return nil
}
