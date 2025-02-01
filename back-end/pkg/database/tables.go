package database

import dbType "styk/pkg/types/database"

var TableURLs = dbType.Table{
	Name:      "urls",
	Schema:    "styk",
	Structure: dbType.URL{},
	Constraints: `UNIQUE(uuid), UNIQUE(short), 
	FOREIGN KEY(owner_id) REFERENCES styk.users(id)`,
	AddIndex: true,
}

var TableUsers = dbType.Table{
	Name:        "users",
	Schema:      "styk",
	Structure:   dbType.User{},
	Constraints: "UNIQUE(email), UNIQUE(id)",
	AddIndex:    true,
}
