package main

import (
	"context"
	"fmt"
	"log"
	"math/rand/v2"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"

	"work-journal/backend/internal/config"
)

var workTypes = []struct {
	name string
	unit string
	min  float64
	max  float64
}{
	{"Кладка перегородок", "м³", 8, 45},
	{"Монтаж опалубки", "м²", 40, 320},
	{"Армирование фундамента", "т", 2, 18},
	{"Бетонирование плиты", "м³", 12, 85},
	{"Штукатурка стен", "м²", 25, 180},
	{"Устройство стяжки", "м²", 30, 250},
	{"Монтаж металлоконструкций", "т", 1.5, 12},
	{"Гидроизоляция фундамента", "м²", 20, 140},
	{"Укладка керамогранита", "м²", 15, 120},
	{"Монтаж оконных блоков", "шт", 4, 28},
}

var performers = []string{
	"Иванов Иван Иванович",
	"Петров Петр Петрович",
	"Сидоров Сидор Сидорович",
	"Кузнецов Алексей Николаевич",
	"Смирнова Ольга Владимировна",
	"Попов Дмитрий Сергеевич",
	"Васильев Андрей Михайлович",
	"Морозова Елена Александровна",
	"Новиков Сергей Викторович",
	"Фёдорова Мария Игоревна",
	"Соколов Никита Павлович",
	"Лебедева Анна Дмитриевна",
}

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

	count := 50
	if len(os.Args) > 1 {
		if _, err := fmt.Sscanf(os.Args[1], "%d", &count); err != nil || count < 1 {
			log.Fatalf("invalid count: %s", os.Args[1])
		}
	}

	startDate := time.Date(2026, 1, 1, 0, 0, 0, 0, time.UTC)
	batch := make([][]any, 0, count)

	for i := range count {
		work := workTypes[i%len(workTypes)]
		volume := work.min + rand.Float64()*(work.max-work.min)
		date := startDate.AddDate(0, 0, i*2+rand.IntN(3))

		batch = append(batch, []any{
			date.Format("2006-01-02"),
			work.name,
			round(volume, 2),
			work.unit,
			performers[i%len(performers)],
		})
	}

	tx, err := pool.Begin(ctx)
	if err != nil {
		log.Fatalf("begin tx: %v", err)
	}
	defer tx.Rollback(ctx)

	for _, row := range batch {
		if _, err := tx.Exec(ctx, `
			INSERT INTO journal_entries (completion_date, work_type, volume, unit, performer_name)
			VALUES ($1::date, $2, $3, $4, $5)
		`, row...); err != nil {
			log.Fatalf("insert row: %v", err)
		}
	}

	if err := tx.Commit(ctx); err != nil {
		log.Fatalf("commit: %v", err)
	}

	log.Printf("inserted %d mock journal entries", count)
}

func round(value float64, precision int) float64 {
	p := float64(1)
	for range precision {
		p *= 10
	}
	return float64(int(value*p+0.5)) / p
}
