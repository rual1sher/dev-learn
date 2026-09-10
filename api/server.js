const app = require('./src/app');
const { PORT, HOST, NODE_ENV, JWT_SECRET, SERVE_STATIC, STATIC_PATH } = require('./src/config/env');
const { initDatabase, closeDatabase } = require('./src/config/database');
const fs = require('fs');
const path = require('path');

// 0. Предупреждение о дефолтных секретах в Production
if (NODE_ENV === 'production' && JWT_SECRET === 'devlearn-secret-key-change-in-production') {
  console.warn('⚠️ [SECURITY WARNING]: В production используется дефолтный JWT_SECRET! Задайте стойкий JWT_SECRET в .env.');
}

// 1. Инициализация базы данных и сидинга
initDatabase();

// 2. Запуск HTTP-сервера
const server = app.listen(PORT, HOST, () => {
  const hasStatic = SERVE_STATIC && fs.existsSync(STATIC_PATH) && fs.existsSync(path.join(STATIC_PATH, 'index.html'));
  console.log(`⚡ DevLearn Platform [${NODE_ENV.toUpperCase()}] running on http://${HOST}:${PORT}`);
  console.log(`📚 API эндпоинты: http://${HOST}:${PORT}/api/cards`);
  console.log(`🩺 Healthcheck: http://${HOST}:${PORT}/api/health`);
  if (hasStatic) {
    console.log(`🌐 Web SPA клиент активен и раздается из: ${STATIC_PATH}`);
  } else {
    console.log(`ℹ️ Web SPA не найден по пути ${STATIC_PATH} (запустите npm run build:web для генерации).`);
  }
});

// 3. Обработка Graceful Shutdown (корректное завершение процесса)
let isShuttingDown = false;
function handleShutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`\n🛑 Получен сигнал ${signal}. Завершение работы сервера...`);
  
  server.close(() => {
    console.log('🔌 HTTP-сервер остановлен.');
    closeDatabase();
    process.exit(0);
  });

  // Принудительное завершение через 5 секунд, если соединения зависли
  setTimeout(() => {
    console.error('⚠️ Принудительное завершение по таймауту.');
    process.exit(1);
  }, 5000).unref();
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

// Обработка критических ошибок Node.js процесса во избежание падения без логов
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 [Unhandled Rejection]:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('💥 [Uncaught Exception]:', err);
  handleShutdown('uncaughtException');
});

module.exports = server;
