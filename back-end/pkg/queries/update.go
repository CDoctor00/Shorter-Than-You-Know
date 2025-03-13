package queries

import (
	"fmt"
	"styk/pkg/types/database"
)

func (dto DTO) UpdateUrl(url database.URL) error {
	var query = fmt.Sprintf(`UPDATE %s.%s 
	SET long_url = $1, short_id = $2, prefix = $3, 
	password = $4, enabled = $5, update_time = $6, 
	expiration_time = $7, note = $8 WHERE uuid = $9;`,
		dto.Table.Schema, dto.Table.Name)

	_, errExec := dto.DB.Exec(
		query,
		url.LongUrl,
		url.ShortID,
		url.Prefix,
		url.Password,
		url.Enabled,
		url.UpdateTime,
		url.ExpirationTime,
		url.Note,
		url.UUID)
	if errExec != nil {
		return fmt.Errorf("queries.UpdateUrl: %w", errExec)
	}

	return nil
}
