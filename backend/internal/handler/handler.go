package handler

import (
	"github.com/jackc/pgx/v5/pgxpool"

	"work-journal/backend/internal/repository"
)

type Handler struct {
	journal *repository.JournalRepository
}

func New(pool *pgxpool.Pool) *Handler {
	return &Handler{
		journal: repository.NewJournalRepository(pool),
	}
}
