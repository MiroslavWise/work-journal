package handler

import "net/http"

func (h *Handler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /health", Health)
	mux.HandleFunc("GET /journal-entries", h.JournalEntries)
	mux.HandleFunc("POST /journal-entries", h.CreateJournalEntry)
	mux.HandleFunc("PATCH /journal-entries/{id}", h.UpdateJournalEntry)
	mux.HandleFunc("DELETE /journal-entries/{id}", h.DeleteJournalEntry)
}
