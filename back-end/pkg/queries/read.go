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
		return false, fmt.Errorf("queries.RetrieveOriginalURL: %w", errQuery)
	}

	return check, nil
}
