const { getDatabase } = require('../config/database');
const { calculateSM2 } = require('./sm2Service');

/**
 * Сервис работы с карточками вопросов и алгоритмом SM-2
 */
class CardsService {
  /**
   * Получить список карточек (с фильтрацией по категории и случайным порядком)
   */
  static getCards({ category, limit, dueOnly } = {}) {
    const db = getDatabase();
    let query = 'SELECT * FROM cards';
    const params = [];
    const whereConditions = [];

    if (category && category !== 'all') {
      whereConditions.push('category = ?');
      params.push(category);
    }

    if (dueOnly) {
      whereConditions.push("next_review_at <= datetime('now')");
    }

    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    query += ' ORDER BY RANDOM()';

    if (limit && Number.isInteger(Number(limit))) {
      query += ' LIMIT ?';
      params.push(Number(limit));
    }

    return db.prepare(query).all(...params);
  }

  /**
   * Получить одну карточку по ID
   */
  static getCardById(id) {
    const db = getDatabase();
    return db.prepare('SELECT * FROM cards WHERE id = ?').get(id);
  }

  /**
   * Зафиксировать ответ пользователя на карточку с применением SM-2
   */
  static answerCard(cardId, choice) {
    const db = getDatabase();
    const card = this.getCardById(cardId);

    if (!card) {
      return null;
    }

    const isCorrect = card.is_true === (choice ? 1 : 0);

    // 1. Расчет новых интервалов по алгоритму SuperMemo SM-2
    const sm2Result = calculateSM2({
      repetitions: card.repetitions || 0,
      interval: card.interval || 0,
      easeFactor: card.ease_factor || 2.5,
      isCorrect,
    });

    // 2. Транзакция: обновление карточки и запись в историю ревью
    const executeReview = db.transaction(() => {
      db.prepare(`
        INSERT INTO reviews_history (card_id, was_correct) 
        VALUES (?, ?)
      `).run(cardId, isCorrect ? 1 : 0);

      db.prepare(`
        UPDATE cards 
        SET interval = ?, 
            repetitions = ?, 
            ease_factor = ?, 
            next_review_at = ?
        WHERE id = ?
      `).run(
        sm2Result.interval,
        sm2Result.repetitions,
        sm2Result.easeFactor,
        sm2Result.nextReviewAt,
        cardId
      );
    });

    executeReview();

    return {
      isCorrect,
      correctValue: card.is_true === 1,
      punchline: card.punchline,
      sm2: sm2Result,
    };
  }

  /**
   * Статистика обучения и интервального повторения
   */
  static getStats() {
    const db = getDatabase();

    const totalCards = db.prepare('SELECT count(*) as count FROM cards').get().count;
    const totalReviews = db.prepare('SELECT count(*) as count FROM reviews_history').get().count;
    const correctReviews = db.prepare('SELECT count(*) as count FROM reviews_history WHERE was_correct = 1').get().count;
    
    const accuracy = totalReviews > 0 ? Math.round((correctReviews / totalReviews) * 100) : 0;

    const categories = db.prepare(`
      SELECT category, count(*) as count 
      FROM cards 
      GROUP BY category
    `).all();

    const dueCardsCount = db.prepare(`
      SELECT count(*) as count 
      FROM cards 
      WHERE next_review_at <= datetime('now')
    `).get().count;

    return {
      totalCards,
      totalReviews,
      correctReviews,
      accuracyPercentage: accuracy,
      dueCardsCount,
      categories,
    };
  }
}

module.exports = CardsService;
