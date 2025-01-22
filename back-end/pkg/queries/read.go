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

	var query = fmt.Sprintf("SELECT original, expiration_time, password from %s.%s WHERE short = $1",
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
