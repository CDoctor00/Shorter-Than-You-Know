package queries

import (
	"database/sql"
	"fmt"
	"styk/pkg/types/database"

	"github.com/google/uuid"
)

/*
This function does a SELECT query on the database of the specific table,
to get the original URL path from the 'shortURL' given parameter and returns it.
*/
func (dto DTO) RetrieveOriginalURL(shortURL string) (database.URL, error) {
	var originalURL database.URL

	var query = fmt.Sprintf("SELECT long_url, expiration_time, password FROM %s.%s WHERE short = $1",
		dto.Table.Schema, dto.Table.Name)

	result := dto.DB.QueryRow(query, shortURL)
	errQuery := result.Scan(
		&originalURL.LongUrl,
		&originalURL.ExpirationTime,
		&originalURL.Password,
	)
	if errQuery != nil {
		return originalURL, fmt.Errorf("queries.RetrieveOriginalURL: %w", errQuery)
	}

	return originalURL, nil
}

/*
This function does a SELECT query on the database of the specific table,
to check if exists another user with the same email.
*/
func (dto DTO) CheckEmail(customURL string) (bool, error) {
	var check bool

	var query = fmt.Sprintf("SELECT EXISTS (SELECT 1 FROM %s.%s WHERE email = $1)",
		dto.Table.Schema, dto.Table.Name)

	result := dto.DB.QueryRow(query, customURL)
	errQuery := result.Scan(&check)
	if errQuery != nil {
		return false, fmt.Errorf("queries.CheckEmail: %w", errQuery)
	}

	return check, nil
}

/*
This function does a SELECT query on the database of the specific table,
to get the all user informations of the given email.
*/
func (dto DTO) GetUserFromEmail(email string) (database.User, error) {
	var user database.User

	var query = fmt.Sprintf("SELECT id, email, password, name, surname, created_at FROM %s.%s WHERE email = $1",
		dto.Table.Schema, dto.Table.Name)

	result := dto.DB.QueryRow(query, email)
	errQuery := result.Scan(
		&user.ID,
		&user.Email,
		&user.Password,
		&user.Name,
		&user.Surname,
		&user.CreationTime,
	)
	if errQuery != nil {
		return user, fmt.Errorf("queries.GetUserFromEmail: %w", errQuery)
	}

	return user, nil
}

/*
This function does a SELECT query on the database of the specific table,
to get the url OwnerID based on the uuid given parameter and returns it.
*/
func (dto DTO) GetUrlOwnerID(uuid uuid.UUID) (sql.NullString, error) {
	var ownerID sql.NullString

	var query = fmt.Sprintf("SELECT owner_id FROM %s.%s WHERE uuid = $1",
		dto.Table.Schema, dto.Table.Name)

	result := dto.DB.QueryRow(query, uuid)
	errQuery := result.Scan(&ownerID)
	if errQuery != nil {
		return ownerID, fmt.Errorf("queries.GetUrlOwnerID: %w", errQuery)
	}

	return ownerID, nil
}

/*
This function does a SELECT query on the database of the specific table,
to get the url OwnerID and passowrd based on the uuid given parameter and returns them.
*/
func (dto DTO) GetUrlSecurityInfos(uuid uuid.UUID) (database.UrlSecurityInfos, error) {
	var data database.UrlSecurityInfos

	var query = fmt.Sprintf("SELECT owner_id, password FROM %s.%s WHERE uuid = $1",
		dto.Table.Schema, dto.Table.Name)

	result := dto.DB.QueryRow(query, uuid)
	errQuery := result.Scan(
		&data.OwnerID,
		&data.Password,
	)
	if errQuery != nil {
		return data, fmt.Errorf("queries.GetUrlSecurityInfos: %w", errQuery)
	}

	return data, nil
}

/*
This function does a SELECT query on the database of the specific table,
to get the all urls created by the given userID parameter and returns them.
*/
func (dto DTO) GetUserUrls(userID string) ([]database.URL, error) {
	var rows = []database.URL{}

	var query = fmt.Sprintf(`SELECT 
	uuid, long_url, short_id, prefix, enabled,
	insert_time, update_time, expiration_time, note 
	FROM %s.%s WHERE owner_id = $1
	ORDER BY update_time DESC`,
		dto.Table.Schema, dto.Table.Name)

	results, errQuery := dto.DB.Query(query, userID)
	if errQuery != nil {
		return rows, fmt.Errorf("queries.GetUserUrls: %w", errQuery)
	}

	var row database.URL
	for results.Next() {
		errScan := results.Scan(
			&row.UUID,
			&row.LongUrl,
			&row.ShortID,
			&row.Prefix,
			&row.Enabled,
			&row.InsertTime,
			&row.UpdateTime,
			&row.ExpirationTime,
			&row.Note,
		)
		if errScan != nil {
			return rows, fmt.Errorf("queries.GetUserUrls: %w", errScan)
		}
		rows = append(rows, row)
	}

	return rows, nil
}
