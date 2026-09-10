/**
 * Реализация алгоритма интервального повторения SuperMemo SM-2
 * (Spaced Repetition System)
 * 
 * Алгоритм определяет оптимальное время следующего повторения карточки,
 * чтобы закрепить знание в долговременной памяти без перегрузки.
 */

/**
 * Расчет следующего интервала и параметров SM-2
 * @param {Object} params
 * @param {number} params.repetitions - Количество успешных повторений подряд
 * @param {number} params.interval - Текущий интервал в днях
 * @param {number} params.easeFactor - Коэффициент легкости (минимум 1.3, по умолчанию 2.5)
 * @param {boolean} params.isCorrect - Правильно ли ответил пользователь
 * @returns {Object} { repetitions, interval, easeFactor, nextReviewAt }
 */
function calculateSM2({ repetitions = 0, interval = 0, easeFactor = 2.5, isCorrect }) {
  let nextRepetitions = repetitions;
  let nextInterval = interval;
  let nextEaseFactor = easeFactor || 2.5;

  if (isCorrect) {
    if (repetitions === 0) {
      nextInterval = 1; // 1 день
    } else if (repetitions === 1) {
      nextInterval = 6; // 6 дней
    } else {
      nextInterval = Math.round(interval * nextEaseFactor);
    }
    nextRepetitions = repetitions + 1;
    // Корректировка фактора легкости при успешном ответе
    nextEaseFactor = Math.min(3.0, nextEaseFactor + 0.1);
  } else {
    // При ошибке прогресс сбрасывается на повторение через 1 день
    nextRepetitions = 0;
    nextInterval = 1;
    // Уменьшаем фактор легкости, но не ниже 1.3
    nextEaseFactor = Math.max(1.3, nextEaseFactor - 0.2);
  }

  // Расчет даты следующего повторения
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);
  const nextReviewAt = nextReviewDate.toISOString();

  return {
    repetitions: nextRepetitions,
    interval: nextInterval,
    easeFactor: Math.round(nextEaseFactor * 100) / 100,
    nextReviewAt,
  };
}

module.exports = {
  calculateSM2,
};
