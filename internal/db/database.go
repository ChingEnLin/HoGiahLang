package db

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func InitDB() {
	var err error
	dbPath := GetDatabasePath()
	db, err = sql.Open("sqlite3", dbPath)
	// db, err = sql.Open("sqlite3", "./accounting.db")

	if err != nil {
		panic(fmt.Sprintf("Error opening database: %q\n", err))
	}

	// Initialize the database schema
	sqlStmt := `
		CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user_name STRING);
		CREATE TABLE IF NOT EXISTS accounts (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, account_name STRING, holder_name STRING);
		CREATE TABLE IF NOT EXISTS cash (id INTEGER PRIMARY KEY AUTOINCREMENT, account_id INTEGER, amount FLOAT, currency STRING);
		CREATE TABLE IF NOT EXISTS investments (id INTEGER PRIMARY KEY AUTOINCREMENT, account_id INTEGER, investment_name STRING, category STRING, amount FLOAT, currency STRING);
		CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, category STRING);
	`
	_, err = db.Exec(sqlStmt)
	if err != nil {
		panic(fmt.Sprintf("%q: %s\n", err, sqlStmt))
	}
}

type Investment struct {
	Id        int64   `json:"id"`
	AccountId int64   `json:"account_id"`
	Name      string  `json:"name"`
	Category  string  `json:"category"`
	Amount    float64 `json:"amount"`
	Currency  string  `json:"currency"`
}
type Account struct {
	Id           int64        `json:"id"`
	Name         string       `json:"name"`
	Holder       string       `json:"holder"`
	Cash         float64      `json:"cash"`
	CashCurrency string       `json:"cash_currency"`
	Investments  []Investment `json:"investments"`
}

type Categories []string

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

func DeleteAccount(accountId int64) error {
	if db == nil {
		return fmt.Errorf("database connection is not initialized")
	}
	_, err := db.Exec("DELETE FROM accounts WHERE id = ?", accountId)
	if err != nil {
		return err
	}
	_, err = db.Exec("DELETE FROM cash WHERE account_id = ?", accountId)
	if err != nil {
		return err
	}
	_, err = db.Exec("DELETE FROM investments WHERE account_id = ?", accountId)
	return err
}

func UpdateCash(accountId int64, amount float64, currency string) error {
	if db == nil {
		return fmt.Errorf("database connection is not initialized")
	}
	query := `INSERT OR REPLACE INTO cash (id, account_id, amount, currency) 
	VALUES ((SELECT id FROM cash WHERE account_id = ?), ?, ?, ?)`
	_, err := db.Exec(query, accountId, accountId, amount, currency)
	return err
}

func UpdateInvestment(investments []*Investment) error {
	if db == nil {
		return fmt.Errorf("database connection is not initialized")
	}
	// Update investments based on id, if id is null, insert new investment
	for _, inv := range investments {
		if inv.Id == 0 {
			_, err := db.Exec("INSERT INTO investments (account_id, investment_name, category, amount, currency) VALUES (?, ?, ?, ?, ?)",
				inv.AccountId, inv.Name, inv.Category, inv.Amount, inv.Currency)
			if err != nil {
				return err
			}
		} else {
			_, err := db.Exec("UPDATE investments SET investment_name = ?, category = ?, amount = ?, currency = ? WHERE id = ?",
				inv.Name, inv.Category, inv.Amount, inv.Currency, inv.Id)
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

func GetAccountDetails(userId int64) ([]*Account, error) {
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
	var accounts []*Account
	for rows.Next() {
		account := &Account{}
		err := rows.Scan(&account.Id, &account.Name, &account.Holder)
		if err != nil {
			return nil, fmt.Errorf("failed to scan account: %v", err)
		}
		// get cash amount with account id
		err = db.QueryRow("SELECT amount, currency FROM cash WHERE account_id = ?", account.Id).Scan(&account.Cash, &account.CashCurrency)
		if err != nil {
			if err == sql.ErrNoRows {
				account.Cash = 0
				account.CashCurrency = "EUR"
			} else {
				return nil, fmt.Errorf("failed to fetch cash: %v", err)
			}
		}
		// get investments with account id
		investmentQuery := `SELECT id, account_id, investment_name, category, amount, currency FROM investments WHERE account_id = ?`
		rows, err := db.Query(investmentQuery, account.Id)
		if err != nil {
			if err == sql.ErrNoRows {
				account.Investments = []Investment{} // Initialize empty array
				accounts = append(accounts, account) // Add account to the list
				continue                             // No investments found, continue to next account
			}
			return nil, fmt.Errorf("failed to fetch investments: %v", err)
		}
		defer rows.Close()
		for rows.Next() {
			investment := Investment{}
			err := rows.Scan(&investment.Id, &investment.AccountId, &investment.Name, &investment.Category, &investment.Amount, &investment.Currency)
			if err != nil {
				return nil, fmt.Errorf("failed to scan investment: %v", err)
			}
			account.Investments = append(account.Investments, investment)
		}
		accounts = append(accounts, account)
	}
	return accounts, nil
}

func GetCategories(userId int64) (Categories, error) {
	if db == nil {
		return nil, fmt.Errorf("database connection is not initialized")
	}
	rows, err := db.Query("SELECT category FROM categories WHERE user_id = ?", userId)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch categories: %v", err)
	}
	defer rows.Close()
	var cats Categories
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
