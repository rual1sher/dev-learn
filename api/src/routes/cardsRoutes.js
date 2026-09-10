const express = require('express');
const CardsController = require('../controllers/cardsController');

const router = express.Router();

// Маршруты работы с карточками
router.get('/', CardsController.getCards);
router.get('/stats', CardsController.getStats);
router.get('/:id', CardsController.getCardById);
router.post('/:id/answer', CardsController.answerCard);

module.exports = router;
