# 🚀 DevLearn Platform — Production Deployment Guide

Руководство по развертыванию платформы **DevLearn** на боевом production-сервере (Ubuntu 22.04 / 24.04, Debian или любой Linux VPS) без использования Docker.

---

## 📑 Содержание
1. [Архитектура продакшна](#-архитектура-продакшна)
2. [Подготовка сервера](#-подготовка-сервера)
3. [Настройка переменных окружения (.env)](#-настройка-переменных-окружения-env)
4. [Развертывание через PM2 + Nginx + SSL](#-развертывание-через-pm2--nginx--ssl)
5. [Резервное копирование базы данных SQLite](#-резервное-копирование-базы-данных-sqlite)
6. [Обновление проекта на продакшне](#-обновление-проекта-на-продакшне)
7. [Pre-Flight диагностика](#-pre-flight-диагностика)

---

## 🏛 Архитектура продакшна

В production-режиме приложение работает как самодостаточный сервис:
- **Node.js + Express 5** обслуживает REST API (`/api/*`), защищен `helmet`, сжимает ответы с помощью `compression`, и ограничивает запросы через `express-rate-limit`.
- **React Native Web SPA** компилируется в статический бандл (`mobile-app/dist`) и автоматически отдается сервером Express с клиентским SPA-роутингом.
- **SQLite Database** работает в режиме **WAL (Write-Ahead Logging)** с таймаутом `busy_timeout = 5000` и `synchronous = NORMAL`, обеспечивая максимальную скорость и защиту от блокировок.

```
                    [ Пользователи: Web & Mobile ]
                                  │
                                  ▼
                   [ Nginx Reverse Proxy (443 SSL) ]
                                  │
                                  ▼
                   [ DevLearn Platform (Порт 3001) ]
                  ┌───────────────┴───────────────┐
                  ▼                               ▼
       [ Web SPA (dist/) ]             [ REST API (/api/) ]
                  │                               │
                  └───────────────┬───────────────┘
                                  ▼
                      [ SQLite DB (WAL Mode) ]
```

---

## ⚙️ Подготовка сервера

### 1. Обновление пакетов и настройка файрвола (UFW)
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw

# Разрешаем SSH, HTTP и HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. Установка Node.js (v20 или v22 LTS)
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v # Должна быть v20+ или v22+
```

---

## 🔑 Настройка переменных окружения (.env)

Создайте файл `.env` в корне проекта на основе шаблона:
```bash
cp .env.example .env
nano .env
```

Сгенерируйте надежный криптографический ключ для `JWT_SECRET`:
```bash
openssl rand -hex 32
```

Пример настроенного боевого `.env`:
```env
NODE_ENV=production
PORT=3001
HOST=0.0.0.0
DB_PATH=./api/database.db
CORS_ORIGIN=*
JWT_SECRET=c382f718bc9a80e14a243058866e4a2a1908bfcf294156ce50a98f106ca46fbe
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=300
TRUST_PROXY=true
SERVE_STATIC=true
STATIC_PATH=./mobile-app/dist
```

---

## ⚡ Развертывание через PM2 + Nginx + SSL

Оптимально для максимальной производительности и стабильности на сервере.

### 1. Установка зависимостей и сборка Web-клиента
```bash
# Установка зависимостей в корне и во всех пакетах
npm run install:all

# Сборка статического веб-приложения в mobile-app/dist
npm run build:web
```

### 2. Запуск через PM2
```bash
sudo npm install -g pm2

# Запуск приложения через готовый конфиг
npm run pm2:start

# Сохранение автозапуска при перезагрузке ОС
pm2 save
pm2 startup
```

Команды управления PM2:
```bash
pm2 status               # Статус процесса
npm run pm2:logs         # Логи в реальном времени
pm2 reload devlearn-api  # Мягкий перезапуск (zero-downtime)
npm run pm2:stop         # Остановка
```

### 3. Настройка Nginx Reverse Proxy
```bash
sudo apt install -y nginx

# Копируем конфигурационный файл
sudo cp deploy/nginx/devlearn.conf /etc/nginx/sites-available/devlearn.conf

# Отредактируйте server_name (ваш домен):
sudo nano /etc/nginx/sites-available/devlearn.conf

# Активируем конфигурацию
sudo ln -s /etc/nginx/sites-available/devlearn.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Выпуск бесплатного SSL-сертификата (Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 💾 Резервное копирование базы данных SQLite

Так как SQLite работает в режиме WAL, копировать файл базы данных `database.db` обычной командой `cp` во время активных транзакций не рекомендуется.

Используйте встроенную утилиту безопасного горячего бэкапа SQLite (Online Backup API):

```bash
# Создание моментального безопасного бэкапа
sqlite3 api/database.db ".backup '/var/backups/devlearn-$(date +%Y%m%d_%H%M%S).db'"
```

### Автоматический бэкап по расписанию (Cron)
Добавьте задачу в `crontab -e`:
```bash
# Бэкап каждый день в 03:00 ночи с архивацией (хранение 30 дней)
0 3 * * * sqlite3 /var/www/dev_learn/api/database.db ".backup '/var/backups/devlearn-$(date +\%F).db'" && gzip /var/backups/devlearn-$(date +\%F).db && find /var/backups -name "devlearn-*.db.gz" -mtime +30 -delete
```

---

## 🔄 Обновление проекта на продакшне

```bash
git pull origin main
npm run install:all
npm run build:web
pm2 reload devlearn-api
```

---

## 🩺 Pre-Flight диагностика

Перед запуском на боевом сервере запустите встроенную утилиту самодиагностики:

```bash
npm run check:prod
```

Она проверит:
1. Версию Node.js (>= 18)
2. Валидность `.env` и стойкость `JWT_SECRET`
3. Целостность SQLite базы данных и активность режима WAL
4. Наличие скомпилированного Web SPA (`mobile-app/dist`)
5. Наличие конфигурационных файлов (PM2, Nginx, Systemd)

Если все пункты отмечены `[✓ PASS]`, проект готов к приему пользователей! 🚀
