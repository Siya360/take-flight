package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/labstack/echo/v4"
)

type healthResponse struct {
	Status string `json:"status"`
}

type tokenResponse struct {
	AccessToken string `json:"access_token"`
}

func main() {
	e := echo.New()
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
	})

	e.GET("/flights/search", handleFlightSearch)

	if err := e.Start(":8080"); err != nil {
		log.Fatalf("server error: %v", err)
	}
}

func handleFlightSearch(c echo.Context) error {
	origin := c.QueryParam("origin")
	destination := c.QueryParam("destination")
	departure := c.QueryParam("departureDate")
	if origin == "" || destination == "" || departure == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "missing params"})
	}

	clientID := os.Getenv("AMADEUS_CLIENT_ID")
	clientSecret := os.Getenv("AMADEUS_CLIENT_SECRET")
	if clientID == "" || clientSecret == "" {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "missing Amadeus credentials"})
	}

	token, err := getToken(clientID, clientSecret)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	data, err := searchFlights(token, origin, destination, departure)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	var parsed interface{}
	if err := json.Unmarshal(data, &parsed); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, parsed)
}

func getToken(id, secret string) (string, error) {
	form := url.Values{}
	form.Set("grant_type", "client_credentials")
	form.Set("client_id", id)
	form.Set("client_secret", secret)

	req, err := http.NewRequest(http.MethodPost, "https://test.api.amadeus.com/v1/security/oauth2/token", strings.NewReader(form.Encode()))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		b, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("token request failed: %s", b)
	}

	var tr tokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&tr); err != nil {
		return "", err
	}
	return tr.AccessToken, nil
}

func searchFlights(token, origin, dest, date string) ([]byte, error) {
	endpoint := fmt.Sprintf("https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=%s&destinationLocationCode=%s&departureDate=%s&adults=1", url.QueryEscape(origin), url.QueryEscape(dest), url.QueryEscape(date))
	req, err := http.NewRequest(http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		b, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("flight search failed: %s", b)
	}
	return io.ReadAll(resp.Body)
}
