package queries

import (
	"fmt"
	"styk/pkg/types/database"
)

/*
This function does a SELECT query on the database of the specific table,
to get the original URL path from the 'shortURL' given parameter and returns it.
*/
func (m Model) RetrieveOriginalURL(shortURL string, table database.Table) (database.URL, error) {
	var originalURL database.URL

	var query = fmt.Sprintf("SELECT original, expiration_time, password FROM %s.%s WHERE short = $1",
		table.Schema, table.Name)

	result := m.DB.QueryRow(query, shortURL)
	errQuery := result.Scan(
		&originalURL.Original,
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
to check if exists another short URL with the same value of the given string.
*/
func (m Model) CheckCustomURL(customURL string, table database.Table) (bool, error) {
	var check bool

	var query = fmt.Sprintf("SELECT EXISTS (SELECT 1 FROM %s.%s WHERE short = $1)",
		table.Schema, table.Name)

	result := m.DB.QueryRow(query, customURL)
	errQuery := result.Scan(&check)
	if errQuery != nil {
		return false, fmt.Errorf("queries.CheckCustomURL: %w", errQuery)
	}

	return check, nil
}

/*
This function does a SELECT query on the database of the specific table,
to check if exists another user with the same email.
*/
func (m Model) CheckEmail(customURL string, table database.Table) (bool, error) {
	var check bool

	var query = fmt.Sprintf("SELECT EXISTS (SELECT 1 FROM %s.%s WHERE email = $1)",
		table.Schema, table.Name)

	result := m.DB.QueryRow(query, customURL)
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
func (m Model) GetUserFromEmail(email string, table database.Table) (database.User, error) {
	var user database.User

	var query = fmt.Sprintf("SELECT id, email, password, name, surname, created_at FROM %s.%s WHERE email = $1",
		table.Schema, table.Name)

	result := m.DB.QueryRow(query, email)
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
to get the url infos based on the shortURL given parameter and returns it.
*/
func (m Model) GetURLMainInfos(shortURL string, table database.Table) (database.URL, error) {
	var url database.URL

	var query = fmt.Sprintf("SELECT short, original, password, owner_id, enabled FROM %s.%s WHERE short = $1",
		table.Schema, table.Name)

	result := m.DB.QueryRow(query, shortURL)
	errQuery := result.Scan(
		&url.Short,
		&url.Original,
		&url.Password,
		&url.OwnerID,
		&url.Enabled,
	)
	if errQuery != nil {
		return url, fmt.Errorf("queries.GetURLMainInfos: %w", errQuery)
	}

	return url, nil
}
