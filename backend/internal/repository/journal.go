package repository

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"

	"work-journal/backend/internal/model"
)

const journalPageSize = 20

type JournalRepository struct {
	pool *pgxpool.Pool
}

func NewJournalRepository(pool *pgxpool.Pool) *JournalRepository {
	return &JournalRepository{pool: pool}
}

func (r *JournalRepository) List(ctx context.Context, page int) (model.JournalEntriesPage, error) {
	if page < 1 {
		page = 1
	}

	offset := (page - 1) * journalPageSize
	limit := journalPageSize

	var total int64
	if err := r.pool.QueryRow(ctx, `SELECT COUNT(*) FROM journal_entries`).Scan(&total); err != nil {
		return model.JournalEntriesPage{}, fmt.Errorf("count journal entries: %w", err)
	}

	totalPages := int(total) / journalPageSize
	if int(total)%journalPageSize != 0 {
		totalPages++
	}
	if totalPages == 0 {
		totalPages = 1
	}

	rows, err := r.pool.Query(ctx, `
		SELECT id, completion_date, work_type, volume, unit, performer_name, created_at
		FROM journal_entries
		ORDER BY completion_date DESC, id DESC
		LIMIT $1 OFFSET $2
	`, limit, offset)
	if err != nil {
		return model.JournalEntriesPage{}, fmt.Errorf("list journal entries: %w", err)
	}
	defer rows.Close()

	items := make([]model.JournalEntry, 0)
	for rows.Next() {
		var entry model.JournalEntry
		if err := rows.Scan(
			&entry.ID,
			&entry.CompletionDate,
			&entry.WorkType,
			&entry.Volume,
			&entry.Unit,
			&entry.PerformerName,
			&entry.CreatedAt,
		); err != nil {
			return model.JournalEntriesPage{}, fmt.Errorf("scan journal entry: %w", err)
		}
		items = append(items, entry)
	}

	if err := rows.Err(); err != nil {
		return model.JournalEntriesPage{}, fmt.Errorf("iterate journal entries: %w", err)
	}

	return model.JournalEntriesPage{
		Items:      items,
		Page:       page,
		PageSize:   journalPageSize,
		Total:      total,
		TotalPages: totalPages,
	}, nil
}
