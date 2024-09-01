package app

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type ExchangeRates map[string]float64

func GetExchangeRates(baseCurrency string, targetCurrencies []string) (ExchangeRates, error) {
	url := fmt.Sprintf("https://api.exchangerate-api.com/v4/latest/%s", baseCurrency)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var data map[string]interface{}
	err = json.Unmarshal(body, &data)
	if err != nil {
		return nil, err
	}

	rates := data["rates"].(map[string]interface{})

	exchangeRates := make(map[string]float64)
	for _, currency := range targetCurrencies {
		rate := rates[currency].(float64)
		exchangeRates[currency] = rate
	}

	return exchangeRates, nil
}
