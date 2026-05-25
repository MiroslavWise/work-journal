package main

import (
	"context"
	"log"
	"os"
	"path/filepath"

	"github.com/jackc/pgx/v5/pgxpool"

	"work-journal/backend/internal/config"
)

func main() {
	config.LoadEnv()

	ctx := context.Background()

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = os.Getenv("POSTGRES_URL")
	}
	if dsn == "" {
		log.Fatal("DATABASE_URL or POSTGRES_URL is not set")
	}

	pool, err := pgxpool.New(ctx, dsn)
	if err != nil {
		log.Fatalf("connect: %v", err)
	}
	defer pool.Close()

	sqlPath := filepath.Join("migrations", "001_journal_entries.sql")
	if len(os.Args) > 1 {
		sqlPath = os.Args[1]
	}

	sql, err := os.ReadFile(sqlPath)
	if err != nil {
		log.Fatalf("read migration: %v", err)
	}

	if _, err := pool.Exec(ctx, string(sql)); err != nil {
		log.Fatalf("apply migration: %v", err)
	}

	log.Printf("migration applied: %s", sqlPath)
}
