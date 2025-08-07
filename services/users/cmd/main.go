package main

import (
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

type healthResponse struct {
	Status string `json:"status"`
}

func main() {
	e := echo.New()
	e.GET("/health", func(c echo.Context) error {
		return c.JSON(http.StatusOK, healthResponse{Status: "ok"})
	})

	if err := e.Start(":8080"); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
