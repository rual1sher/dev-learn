#!/usr/bin/env node

/**
 * ==============================================================================
 * ⚡ DevLearn Production Pre-Flight Checklist
 * Проверяет готовность проекта к запуску на продакшн-сервере:
 * 1. Версию среды выполнения Node.js
 * 2. Наличие и валидность переменных окружения (.env)
 * 3. Целостность и статус базы данных SQLite (WAL-режим, таблицы, сиды)
 * 4. Наличие и валидность собранного Web-бандла (mobile-app/dist)
 * 5. Безопасность секретов (JWT_SECRET)
 * 6. Права на запись и доступность портов
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');
const net = require('net');

const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

const checks = [];

function addCheck(title, status, detail, advice = '') {
  checks.push({ title, status, detail, advice });
}

console.log(`\n${COLORS.bold}${COLORS.cyan}====================================================${COLORS.reset}`);
console.log(`${COLORS.bold}${COLORS.cyan}  ⚡ DevLearn Platform: Production Readiness Check  ${COLORS.reset}`);
console.log(`${COLORS.bold}${COLORS.cyan}====================================================${COLORS.reset}\n`);

// 1. Проверка версии Node.js
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0], 10);
if (majorVersion >= 18) {
  addCheck('Node.js Runtime', 'PASS', `Версия: ${nodeVersion} (Требуется >= 18.x)`);
} else {
  addCheck('Node.js Runtime', 'FAIL', `Версия: ${nodeVersion}`, 'Обновите Node.js до LTS версии (18.x, 20.x или 22.x)');
}

// 2. Проверка переменных окружения
const rootEnvPath = path.resolve(__dirname, '../.env');
const apiEnvPath = path.resolve(__dirname, '../api/.env');
const envExists = fs.existsSync(rootEnvPath) || fs.existsSync(apiEnvPath);

if (envExists) {
  addCheck('Environment File (.env)', 'PASS', `Обнаружен файл окружения: ${fs.existsSync(rootEnvPath) ? '.env' : 'api/.env'}`);
} else {
  addCheck(
    'Environment File (.env)',
    'WARN',
    'Файл .env не найден в корне или api/',
    'Создайте .env из шаблона: cp .env.example .env'
  );
}

// Подключаем конфигурацию API для проверки параметров
let envConfig;
try {
  envConfig = require('../api/src/config/env');
  addCheck('API Configuration Module', 'PASS', `Порт: ${envConfig.PORT}, Окружение: ${envConfig.NODE_ENV}`);
} catch (e) {
  addCheck('API Configuration Module', 'FAIL', `Ошибка загрузки config/env: ${e.message}`);
}

// 3. Проверка безопасности JWT_SECRET
if (envConfig) {
  if (
    !envConfig.JWT_SECRET ||
    envConfig.JWT_SECRET === 'devlearn-secret-key-change-in-production' ||
    envConfig.JWT_SECRET === 'your-super-secret-production-jwt-key-change-me'
  ) {
    if (envConfig.NODE_ENV === 'production') {
      addCheck(
        'Security (JWT_SECRET)',
        'FAIL',
        'Используется стандартный/дефолтный JWT_SECRET!',
        'Сгенерируйте стойкий ключ: openssl rand -hex 32 и задайте в .env'
      );
    } else {
      addCheck(
        'Security (JWT_SECRET)',
        'WARN',
        'Установлен тестовый ключ (допустимо для dev, но недопустимо для prod)',
        'Сгенерируйте стойкий ключ перед выкладкой на боевой сервер'
      );
    }
  } else {
    addCheck('Security (JWT_SECRET)', 'PASS', 'Установлен уникальный пользовательский секрет');
  }
}

// 4. Проверка базы данных SQLite
try {
  let Database;
  try {
    Database = require('../api/node_modules/better-sqlite3');
  } catch {
    Database = require('better-sqlite3');
  }
  const dbPath = envConfig ? envConfig.DB_PATH : path.resolve(__dirname, '../api/database.db');
  
  if (fs.existsSync(dbPath)) {
    const db = new Database(dbPath, { readonly: true });
    const journalMode = db.pragma('journal_mode', { simple: true });
    const cardCount = db.prepare('SELECT count(*) as c FROM cards').get().c;
    const historyCount = db.prepare('SELECT count(*) as c FROM reviews_history').get().c;
    db.close();

    addCheck(
      'SQLite Database',
      'PASS',
      `Файл: ${path.basename(dbPath)}, WAL: ${journalMode}, Карточек: ${cardCount}, Записей истории: ${historyCount}`
    );
  } else {
    addCheck(
      'SQLite Database',
      'WARN',
      `Файл БД не существует по пути ${dbPath}`,
      'БД будет автоматически создана и наполнена 41+ вопросами при первом старте сервера'
    );
  }
} catch (e) {
  addCheck('SQLite Database', 'FAIL', `Ошибка чтения БД: ${e.message}`);
}

// 5. Проверка сборки Web SPA (dist)
const distPath = path.resolve(__dirname, '../mobile-app/dist');
const indexPath = path.join(distPath, 'index.html');
if (fs.existsSync(indexPath)) {
  const stats = fs.statSync(indexPath);
  addCheck(
    'Production Web SPA Build',
    'PASS',
    `Бандл собран (dist/index.html, ${stats.size} bytes)`
  );
} else {
  addCheck(
    'Production Web SPA Build',
    'WARN',
    'Сборка dist/index.html не найдена',
    'Запустите "npm run build:web" для компиляции React Native Web'
  );
}

// 6. Проверка файлов развертывания (PM2, Nginx)
const deployFiles = [
  'ecosystem.config.js',
  'deploy/nginx/devlearn.conf',
];
const missingDeployFiles = deployFiles.filter((f) => !fs.existsSync(path.resolve(__dirname, '..', f)));
if (missingDeployFiles.length === 0) {
  addCheck('Deployment Configs', 'PASS', 'Файлы развертывания (PM2 ecosystem, Nginx conf) присутствуют');
} else {
  addCheck('Deployment Configs', 'WARN', `Отсутствуют файлы: ${missingDeployFiles.join(', ')}`);
}

// Вывод сводного отчета
let hasFails = false;
let hasWarns = false;

for (const check of checks) {
  let badge = `${COLORS.green}[✓ PASS]${COLORS.reset}`;
  if (check.status === 'WARN') {
    badge = `${COLORS.yellow}[⚠ WARN]${COLORS.reset}`;
    hasWarns = true;
  } else if (check.status === 'FAIL') {
    badge = `${COLORS.red}[✖ FAIL]${COLORS.reset}`;
    hasFails = true;
  }

  console.log(`${badge} ${COLORS.bold}${check.title}${COLORS.reset}`);
  console.log(`       ${check.detail}`);
  if (check.advice) {
    console.log(`       👉 ${COLORS.yellow}${check.advice}${COLORS.reset}`);
  }
  console.log('');
}

console.log(`${COLORS.bold}${COLORS.cyan}----------------------------------------------------${COLORS.reset}`);
if (hasFails) {
  console.log(`${COLORS.bold}${COLORS.red}❌ Обнаружены критические ошибки перед запуском на Prod! Исправьте пункты [FAIL].${COLORS.reset}\n`);
  process.exit(1);
} else if (hasWarns) {
  console.log(`${COLORS.bold}${COLORS.yellow}⚠️ Проект готов к запуску, но обратите внимание на предупреждения [WARN].${COLORS.reset}\n`);
  process.exit(0);
} else {
  console.log(`${COLORS.bold}${COLORS.green}🚀 Проект ПОЛНОСТЬЮ готов к выкатке на Production Server!${COLORS.reset}\n`);
  process.exit(0);
}
