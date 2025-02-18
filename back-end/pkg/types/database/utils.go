package database

type Table struct {
	Name        string
	Schema      string
	Structure   interface{}
	Constraints []string
	AddIndex    bool
}

const (
	TagCNValue string = "db_name" //Tag that represents the name of the column
	TagCNIndex int    = 0         //Tag that represents the column name tag's position in the array of tags
	TagCTValue string = "db_type" //Tag that represents the type of the column
	TagCTIndex int    = 1         //Tag that represents the column type tag's position in the array of tags
)
