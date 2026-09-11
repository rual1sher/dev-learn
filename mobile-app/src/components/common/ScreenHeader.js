import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AnimatedIconButton from './AnimatedIconButton';

/**
 * ScreenHeader — единый нео-бруталистский заголовок для всех экранов приложения:
 * Папки коллекций, Медиатека, Уроки, Блиц-Спринт.
 *
 * @param {string} title - Заголовок экрана / название папки
 * @param {string} badgeColor - Цвет бейджа заголовка (по умолчанию #FDE047)
 * @param {Function} onBack - Коллбэк нажатия на кнопку «Назад»
 * @param {React.ReactNode} rightAction - Дополнительная правая кнопка/индикатор (опционально)
 * @param {object} style - Дополнительные стили контейнера
 */
export default function ScreenHeader({
  title,
  badgeColor = '#FDE047',
  onBack,
  rightAction,
  style,
}) {
  return (
    <View style={[styles.headerRow, style]}>
      {/* Кнопка возврата с тактильной физикой «nudge» */}
      <AnimatedIconButton
        style={styles.backButton}
        iconName="arrow-left"
        iconSize={20}
        animationType="nudge"
        onPress={onBack}
      />

      {/* Центральный нео-бруталистский бейдж с названием папки */}
      <View style={[styles.titleBadge, { backgroundColor: badgeColor }]}>
        <Text
          style={styles.titleText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
      </View>

      {/* Правый слот действий (кнопка добавления, инфо, счетчик или заглушка для симметрии) */}
      <View style={styles.rightSlot}>
        {rightAction || <View style={styles.rightPlaceholder} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  titleBadge: {
    flex: 1,
    height: 44,
    marginHorizontal: 10,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rightSlot: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightPlaceholder: {
    width: 44,
    height: 44,
  },
});
