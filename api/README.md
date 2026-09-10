# ⚡ DevLearn REST API & Spaced Repetition Backend

Модульный backend-сервис на **Node.js**, **Express.js 5** и **better-sqlite3 (SQLite)** с реализацией алгоритма интервального повторения **SuperMemo SM-2**.

---

## 🏛 Модульная архитектура (Modular Architecture)

Архитектура API разделена по слоям ответственности (Layered Architecture):

```
api/
├── database.db                   # Локальная SQLite база данных (WAL режим)
├── package.json
├── server.js                     # Точка входа (Bootstrap, HTTP listen, Graceful Shutdown)
└── src/
    ├── app.js                    # Конфигурация Express приложения (CORS, JSON, Middleware, Routes)
    ├── config/
    │   ├── env.js                # Переменные окружения и пути (PORT, DB_PATH, CORS_ORIGIN)
    │   └── database.js           # Подключение better-sqlite3, схема таблиц, WAL-режим и сидинг
    ├── constants/
    │   └── seedQuestions.js      # 41 вопрос Junior/Middle по 7 категориям
    ├── controllers/
    │   ├── cardsController.js    # Обработчики HTTP-запросов карточек
    │   └── healthController.js   # Обработчик проверки здоровья сервера (/api/health)
    ├── middlewares/
    │   ├── errorHandler.js       # 4-аргументный обработчик ошибок Express и 404 handler
    │   └── requestLogger.js      # Логирование запросов в терминал с временем ответа
    ├── routes/
    │   ├── index.js              # Главный агрегатор роутов (/api)
    │   ├── cardsRoutes.js        # Маршруты карточек (/api/cards)
    │   └── healthRoutes.js       # Маршруты мониторинга (/api/health)
    └── services/
        ├── cardsService.js       # Бизнес-логика карточек, транзакции, выборки и статистика
        └── sm2Service.js         # Алгоритм интервального повторения SuperMemo SM-2
```

---

## 🚀 Эндпоинты API

| Метод | URL | Описание |
|---|---|---|
| `GET` | `/` | Информация об API и список доступных маршрутов |
| `GET` | `/api/health` | Проверка состояния сервиса, аптайма и подключения к БД |
| `GET` | `/api/cards` | Получение списка карточек в случайном порядке |
| `GET` | `/api/cards?category=node` | Фильтрация по категории (`node`, `nest`, `express`, `react`, `nginx`, `linux`, `english`) |
| `GET` | `/api/cards/stats` | Статистика обучения (всего карточек, точность ответов %, распределение по темам) |
| `GET` | `/api/cards/:id` | Получение конкретной карточки по ID |
| `POST`| `/api/cards/:id/answer` | Отправка ответа (`{ choice: 1 }` или `0`) с пересчетом SM-2 |

### Пример тела ответа на `POST /api/cards/:id/answer`:
```json
{
  "isCorrect": true,
  "correctValue": true,
  "punchline": "✅ Правда! nextTick() выполняется раньше setImmediate...",
  "sm2": {
    "repetitions": 1,
    "interval": 1,
    "easeFactor": 2.6,
    "nextReviewAt": "2026-09-09T12:00:00.000Z"
  }
}
```

---

## 🛠 Запуск

```bash
# Из папки api:
npm run dev

# Из корня монорепозитория:
npm run dev:api
```
