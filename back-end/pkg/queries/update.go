package queries

import (
	"fmt"
	"styk/pkg/types/database"
)

func (dto DTO) UpdateUrl(url database.UpdateURL) error {
	var query, args = generateUpdateQueryAndArgs(dto.Table, url)
	query = fmt.Sprintf("%s uuid = $%d;", query, len(args)+1)
	args = append(args, url.UUID)

	_, errExec := dto.DB.Exec(query, args...)
	if errExec != nil {
		return fmt.Errorf("queries.UpdateUrl: %w", errExec)
	}

	return nil
}

func (dto DTO) UpdateUser(user database.UpdateUser) error {
	var query, args = generateUpdateQueryAndArgs(dto.Table, user)
	query = fmt.Sprintf("%s id = $%d;", query, len(args)+1)
	args = append(args, user.ID)

	_, errExec := dto.DB.Exec(query, args...)
	if errExec != nil {
		return fmt.Errorf("queries.UpdateUser: %w", errExec)
	}

	return nil
}
