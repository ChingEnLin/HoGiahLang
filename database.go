package main

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func InitDB() {
	var err error
	db, err = sql.Open("sqlite3", "./accounting.db")
	if err != nil {
		panic(fmt.Sprintf("Error opening database: %q\n", err))
	}

	// Create a simple table to store asset values
	sqlStmt := `
    CREATE TABLE IF NOT EXISTS assets (id INTEGER PRIMARY KEY AUTOINCREMENT, amount REAL);
    `
	_, err = db.Exec(sqlStmt)
	if err != nil {
		panic(fmt.Sprintf("%q: %s\n", err, sqlStmt))
	}
}

func StoreAsset(amount float64) error {
	if db == nil {
		return fmt.Errorf("database connection is not initialized")
	}
	stmt, err := db.Prepare("INSERT INTO assets(amount) VALUES(?)")
	if err != nil {
		return err
	}
	_, err = stmt.Exec(amount)
	return err
}

func GetLatestAsset() (float64, error) {
	if db == nil {
		return 0, fmt.Errorf("database connection is not initialized")
	}
	var amount float64
	err := db.QueryRow("SELECT amount FROM assets ORDER BY id DESC LIMIT 1").Scan(&amount)
	return amount, err
}
