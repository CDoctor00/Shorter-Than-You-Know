package queries

import (
	"database/sql"
	"fmt"
	"reflect"
	dbType "styk/pkg/types/database"
)

type Model struct {
	DB *sql.DB
}

/*
This function retrieves the 'db_...' tags from the given
parameter 'item' and returns them in an single multiple array.

The array so formed will be an array [n][2]string, where 'n' is
the number of field of the item and 2 is the number 'db...' tags.

Please note that, in order to a greater clarity of code, the name
of  tags and the index in the array respect the constants created
in the specific file.
*/
func retrieveTags(item interface{}) [][2]string {
	var tags [][2]string

	itemType := reflect.TypeOf(item)
	for i := 0; i < itemType.NumField(); i++ {
		fieldTags := [2]string{}
		fieldTags[dbType.TagCNIndex] = itemType.Field(i).Tag.Get(dbType.TagCNValue)
		fieldTags[dbType.TagCTIndex] = itemType.Field(i).Tag.Get(dbType.TagCTValue)
		tags = append(tags, fieldTags)
	}

	return tags
}

func generateTableStructure(table dbType.Table) string {
	var query string
	var tableTags = retrieveTags(table.Structure)

	for _, tags := range tableTags {
		query = fmt.Sprintf("%s,\n%s %s",
			query, tags[dbType.TagCNIndex], tags[dbType.TagCTIndex])
	}

	if table.AddIndex {
		query = fmt.Sprintf("index SERIAL%s", query)
	} else {
		query = query[2:]
	}

	if table.Constraints != "" {
		query = fmt.Sprintf("%s,\n%s", query, table.Constraints)
		//TODO verificare se modificare il parametro constraints da string a []string e ciclarlo
	}

	return query
}

/*
This function generates the `INSERT QUERY` dynamically using the tags of
the structure and the placeholders in order to a greater consistency of
the security of the code.
*/
func generateInsertQuery(table dbType.Table) string {
	var (
		query   string
		columns string
	)

	values := generateInsertPlaceholders(
		reflect.ValueOf(table.Structure).NumField())

	tags := retrieveTags(table.Structure)
	for _, tagsField := range tags {
		columns = fmt.Sprintf("%s, %s",
			columns, tagsField[dbType.TagCNIndex])
	}
	columns = columns[2:]

	query = fmt.Sprintf("INSERT INTO %s.%s (%s) VALUES (%s);",
		table.Schema, table.Name, columns, values)

	return query
}

/*
This function returns an array of `interface{}` in order to pass it in
the `sql.Exec()` functions as the arguments to replace the placeholders
of the query. The functions get the item and returns an array composed
by his destructured fields.
*/
func generateInsertArgs(item interface{}) []interface{} {
	var args []interface{}

	itemValue := reflect.ValueOf(item)
	for i := 0; i < itemValue.NumField(); i++ {
		arg := itemValue.Field(i).Interface()
		args = append(args, arg)
	}

	return args
}

/*
This function generates a string of necessary placeholders to create
the PostgreSQL INSERT query based on the number of fields of the item.
*/
func generateInsertPlaceholders(numFields int) string {
	var placeholders string
	for j := 1; j <= numFields; j++ {
		placeholders = fmt.Sprintf("%s,$%d", placeholders, j)
	}

	return placeholders[1:]
}