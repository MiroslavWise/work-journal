package main

import (
	"log"
	"net/http"
	"os"

	"work-journal/backend/internal/server"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, server.NewMux()))
}
