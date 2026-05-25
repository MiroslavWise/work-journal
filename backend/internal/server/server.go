package server

import (
	"net/http"

	"work-journal/backend/internal/handler"
)

func NewMux() *http.ServeMux {
	mux := http.NewServeMux()
	handler.RegisterRoutes(mux)
	return mux
}
