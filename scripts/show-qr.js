#!/usr/bin/env node

/**
 * ==============================================================================
 * 📲 DevLearn Platform — Expo Tunnel QR Code & URL Viewer
 * Извлекает URL активного туннеля (через ngrok API или PM2 логи) и рисует QR-код
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

function printQR(url) {
  try {
    let qrcode;
    try {
      qrcode = require('../mobile-app/node_modules/qrcode-terminal');
    } catch {
      qrcode = require('qrcode-terminal');
    }
    console.log('\n======================================================');
    console.log('  📲 DEVLEARN: EXPO GO MOBILE TUNNEL');
    console.log('======================================================');
    console.log('\n🔗 Ссылка для подключения:');
    console.log('\x1b[1m\x1b[36m' + url + '\x1b[0m\n');
    qrcode.generate(url, { small: true });
    console.log('\n› 1. Откройте приложение Expo Go на телефоне.');
    console.log('› 2. Отсканируйте QR-код выше камерой или через Expo Go.');
    console.log('› 3. Либо в Expo Go нажмите "Enter URL manually" и вставьте:');
    console.log('     \x1b[1m\x1b[33m' + url + '\x1b[0m\n');
  } catch (e) {
    console.log('\n📲 Ссылка для подключения в Expo Go: ' + url + '\n');
  }
}

function fallbackLog() {
  const logPaths = [
    path.resolve(__dirname, '../mobile-app/logs/pm2-tunnel-out.log'),
    path.resolve(__dirname, '../logs/pm2-tunnel-out.log'),
  ];
  for (const p of logPaths) {
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf8');
      const lines = content.split('\n');
      const expLine = lines.slice().reverse().find(l => l.includes('exp://'));
      if (expLine) {
        const match = expLine.match(/exp:\/\/[^\s\x1b]+/);
        if (match) {
          printQR(match[0]);
          return;
        }
      }
    }
  }
  console.log('\n⚠️ Активный туннель пока не обнаружен.');
  console.log('👉 Убедитесь, что процесс запущен: npm run pm2:start:tunnel');
  console.log('   Или перезапустите: pm2 restart ecosystem.config.js --update-env\n');
}

// 1. Проверяем локальный API ngrok (порт 4040)
const req = http.get('http://127.0.0.1:4040/api/tunnels', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.tunnels && json.tunnels.length > 0) {
        const tunnel = json.tunnels[0];
        const expUrl = tunnel.public_url.replace(/^https?:\/\//, 'exp://');
        printQR(expUrl);
        return;
      }
    } catch (_) {}
    fallbackLog();
  });
});

req.on('error', () => {
  fallbackLog();
});
