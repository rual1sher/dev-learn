const CardsService = require('../services/cardsService');

/**
 * Контроллер для работы с карточками вопросов
 */
class CardsController {
  /**
   * GET /api/cards
   * Получение списка карточек (с опциональной фильтрацией по категории)
   */
  static getCards(req, res, next) {
    try {
      const { category, limit, dueOnly } = req.query;
      const cards = CardsService.getCards({
        category,
        limit,
        dueOnly: dueOnly === 'true' || dueOnly === '1',
      });
      return res.json(cards);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * GET /api/cards/:id
   * Получение одной карточки по ID
   */
  static getCardById(req, res, next) {
    try {
      const { id } = req.params;
      const card = CardsService.getCardById(id);

      if (!card) {
        return res.status(404).json({ error: 'Карточка не найдена' });
      }

      return res.json(card);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * POST /api/cards/:id/answer
   * Зафиксировать ответ пользователя
   */
  static answerCard(req, res, next) {
    try {
      const { id } = req.params;
      const { choice } = req.body;

      if (choice === undefined || choice === null) {
        return res.status(400).json({ error: 'Поле choice обязательно (1 или 0)' });
      }

      const result = CardsService.answerCard(id, choice);

      if (!result) {
        return res.status(404).json({ error: 'Карточка не найдена' });
      }

      return res.json(result);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * GET /api/cards/stats
   * Получение статистики обучения и интервального повторения
   */
  static getStats(req, res, next) {
    try {
      const stats = CardsService.getStats();
      return res.json(stats);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = CardsController;
