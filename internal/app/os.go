package app

import (
	"encoding/csv"
	"fmt"
	"os"
	"strconv"
)

type InvestmentTrimmed struct {
	Category string  `json:"category"`
	Amount   float64 `json:"amount"`
	Currency string  `json:"currency"`
}

func SaveInvestmentStatistics(savePath string, investments []InvestmentTrimmed) error {
	totalAmount := 0.0
	for _, investment := range investments {
		totalAmount += investment.Amount
	}

	// Create the file
	file, err := os.Create(savePath)
	if err != nil {
		return err
	}
	defer file.Close()

	writer := csv.NewWriter(file)
	defer writer.Flush()

	header := []string{"Category", "Amount", "Currency", "Percentage"}
	if err := writer.Write(header); err != nil {
		return fmt.Errorf("failed to write header: %w", err)
	}

	for _, investment := range investments {
		percentage := (investment.Amount / totalAmount) * 100
		record := []string{
			investment.Category,
			strconv.FormatFloat(investment.Amount, 'f', 2, 64),
			investment.Currency,
			strconv.FormatFloat(percentage, 'f', 2, 64),
		}
		if err := writer.Write(record); err != nil {
			return fmt.Errorf("failed to write record: %w", err)
		}
	}

	return nil
}
