package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
)

func (h *Handler) JournalEntries(w http.ResponseWriter, r *http.Request) {
	page, err := strconv.Atoi(r.URL.Query().Get("page"))
	if err != nil || page < 1 {
		page = 1
	}

	result, err := h.journal.List(r.Context(), page)
	if err != nil {
		http.Error(w, "failed to load journal entries", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(result)
}
