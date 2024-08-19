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

func (a *App) SaveAsset(amount float64) error {
	return StoreAsset(amount)
}

func (a *App) FetchLatestAsset() (float64, error) {
	return GetLatestAsset()
}
