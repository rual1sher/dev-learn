const express = require('express');
const cardsRoutes = require('./cardsRoutes');
const healthRoutes = require('./healthRoutes');

const router = express.Router();

// Регистрация подмодулей маршрутизации
router.use('/cards', cardsRoutes);
router.use('/health', healthRoutes);

module.exports = router;
