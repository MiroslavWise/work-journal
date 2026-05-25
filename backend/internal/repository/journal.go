package repository

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"work-journal/backend/internal/model"
)

const journalPageSize = 20

var (
	ErrNotFound        = errors.New("journal entry not found")
	ErrNothingToUpdate = errors.New("nothing to update")
)

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
		ORDER BY id DESC
		LIMIT $1 OFFSET $2
	`, limit, offset)
	if err != nil {
		return model.JournalEntriesPage{}, fmt.Errorf("list journal entries: %w", err)
	}
	defer rows.Close()

	items := make([]model.JournalEntry, 0)
	for rows.Next() {
		entry, err := scanJournalEntry(rows)
		if err != nil {
			return model.JournalEntriesPage{}, err
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

func (r *JournalRepository) Create(ctx context.Context, input model.CreateJournalEntryInput) (model.JournalEntry, error) {
	row := r.pool.QueryRow(ctx, `
		INSERT INTO journal_entries (completion_date, work_type, volume, unit, performer_name)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, completion_date, work_type, volume, unit, performer_name, created_at
	`, input.CompletionDate, input.WorkType, input.Volume, input.Unit, input.PerformerName)

	entry, err := scanJournalEntry(row)
	if err != nil {
		return model.JournalEntry{}, fmt.Errorf("create journal entry: %w", err)
	}

	return entry, nil
}

func (r *JournalRepository) Update(ctx context.Context, id int64, input model.UpdateJournalEntryInput) (model.JournalEntry, error) {
	setParts := make([]string, 0, 5)
	args := make([]any, 0, 6)
	argIndex := 1

	if input.CompletionDate != nil {
		setParts = append(setParts, fmt.Sprintf("completion_date = $%d", argIndex))
		args = append(args, *input.CompletionDate)
		argIndex++
	}
	if input.WorkType != nil {
		setParts = append(setParts, fmt.Sprintf("work_type = $%d", argIndex))
		args = append(args, *input.WorkType)
		argIndex++
	}
	if input.Volume != nil {
		setParts = append(setParts, fmt.Sprintf("volume = $%d", argIndex))
		args = append(args, *input.Volume)
		argIndex++
	}
	if input.Unit != nil {
		setParts = append(setParts, fmt.Sprintf("unit = $%d", argIndex))
		args = append(args, *input.Unit)
		argIndex++
	}
	if input.PerformerName != nil {
		setParts = append(setParts, fmt.Sprintf("performer_name = $%d", argIndex))
		args = append(args, *input.PerformerName)
		argIndex++
	}

	if len(setParts) == 0 {
		return model.JournalEntry{}, ErrNothingToUpdate
	}

	args = append(args, id)
	query := fmt.Sprintf(`
		UPDATE journal_entries
		SET %s
		WHERE id = $%d
		RETURNING id, completion_date, work_type, volume, unit, performer_name, created_at
	`, strings.Join(setParts, ", "), argIndex)

	row := r.pool.QueryRow(ctx, query, args...)
	entry, err := scanJournalEntry(row)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return model.JournalEntry{}, ErrNotFound
		}
		return model.JournalEntry{}, fmt.Errorf("update journal entry: %w", err)
	}

	return entry, nil
}

func (r *JournalRepository) Delete(ctx context.Context, id int64) error {
	tag, err := r.pool.Exec(ctx, `DELETE FROM journal_entries WHERE id = $1`, id)
	if err != nil {
		return fmt.Errorf("delete journal entry: %w", err)
	}

	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}

	return nil
}

type scannable interface {
	Scan(dest ...any) error
}

func scanJournalEntry(row scannable) (model.JournalEntry, error) {
	var entry model.JournalEntry
	if err := row.Scan(
		&entry.ID,
		&entry.CompletionDate,
		&entry.WorkType,
		&entry.Volume,
		&entry.Unit,
		&entry.PerformerName,
		&entry.CreatedAt,
	); err != nil {
		return model.JournalEntry{}, fmt.Errorf("scan journal entry: %w", err)
	}

	return entry, nil
}
