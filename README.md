# Work Journal

Веб-приложение для ведения журнала работ: React-фронтенд и Go-бэкенд с PostgreSQL (Neon).

## Стек

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Go, `net/http`
- **БД:** PostgreSQL (Neon)
- **Деплой:** Vercel (frontend на `/`, backend на `/api`)

## Требования

- [Go](https://go.dev/dl/) 1.25+
- [Node.js](https://nodejs.org/) 20+
- PostgreSQL (локально или Neon)

## Настройка окружения

1. Клонируйте репозиторий.
2. Создайте файл `.env` в корне проекта:

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

Можно также использовать переменную `POSTGRES_URL` — она подхватывается на Vercel автоматически.

## База данных

Применить миграцию:

```powershell
cd backend
go run ./cmd/migrate
```

Заполнить тестовыми данными (опционально):

```powershell
cd backend
go run ./cmd/seed
go run ./cmd/seed 100   # указать своё количество записей
```

## Локальный запуск

### Backend

```powershell
cd backend
go run .
```

Сервер стартует на `http://127.0.0.1:3000` (или на порту из переменной `PORT`).

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Фронтенд доступен на `http://127.0.0.1:5173`. Запросы к `/api/*` проксируются на backend (см. `frontend/vite.config.ts`).

## API

Локально через Vite-прокси все эндпоинты доступны с префиксом `/api`.  
Напрямую к backend — без префикса.

| Метод | Путь | Описание |
|-------|------|----------|
| `GET` | `/health` | Проверка работоспособности сервера |
| `GET` | `/journal-entries?page=1` | Список записей с пагинацией (20 на страницу) |
| `POST` | `/journal-entries` | Создание записи |
| `PATCH` | `/journal-entries/{id}` | Частичное обновление записи |

### GET /journal-entries

**Query-параметры:**

- `page` — номер страницы (по умолчанию `1`). `offset` и `limit` вычисляются на backend.

**Пример ответа:**

```json
{
  "items": [
    {
      "id": 1,
      "completion_date": "2026-05-20T00:00:00Z",
      "work_type": "Кладка перегородок",
      "volume": 24,
      "unit": "м³",
      "performer_name": "Иванов Иван Иванович",
      "created_at": "2026-05-25T20:00:00Z"
    }
  ],
  "page": 1,
  "page_size": 20,
  "total": 50,
  "total_pages": 3
}
```

### POST /journal-entries

Все поля обязательны.

**Тело запроса:**

```json
{
  "completion_date": "2026-05-20",
  "work_type": "Кладка перегородок",
  "volume": 24,
  "unit": "м³",
  "performer_name": "Иванов Иван Иванович"
}
```

**Ответ:** `201 Created` — созданная запись.

### PATCH /journal-entries/{id}

Все поля необязательны — обновляются только переданные.

**Тело запроса (пример):**

```json
{
  "volume": 30.5,
  "performer_name": "Петров Петр Петрович"
}
```

**Ответ:** `200 OK` — обновлённая запись.

**Ошибки:**

- `400` — невалидные данные или не передано ни одного поля
- `404` — запись не найдена

## Примеры запросов

Через frontend-прокси (dev-сервер на `:5173`):

```powershell
curl http://127.0.0.1:5173/api/health
curl "http://127.0.0.1:5173/api/journal-entries?page=1"
```

Напрямую к backend:

```powershell
curl -X POST http://127.0.0.1:3000/journal-entries `
  -H "Content-Type: application/json" `
  -d '{"completion_date":"2026-05-20","work_type":"Монтаж опалубки","volume":120.5,"unit":"м²","performer_name":"Петров Петр Петрович"}'

curl -X PATCH http://127.0.0.1:3000/journal-entries/1 `
  -H "Content-Type: application/json" `
  -d '{"volume":150}'
```

## Деплой на Vercel

1. Подключите Neon PostgreSQL через Vercel Marketplace.
2. Убедитесь, что в проекте заданы переменные `DATABASE_URL` или `POSTGRES_URL`.
3. Деплой из корня репозитория — конфигурация в `vercel.json`:
   - frontend → `/`
   - backend → `/api`

## Структура проекта

```
work-journal/
├── backend/
│   ├── main.go
│   ├── cmd/
│   │   ├── migrate/    # применение миграций
│   │   └── seed/       # тестовые данные
│   ├── migrations/
│   └── internal/
│       ├── handler/
│       ├── repository/
│       └── model/
├── frontend/
│   └── src/
├── vercel.json
└── .env
```
