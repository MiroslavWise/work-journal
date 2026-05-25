package server

import (
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"

	"work-journal/backend/internal/handler"
)

func NewMux(pool *pgxpool.Pool) *http.ServeMux {
	mux := http.NewServeMux()
	handler.New(pool).RegisterRoutes(mux)
	return mux
}
