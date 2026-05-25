package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"work-journal/backend/internal/config"
	"work-journal/backend/internal/db"
	"work-journal/backend/internal/server"
)

func main() {
	config.LoadEnv()

	ctx := context.Background()

	pool, err := db.Connect(ctx)
	if err != nil {
		log.Fatalf("database: %v", err)
	}
	defer pool.Close()

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, server.NewMux(pool)))
}
