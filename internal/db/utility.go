package db

import (
	"os"
	"path/filepath"
)

func GetDatabasePath() string {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		panic(err)
	}

	appSupportDir := filepath.Join(homeDir, "Library", "Application Support", "HoGiahLang")
	err = os.MkdirAll(appSupportDir, os.ModePerm)
	if err != nil {
		panic(err)
	}

	dbPath := filepath.Join(appSupportDir, "accounting.db")
	return dbPath
}
