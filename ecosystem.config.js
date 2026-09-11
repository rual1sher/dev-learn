/**
 * ==============================================================================
 * ⚡ DevLearn Platform — PM2 Process Manager Configuration
 * Запуск в production: pm2 start ecosystem.config.js --env production
 * Сохранить автозапуск при перезагрузке ОС: pm2 save && pm2 startup
 * ==============================================================================
 */

module.exports = {
  apps: [
    {
      name: 'devlearn-api',
      script: 'api/server.js',
      cwd: './',
      // Внимание: для SQLite рекомендуется режим 'fork' с 1 инстансом во избежание конфликтов блокировок
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '350M',
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      // Логирование
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      time: true,
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: false,
    },
    {
      name: 'devlearn-mobile-tunnel',
      script: 'node_modules/expo/bin/cli',
      args: 'start --tunnel',
      cwd: './mobile-app',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        EXPO_UNSTABLE_HEADLESS: '1',
      },
      env_production: {
        NODE_ENV: 'production',
        EXPO_UNSTABLE_HEADLESS: '1',
      },
      // Логирование (QR-код и ссылка exp:// пишутся в pm2-tunnel-out.log)
      error_file: 'logs/pm2-tunnel-error.log',
      out_file: 'logs/pm2-tunnel-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      time: true,
      kill_timeout: 5000,
      wait_ready: false,
    },
  ],
};
