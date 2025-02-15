// cmd/api/main.go

package main

import (
	"flag"
	"log"
	"os"
)

func main() {
	// Define command line flags
	configPath := flag.String("config", "configs/app.yaml", "path to configuration file")
	flag.Parse()

	// Set up logging
	log.SetOutput(os.Stdout)
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)

	// Create and start application
	app, err := NewApplication(*configPath)
	if err != nil {
		log.Fatalf("Failed to initialize application: %v", err)
	}

	// Start the application
	if err := app.Start(); err != nil {
		log.Fatalf("Application error: %v", err)
	}
}
