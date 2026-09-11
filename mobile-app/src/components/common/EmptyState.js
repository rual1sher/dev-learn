import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AnimatedDotty from './AnimatedDotty';
import AnimatedBrutalButton from './AnimatedBrutalButton';

/**
 * EmptyState — унифицированный нео-бруталистский блок пустого состояния:
 * Отображает анимированного маскота Dotty, заголовок, пояснение и опциональную кнопку сброса.
 *
 * @param {string} title - Главный заголовок ("Ничего не найдено")
 * @param {string} subtitle - Поясняющий текст
 * @param {Function} onReset - Опциональный коллбэк сброса поиска/фильтра
 * @param {string} resetLabel - Текст кнопки сброса (например: "Сбросить поиск")
 * @param {object} style - Дополнительные стили контейнера
 */
export default function EmptyState({
  title = 'Ничего не найдено',
  subtitle = 'Попробуйте изменить поисковый запрос или выбрать другую категорию.',
  onReset,
  resetLabel = 'Сбросить поиск',
  style,
}) {
  return (
    <View style={[styles.emptyContainer, style]}>
      <AnimatedDotty size={64} animated={true} style={styles.dottyMascot} />

      <Text style={styles.emptyTitle}>
        {title}
      </Text>

      <Text style={styles.emptySubtitle}>
        {subtitle}
      </Text>

      {onReset && (
        <AnimatedBrutalButton
          animationType="hop"
          style={styles.resetBtn}
          onPress={onReset}
        >
          <Text style={styles.resetBtnText}>{resetLabel}</Text>
        </AnimatedBrutalButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: '#000000',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  dottyMascot: {
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#71717A',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 320,
  },
  resetBtn: {
    marginTop: 16,
    backgroundColor: '#FDE047',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 0.3,
  },
});
