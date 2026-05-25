package model

import "time"

type JournalEntry struct {
	ID             int64     `json:"id"`
	CompletionDate time.Time `json:"completion_date"`
	WorkType       string    `json:"work_type"`
	Volume         float64   `json:"volume"`
	Unit           string    `json:"unit"`
	PerformerName  string    `json:"performer_name"`
	CreatedAt      time.Time `json:"created_at"`
}

type JournalEntriesPage struct {
	Items      []JournalEntry `json:"items"`
	Page       int            `json:"page"`
	PageSize   int            `json:"page_size"`
	Total      int64          `json:"total"`
	TotalPages int            `json:"total_pages"`
}

type CreateJournalEntryInput struct {
	CompletionDate time.Time
	WorkType       string
	Volume         float64
	Unit           string
	PerformerName  string
}

type UpdateJournalEntryInput struct {
	CompletionDate *time.Time
	WorkType       *string
	Volume         *float64
	Unit           *string
	PerformerName  *string
}

type CreateJournalEntryRequest struct {
	CompletionDate string  `json:"completion_date"`
	WorkType       string  `json:"work_type"`
	Volume         float64 `json:"volume"`
	Unit           string  `json:"unit"`
	PerformerName  string  `json:"performer_name"`
}

type UpdateJournalEntryRequest struct {
	CompletionDate *string  `json:"completion_date"`
	WorkType       *string  `json:"work_type"`
	Volume         *float64 `json:"volume"`
	Unit           *string  `json:"unit"`
	PerformerName  *string  `json:"performer_name"`
}
