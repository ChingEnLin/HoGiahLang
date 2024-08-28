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
		CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, category STRING);
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
	query := `INSERT OR REPLACE INTO cash (id, account_id, amount) 
	VALUES ((SELECT id FROM cash WHERE account_id = ?), ?, ?)`
	_, err := db.Exec(query, accountId, accountId, amount)
	return err
}

func UpdateInvestment(investments []*investment) error {
	if db == nil {
		return fmt.Errorf("database connection is not initialized")
	}
	// Update investments based on id, if id is null, insert new investment
	for _, inv := range investments {
		if inv.Id == 0 {
			_, err := db.Exec("INSERT INTO investments (account_id, investment_name, category, amount) VALUES (?, ?, ?, ?)",
				inv.AccountId, inv.Name, inv.Category, inv.Amount)
			if err != nil {
				return err
			}
		} else {
			_, err := db.Exec("UPDATE investments SET investment_name = ?, category = ?, amount = ? WHERE id = ?",
				inv.Name, inv.Category, inv.Amount, inv.Id)
			if err != nil {
				return err
			}
		}
	}
	return nil
}

func DeleteInvestment(investmentId int64) error {
	if db == nil {
		return fmt.Errorf("database connection is not initialized")
	}
	_, err := db.Exec("DELETE FROM investments WHERE id = ?", investmentId)
	return err
}

type investment struct {
	Id        int64   `json:"id"`
	AccountId int64   `json:"account_id"`
	Name      string  `json:"name"`
	Category  string  `json:"category"`
	Amount    float64 `json:"amount"`
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
			return nil, fmt.Errorf("failed to fetch cash: %v", err)
		}
		// get investments with account id
		investmentQuery := `SELECT id, account_id, investment_name, category, amount FROM investments WHERE account_id = ?`
		rows, err := db.Query(investmentQuery, account.Id)
		if err != nil {
			if err == sql.ErrNoRows {
				account.Investments = []investment{} // Initialize empty array
				accounts = append(accounts, account) // Add account to the list
				continue                             // No investments found, continue to next account
			}
			return nil, fmt.Errorf("failed to fetch investments: %v", err)
		}
		defer rows.Close()
		for rows.Next() {
			investment := investment{}
			err := rows.Scan(&investment.Id, &investment.AccountId, &investment.Name, &investment.Category, &investment.Amount)
			if err != nil {
				return nil, fmt.Errorf("failed to scan investment: %v", err)
			}
			account.Investments = append(account.Investments, investment)
		}
		accounts = append(accounts, account)
	}
	return accounts, nil
}

type categories []string

func GetCategories(userId int64) (categories, error) {
	if db == nil {
		return nil, fmt.Errorf("database connection is not initialized")
	}
	rows, err := db.Query("SELECT category FROM categories WHERE user_id = ?", userId)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch categories: %v", err)
	}
	defer rows.Close()
	var cats categories
	for rows.Next() {
		var cat string
		err := rows.Scan(&cat)
		if err != nil {
			return nil, fmt.Errorf("failed to scan category: %v", err)
		}
		cats = append(cats, cat)
	}
	return cats, nil
}

func AddCategory(userId int64, category string) error {
	if db == nil {
		return fmt.Errorf("database connection is not initialized")
	}
	_, err := db.Exec("INSERT INTO categories (user_id, category) VALUES (?, ?)", userId, category)
	return err
}
