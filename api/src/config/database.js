const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const { DB_PATH } = require('./env');
const { SEED_QUESTIONS } = require('../constants/seedQuestions');

let db = null;

/**
 * Получение инстанса базы данных SQLite (Singleton)
 */
function getDatabase() {
  if (!db) {
    // Гарантируем существование директории для БД (актуально для Docker-томов и прод-серверов)
    const dbDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    db = new Database(DB_PATH);
    // Включение Write-Ahead Logging (WAL) для высокой производительности и конкурентности
    db.pragma('journal_mode = WAL');
    // Таймаут ожидания освобождения блокировки SQLite (5000мс) во избежание ошибок SQLITE_BUSY при нагрузке
    db.pragma('busy_timeout = 5000');
    // Режим синхронизации NORMAL оптимален и безопасен в связке с WAL
    db.pragma('synchronous = NORMAL');
  }
  return db;
}

/**
 * Инициализация структуры таблиц и начального сидинга данных
 */
function initDatabase() {
  const database = getDatabase();

  // 1. Создание таблиц
  database.exec(`
    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL, -- 'react', 'node', 'nest', 'express', 'nginx', 'linux', 'english'
      statement TEXT NOT NULL,
      is_true INTEGER NOT NULL, -- 1 = Правда, 0 = Ложь
      punchline TEXT NOT NULL,
      interval INTEGER DEFAULT 0,
      repetitions INTEGER DEFAULT 0,
      ease_factor REAL DEFAULT 2.5,
      next_review_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      card_id INTEGER,
      was_correct INTEGER,
      reviewed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Проверка и добавление колонки ease_factor, если таблица уже существовала без неё
  const columns = database.prepare("PRAGMA table_info(cards)").all();
  const hasEaseFactor = columns.some((col) => col.name === 'ease_factor');
  if (!hasEaseFactor) {
    try {
      database.exec("ALTER TABLE cards ADD COLUMN ease_factor REAL DEFAULT 2.5");
    } catch (e) {
      // Игнорируем, если колонка уже создана
    }
  }

  // 2. Начальный сидинг базы данных (если таблица пустая)
  const cardCount = database.prepare('SELECT count(*) as c FROM cards').get();
  if (cardCount.c === 0) {
    console.log('🌱 Наполнение базы данных вопросами Junior/Middle...');
    const insert = database.prepare(`
      INSERT INTO cards (category, statement, is_true, punchline, interval, repetitions, ease_factor) 
      VALUES (?, ?, ?, ?, 0, 0, 2.5)
    `);

    const insertMany = database.transaction((questions) => {
      for (const q of questions) {
        insert.run(q.cat, q.s, q.t, q.p);
      }
    });

    insertMany(SEED_QUESTIONS);
    console.log(`✅ Успешно загружено ${SEED_QUESTIONS.length} вопросов в базу данных.`);
  }

  return database;
}

/**
 * Безопасное закрытие соединения с БД (для Graceful Shutdown)
 */
function closeDatabase() {
  if (db && db.open) {
    db.close();
    db = null;
    console.log('🔒 Соединение с SQLite БД закрыто.');
  }
}

module.exports = {
  getDatabase,
  initDatabase,
  closeDatabase,
  // Для обратной совместимости, если кто-то обратится напрямую
  get db() {
    return getDatabase();
  },
};
