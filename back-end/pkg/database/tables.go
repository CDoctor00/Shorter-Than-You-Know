package database

import dbType "styk/pkg/types/database"

var TableURLs = dbType.Table{
	Name:        "urls",
	Schema:      "styk",
	Structure:   dbType.URL{},
	Constraints: "UNIQUE(uuid), UNIQUE(short)",
	AddIndex:    true,
}
