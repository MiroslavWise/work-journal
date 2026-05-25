package handler

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"
	"time"

	"work-journal/backend/internal/model"
	"work-journal/backend/internal/repository"
)

const dateLayout = "2006-01-02"

func (h *Handler) JournalEntries(w http.ResponseWriter, r *http.Request) {
	page, err := strconv.Atoi(r.URL.Query().Get("page"))
	if err != nil || page < 1 {
		page = 1
	}

	result, err := h.journal.List(r.Context(), page)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to load journal entries")
		return
	}

	writeJSON(w, http.StatusOK, result)
}

func (h *Handler) CreateJournalEntry(w http.ResponseWriter, r *http.Request) {
	var req model.CreateJournalEntryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body")
		return
	}

	completionDate, err := parseCompletionDate(req.CompletionDate)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	if strings.TrimSpace(req.WorkType) == "" {
		writeError(w, http.StatusBadRequest, "work_type is required")
		return
	}
	if strings.TrimSpace(req.Unit) == "" {
		writeError(w, http.StatusBadRequest, "unit is required")
		return
	}
	if strings.TrimSpace(req.PerformerName) == "" {
		writeError(w, http.StatusBadRequest, "performer_name is required")
		return
	}
	if req.Volume < 0 {
		writeError(w, http.StatusBadRequest, "volume must be greater than or equal to 0")
		return
	}

	entry, err := h.journal.Create(r.Context(), model.CreateJournalEntryInput{
		CompletionDate: completionDate,
		WorkType:       strings.TrimSpace(req.WorkType),
		Volume:         req.Volume,
		Unit:           strings.TrimSpace(req.Unit),
		PerformerName:  strings.TrimSpace(req.PerformerName),
	})
	if err != nil {
		writeError(w, http.StatusInternalServerError, "failed to create journal entry")
		return
	}

	writeJSON(w, http.StatusCreated, entry)
}

func (h *Handler) UpdateJournalEntry(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil || id < 1 {
		writeError(w, http.StatusBadRequest, "invalid id")
		return
	}

	var req model.UpdateJournalEntryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body")
		return
	}

	input, err := buildUpdateInput(req)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	entry, err := h.journal.Update(r.Context(), id, input)
	if err != nil {
		switch {
		case errors.Is(err, repository.ErrNothingToUpdate):
			writeError(w, http.StatusBadRequest, "at least one field must be provided")
		case errors.Is(err, repository.ErrNotFound):
			writeError(w, http.StatusNotFound, "journal entry not found")
		default:
			writeError(w, http.StatusInternalServerError, "failed to update journal entry")
		}
		return
	}

	writeJSON(w, http.StatusOK, entry)
}

func buildUpdateInput(req model.UpdateJournalEntryRequest) (model.UpdateJournalEntryInput, error) {
	input := model.UpdateJournalEntryInput{
		WorkType:      trimOptionalString(req.WorkType),
		Volume:        req.Volume,
		Unit:          trimOptionalString(req.Unit),
		PerformerName: trimOptionalString(req.PerformerName),
	}

	if req.CompletionDate != nil {
		completionDate, err := parseCompletionDate(*req.CompletionDate)
		if err != nil {
			return model.UpdateJournalEntryInput{}, err
		}
		input.CompletionDate = &completionDate
	}

	if req.Volume != nil && *req.Volume < 0 {
		return model.UpdateJournalEntryInput{}, errors.New("volume must be greater than or equal to 0")
	}

	if input.CompletionDate == nil &&
		input.WorkType == nil &&
		input.Volume == nil &&
		input.Unit == nil &&
		input.PerformerName == nil {
		return model.UpdateJournalEntryInput{}, repository.ErrNothingToUpdate
	}

	return input, nil
}

func parseCompletionDate(value string) (time.Time, error) {
	value = strings.TrimSpace(value)
	if value == "" {
		return time.Time{}, errors.New("completion_date is required")
	}

	date, err := time.Parse(dateLayout, value)
	if err != nil {
		return time.Time{}, errors.New("completion_date must be in YYYY-MM-DD format")
	}

	return date, nil
}

func trimOptionalString(value *string) *string {
	if value == nil {
		return nil
	}

	trimmed := strings.TrimSpace(*value)
	if trimmed == "" {
		return nil
	}

	return &trimmed
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}
