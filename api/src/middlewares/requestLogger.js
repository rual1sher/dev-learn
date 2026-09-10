const { NODE_ENV } = require('../config/env');

/**
 * Middleware для информативного логирования HTTP-запросов
 */
function requestLogger(req, res, next) {
  if (NODE_ENV === 'test') {
    return next();
  }

  const start = Date.now();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;

    // Цветовая подсветка статуса для терминала
    let statusColor = '\x1b[32m'; // Зеленый для 2xx
    if (statusCode >= 400 && statusCode < 500) {
      statusColor = '\x1b[33m'; // Желтый для 4xx
    } else if (statusCode >= 500) {
      statusColor = '\x1b[31m'; // Красный для 5xx
    }
    const reset = '\x1b[0m';

    console.log(
      `[${new Date().toLocaleTimeString()}] ${method} ${originalUrl} ${statusColor}${statusCode}${reset} - ${duration}ms`
    );
  });

  next();
}

module.exports = requestLogger;
