package handler

import "net/http"

func (h *Handler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /health", Health)
	mux.HandleFunc("GET /journal-entries", h.JournalEntries)
}
