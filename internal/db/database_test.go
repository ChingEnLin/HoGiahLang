package db

import (
	"database/sql"
	"os"
	"testing"

	_ "github.com/mattn/go-sqlite3"
)

func setupTestDB(t *testing.T) {
	var err error
	dbPath := "./test.db"
	db, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		t.Fatalf("Error opening test database: %q\n", err)
	}

	sqlStmt := `
		CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, user_name STRING);
		CREATE TABLE IF NOT EXISTS accounts (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, account_name STRING, holder_name STRING);
		CREATE TABLE IF NOT EXISTS cash (id INTEGER PRIMARY KEY AUTOINCREMENT, account_id INTEGER, amount FLOAT, currency STRING);
		CREATE TABLE IF NOT EXISTS investments (id INTEGER PRIMARY KEY AUTOINCREMENT, account_id INTEGER, investment_name STRING, category STRING, amount FLOAT, currency STRING);
		CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, category STRING);
	`
	_, err = db.Exec(sqlStmt)
	if err != nil {
		t.Fatalf("%q: %s\n", err, sqlStmt)
	}
}

func teardownTestDB() {
	db.Close()
	os.Remove("./test.db")
}

func TestAddUser(t *testing.T) {
	setupTestDB(t)
	defer teardownTestDB()

	userId, err := AddUser("testuser")
	if err != nil {
		t.Fatalf("Error adding user: %v", err)
	}

	if userId == 0 {
		t.Fatalf("Expected non-zero user ID")
	}
}

func TestAddAccount(t *testing.T) {
	setupTestDB(t)
	defer teardownTestDB()

	userId, err := AddUser("testuser")
	if err != nil {
		t.Fatalf("Error adding user: %v", err)
	}

	accountId, err := AddAccount(userId, "testaccount", "testholder")
	if err != nil {
		t.Fatalf("Error adding account: %v", err)
	}

	if accountId == 0 {
		t.Fatalf("Expected non-zero account ID")
	}
}

func TestDeleteAccount(t *testing.T) {
	setupTestDB(t)
	defer teardownTestDB()

	userId, err := AddUser("testuser")
	if err != nil {
		t.Fatalf("Error adding user: %v", err)
	}

	accountId, err := AddAccount(userId, "testaccount", "testholder")
	if err != nil {
		t.Fatalf("Error adding account: %v", err)
	}

	err = DeleteAccount(accountId)
	if err != nil {
		t.Fatalf("Error deleting account: %v", err)
	}
}

func TestUpdateCash(t *testing.T) {
	setupTestDB(t)
	defer teardownTestDB()

	userId, err := AddUser("testuser")
	if err != nil {
		t.Fatalf("Error adding user: %v", err)
	}

	accountId, err := AddAccount(userId, "testaccount", "testholder")
	if err != nil {
		t.Fatalf("Error adding account: %v", err)
	}

	err = UpdateCash(accountId, 100.0, "USD")
	if err != nil {
		t.Fatalf("Error updating cash: %v", err)
	}
}

func TestUpdateInvestment(t *testing.T) {
	setupTestDB(t)
	defer teardownTestDB()

	userId, err := AddUser("testuser")
	if err != nil {
		t.Fatalf("Error adding user: %v", err)
	}

	accountId, err := AddAccount(userId, "testaccount", "testholder")
	if err != nil {
		t.Fatalf("Error adding account: %v", err)
	}

	investments := []*Investment{
		{AccountId: accountId, Name: "testinvestment", Category: "testcategory", Amount: 100.0, Currency: "USD"},
	}

	err = UpdateInvestment(investments)
	if err != nil {
		t.Fatalf("Error updating investment: %v", err)
	}
}

func TestDeleteInvestment(t *testing.T) {
	setupTestDB(t)
	defer teardownTestDB()

	userId, err := AddUser("testuser")
	if err != nil {
		t.Fatalf("Error adding user: %v", err)
	}

	accountId, err := AddAccount(userId, "testaccount", "testholder")
	if err != nil {
		t.Fatalf("Error adding account: %v", err)
	}

	investments := []*Investment{
		{AccountId: accountId, Name: "testinvestment", Category: "testcategory", Amount: 100.0, Currency: "USD"},
	}

	err = UpdateInvestment(investments)
	if err != nil {
		t.Fatalf("Error updating investment: %v", err)
	}

	err = DeleteInvestment(investments[0].Id)
	if err != nil {
		t.Fatalf("Error deleting investment: %v", err)
	}
}

func TestGetAccountDetails(t *testing.T) {
	setupTestDB(t)
	defer teardownTestDB()

	userId, err := AddUser("testuser")
	if err != nil {
		t.Fatalf("Error adding user: %v", err)
	}

	accountId, err := AddAccount(userId, "testaccount", "testholder")
	if err != nil {
		t.Fatalf("Error adding account: %v", err)
	}

	err = UpdateCash(accountId, 100.0, "USD")
	if err != nil {
		t.Fatalf("Error updating cash: %v", err)
	}

	investments := []*Investment{
		{AccountId: accountId, Name: "testinvestment", Category: "testcategory", Amount: 100.0, Currency: "USD"},
	}

	err = UpdateInvestment(investments)
	if err != nil {
		t.Fatalf("Error updating investment: %v", err)
	}

	accounts, err := GetAccountDetails(userId)
	if err != nil {
		t.Fatalf("Error getting account details: %v", err)
	}

	if len(accounts) == 0 {
		t.Fatalf("Expected non-zero accounts")
	}
}

func TestGetCategories(t *testing.T) {
	setupTestDB(t)
	defer teardownTestDB()

	userId, err := AddUser("testuser")
	if err != nil {
		t.Fatalf("Error adding user: %v", err)
	}

	err = AddCategory(userId, "testcategory")
	if err != nil {
		t.Fatalf("Error adding category: %v", err)
	}

	categories, err := GetCategories(userId)
	if err != nil {
		t.Fatalf("Error getting categories: %v", err)
	}

	if len(categories) == 0 {
		t.Fatalf("Expected non-zero categories")
	}
}

func TestAddCategory(t *testing.T) {
	setupTestDB(t)
	defer teardownTestDB()

	userId, err := AddUser("testuser")
	if err != nil {
		t.Fatalf("Error adding user: %v", err)
	}

	err = AddCategory(userId, "testcategory")
	if err != nil {
		t.Fatalf("Error adding category: %v", err)
	}
}
