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

type investment struct {
	Name     string  `json:"name"`
	Category string  `json:"category"`
	Amount   float64 `json:"amount"`
}
type account struct {
	Id          int64        `json:"id"`
	Name        string       `json:"name"`
	Holder      string       `json:"holder"`
	Cash        float64      `json:"cash"`
	Investments []investment `json:"investments"`
}

func GetAccountDetails(userId int64) ([]*account, error) {
	if db == nil {
		return nil, fmt.Errorf("database connection is not initialized")
	}
	// for each account of the user
	accountsQuery := `SELECT id, account_name, holder_name FROM accounts WHERE user_id = ?`
	rows, err := db.Query(accountsQuery, userId)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch accounts: %v", err)
	}
	defer rows.Close()
	var accounts []*account
	for rows.Next() {
		account := &account{}
		err := rows.Scan(&account.Id, &account.Name, &account.Holder)
		if err != nil {
			return nil, fmt.Errorf("failed to scan account: %v", err)
		}
		// get cash amount with account id
		err = db.QueryRow("SELECT amount FROM cash WHERE account_id = ?", account.Id).Scan(&account.Cash)
		if err != nil {
			if err == sql.ErrNoRows {
				account.Investments = []investment{} // Initialize empty array
				accounts = append(accounts, account) // Add account to the list
				continue                             // No investments found, continue to next account
			}
			return nil, fmt.Errorf("failed to fetch cash: %v", err)
		}
		// get investments with account id
		investmentQuery := `SELECT investment_name, category, amount FROM investments WHERE account_id = ?`
		rows, err := db.Query(investmentQuery, account.Id)
		if err != nil {
			return nil, fmt.Errorf("failed to fetch investments: %v", err)
		}
		defer rows.Close()
		for rows.Next() {
			investment := investment{}
			err := rows.Scan(&investment.Name, &investment.Category, &investment.Amount)
			if err != nil {
				return nil, fmt.Errorf("failed to scan investment: %v", err)
			}
			account.Investments = append(account.Investments, investment)
		}
		accounts = append(accounts, account)
	}
	return accounts, nil
}
