const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Попытка загрузить .env сначала из корня репозитория, затем из папки api
const rootEnv = path.resolve(__dirname, '../../../.env');
const apiEnv = path.resolve(__dirname, '../../.env');

if (fs.existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv });
} else if (fs.existsSync(apiEnv)) {
  dotenv.config({ path: apiEnv });
} else {
  dotenv.config();
}

const PORT = parseInt(process.env.PORT, 10) || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';
const DB_PATH = process.env.DB_PATH || path.resolve(__dirname, '../../database.db');
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const JWT_SECRET = process.env.JWT_SECRET || 'devlearn-secret-key-change-in-production';

// Настройки безопасности и производительности для Production
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000; // 15 минут
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX, 10) || 300; // 300 запросов на окно
const TRUST_PROXY = process.env.TRUST_PROXY ? process.env.TRUST_PROXY === 'true' : NODE_ENV === 'production';

// Раздача собранного Web-клиента (mobile-app/dist)
const SERVE_STATIC = process.env.SERVE_STATIC !== 'false';
const STATIC_PATH = process.env.STATIC_PATH || path.resolve(__dirname, '../../../mobile-app/dist');

module.exports = {
  PORT,
  HOST,
  NODE_ENV,
  DB_PATH,
  CORS_ORIGIN,
  JWT_SECRET,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX,
  TRUST_PROXY,
  SERVE_STATIC,
  STATIC_PATH,
};
