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

	// Initialize the database schema
	sqlStmt := `
		CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user_name STRING);
		CREATE TABLE IF NOT EXISTS accounts (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, account_name STRING, holder_name STRING);
		CREATE TABLE IF NOT EXISTS cash (id INTEGER PRIMARY KEY AUTOINCREMENT, account_id INTEGER, amount FLOAT);
		CREATE TABLE IF NOT EXISTS investments (id INTEGER PRIMARY KEY AUTOINCREMENT, account_id INTEGER, investment_name STRING, category STRING, amount FLOAT);
	`
	_, err = db.Exec(sqlStmt)
	if err != nil {
		panic(fmt.Sprintf("%q: %s\n", err, sqlStmt))
	}
}

func AddUser(userName string) (int64, error) {
	if db == nil {
		return 0, fmt.Errorf("database connection is not initialized")
	}
	res, err := db.Exec("INSERT INTO users (user_name) VALUES (?)", userName)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

func AddAccount(userId int64, accountName string, holderName string) (int64, error) {
	if db == nil {
		return 0, fmt.Errorf("database connection is not initialized")
	}
	res, err := db.Exec("INSERT INTO accounts (user_id, account_name, holder_name) VALUES (?, ?, ?)", userId, accountName, holderName)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

func UpdateCash(accountId int64, amount float64) error {
	if db == nil {
		return fmt.Errorf("database connection is not initialized")
	}
	_, err := db.Exec("INSERT INTO cash (account_id, amount) VALUES (?, ?)", accountId, amount)
	return err
}

func AddInvestment(accountId int64, investmentName string, category string, amount float64) error {
	if db == nil {
		return fmt.Errorf("database connection is not initialized")
	}
	_, err := db.Exec("INSERT INTO investments (account_id, investment_name, category, amount) VALUES (?, ?, ?, ?)", accountId, investmentName, category, amount)
	return err
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
