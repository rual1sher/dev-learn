const express = require('express');
const HealthController = require('../controllers/healthController');

const router = express.Router();

// Маршрут проверки работоспособности сервиса
router.get('/', HealthController.getHealth);

module.exports = router;
