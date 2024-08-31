package main

import (
	"HoGiahLang/internal/db"
	"context"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) AddUser(userName string) (int64, error) {
	return db.AddUser(userName)
}

func (a *App) AddAccount(userId int64, accountName string, holderName string) (int64, error) {
	return db.AddAccount(userId, accountName, holderName)
}

func (a *App) DeleteAccount(accountId int64) error {
	return db.DeleteAccount(accountId)
}

func (a *App) UpdateCash(accountId int64, amount float64, currency string) error {
	return db.UpdateCash(accountId, amount, currency)
}

func (a *App) UpdateInvestment(investments []*db.Investment) error {
	return db.UpdateInvestment(investments)
}

func (a *App) DeleteInvestment(investmentId int64) error {
	return db.DeleteInvestment(investmentId)
}

func (a *App) FetchAccountDetails(accountId int64) ([]*db.Account, error) {
	return db.GetAccountDetails(accountId)
}

func (a *App) FetchCategories(userId int64) (db.Categories, error) {
	return db.GetCategories(userId)
}

func (a *App) AddCategory(userId int64, category string) error {
	return db.AddCategory(userId, category)
}
