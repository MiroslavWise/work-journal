CREATE TABLE IF NOT EXISTS journal_entries (
    id BIGSERIAL PRIMARY KEY,
    completion_date DATE NOT NULL,
    work_type TEXT NOT NULL,
    volume NUMERIC(12, 2) NOT NULL CHECK (volume >= 0),
    unit VARCHAR(32) NOT NULL,
    performer_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_journal_entries_completion_date
    ON journal_entries (completion_date DESC, id DESC);
