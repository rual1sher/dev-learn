const { getDatabase } = require('../config/database');
const { NODE_ENV } = require('../config/env');

/**
 * Контроллер проверки статуса и здоровья сервера (Healthcheck)
 */
class HealthController {
  static getHealth(req, res) {
    try {
      const db = getDatabase();
      const cardCount = db.prepare('SELECT count(*) as count FROM cards').get().count;
      const memoryUsage = process.memoryUsage();

      return res.json({
        status: 'ok',
        service: 'dev-learn-api',
        environment: NODE_ENV,
        nodeVersion: process.version,
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        memory: {
          rssMb: Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100,
          heapUsedMb: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100,
          heapTotalMb: Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100,
        },
        database: {
          connected: true,
          type: 'sqlite3-wal',
          cardsCount: cardCount,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: 'error',
        service: 'dev-learn-api',
        error: err.message,
      });
    }
  }
}

module.exports = HealthController;
