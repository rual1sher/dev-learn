const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const http = require('http');
const {
  CORS_ORIGIN,
  NODE_ENV,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX,
  TRUST_PROXY,
  SERVE_STATIC,
  STATIC_PATH,
} = require('./config/env');
const requestLogger = require('./middlewares/requestLogger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');
const apiRoutes = require('./routes');

const app = express();

// 1. Настройка Trust Proxy (для Nginx / Docker / Cloudflare reverse proxy)
if (TRUST_PROXY) {
  app.set('trust proxy', 1);
}

// 2. Безопасность: HTTP Security Headers через Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Отключаем жесткий CSP, чтобы не блокировать Expo Web инлайн-стили и шрифты
    crossOriginEmbedderPolicy: false,
  })
);

// 3. Сжатие ответов (Gzip/Brotli)
app.use(compression());

// 4. Настройка CORS
const corsOptions = {};
if (CORS_ORIGIN !== '*') {
  const allowedOrigins = CORS_ORIGIN.split(',').map((origin) => origin.trim());
  corsOptions.origin = (origin, callback) => {
    // Разрешаем запросы без origin (например, мобильные клиенты или curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  };
} else {
  corsOptions.origin = '*';
}
app.use(cors(corsOptions));

// 5. Парсер тела запросов с ограничением размера (защита от DoS)
app.use(express.json({ limit: '100kb' }));
app.use(requestLogger);

// 6. Rate Limiting для защиты API от перегрузки и брутфорса
const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    statusCode: 429,
    error: 'Слишком много запросов. Пожалуйста, повторите позже.',
  },
});
app.use('/api', apiLimiter);

// 7. Подключение API маршрутов
app.use('/api', apiRoutes);

// 7.5. В режиме разработки динамически проксируем запросы в Metro Dev Server (8081)
if (NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();

    const proxyReq = http.request(
      {
        hostname: '127.0.0.1',
        port: 8081,
        path: req.url,
        method: req.method,
        headers: {
          ...req.headers,
          host: 'localhost:8081',
        },
        timeout: 1500,
      },
      (proxyRes) => {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      }
    );

    proxyReq.on('error', () => {
      // Если Metro Bundler не запущен, переходим к отдаче статического билда
      next();
    });

    proxyReq.on('timeout', () => {
      proxyReq.destroy();
      next();
    });

    if (req.readable) {
      req.pipe(proxyReq);
    } else {
      proxyReq.end();
    }
  });
}

// 8. Раздача собранного Web-клиента (React Native Web SPA)
const hasStaticWebBuild = SERVE_STATIC && fs.existsSync(STATIC_PATH) && fs.existsSync(path.join(STATIC_PATH, 'index.html'));

if (hasStaticWebBuild) {
  // Статические ресурсы (js, css, шрифты, картинки)
  app.use(
    express.static(STATIC_PATH, {
      maxAge: NODE_ENV === 'production' ? '7d' : 0,
      etag: NODE_ENV === 'production',
      lastModified: NODE_ENV === 'production',
      setHeaders: (res) => {
        if (NODE_ENV !== 'production') {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        }
      },
    })
  );

  // SPA Fallback: все GET-запросы не к /api направляются на index.html
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      if (NODE_ENV !== 'production') {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
      return res.sendFile(path.join(STATIC_PATH, 'index.html'));
    }
    return next();
  });
} else {
  // Корневой эндпоинт для проверки статуса API (если веб-бандл не собран)
  app.get('/', (req, res) => {
    res.json({
      name: 'DevLearn REST API',
      version: '1.0.0',
      status: 'ready',
      environment: NODE_ENV,
      staticClientServed: false,
      documentation: {
        cards: '/api/cards',
        cardsCategory: '/api/cards?category=node',
        cardStats: '/api/cards/stats',
        cardAnswer: 'POST /api/cards/:id/answer',
        health: '/api/health',
      },
    });
  });
}

// 9. Обработка 404 и глобальных ошибок
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
