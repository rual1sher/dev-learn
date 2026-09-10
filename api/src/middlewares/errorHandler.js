const { NODE_ENV } = require('../config/env');

/**
 * Middleware для обработки запросов к несуществующим маршрутам (404)
 */
function notFoundHandler(req, res, next) {
  return res.status(404).json({
    error: 'Маршрут не найден',
    path: req.originalUrl,
    method: req.method,
  });
}

/**
 * Централизованный обработчик ошибок Express (строго 4 аргумента: err, req, res, next)
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.status || err.statusCode || 500;
  console.error(`❌ [API Error] ${req.method} ${req.originalUrl}:`, err);

  const response = {
    error: err.message || 'Внутренняя ошибка сервера',
    statusCode,
  };

  if (NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
