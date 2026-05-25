# Work Journal

Веб-приложение для ведения журнала работ: React-фронтенд и Go-бэкенд с PostgreSQL (Neon).

# Страница запущенного проекта
[Сайт проекта](https://work-journal-tan.vercel.app/)

## Стек

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Go, `net/http`
- **БД:** PostgreSQL (Neon) - Легче всего на Vercel тестовый проект запустить, да и я практикуюсь, пока что, только на PostgreSQL
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