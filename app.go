package main

import (
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
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) AddUser(userName string) (int64, error) {
	return AddUser(userName)
}

func (a *App) AddAccount(userId int64, accountName string, holderName string) (int64, error) {
	return AddAccount(userId, accountName, holderName)
}

func (a *App) UpdateCash(accountId int64, amount float64) error {
	return UpdateCash(accountId, amount)
}

func (a *App) UpdateInvestment(investments []*investment) error {
	return UpdateInvestment(investments)
}

func (a *App) DeleteInvestment(investmentId int64) error {
	return DeleteInvestment(investmentId)
}

func (a *App) FetchAccountDetails(accountId int64) ([]*account, error) {
	return GetAccountDetails(accountId)
}
