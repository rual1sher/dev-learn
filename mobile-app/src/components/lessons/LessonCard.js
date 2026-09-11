import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AnimatedBrutalButton from '../common/AnimatedBrutalButton';

/**
 * LessonCard — мемоизированная карточка интерактивного урока в каталоге уроков.
 *
 * @param {object} lesson - Объект урока из LESSONS_DATA
 * @param {string} lang - 'ru' | 'uz'
 * @param {object} t - Переводы
 * @param {Function} onOpenLesson - Обработчик открытия урока
 */
function LessonCard({ lesson, lang = 'ru', t = {}, onOpenLesson }) {
  const isUz = lang === 'uz';
  const title = isUz && lesson.title_uz ? lesson.title_uz : lesson.title;
  const subtitle = isUz && lesson.subtitle_uz ? lesson.subtitle_uz : lesson.subtitle;
  const summary = isUz && lesson.summary_uz ? lesson.summary_uz : lesson.summary;
  const badge = isUz && lesson.badge_uz ? lesson.badge_uz : lesson.badge;
  const readTime = isUz && lesson.readTime_uz ? lesson.readTime_uz : lesson.readTime;

  return (
    <View style={styles.lessonCard}>
      {/* 1. Бейджи в шапке карточки: категория, время чтения, языки */}
      <View style={styles.cardHeaderRow}>
        <View style={styles.badgesGroup}>
          <View style={[styles.categoryBadge, { backgroundColor: lesson.color || '#38BDF8' }]}>
            <Feather name={lesson.icon || 'code'} size={12} color="#000000" style={{ marginRight: 4 }} />
            <Text style={styles.categoryBadgeText}>{badge}</Text>
          </View>

          <View style={styles.durationBadge}>
            <Feather name="clock" size={11} color="#000000" style={{ marginRight: 4 }} />
            <Text style={styles.durationBadgeText}>{readTime}</Text>
          </View>

          <View style={styles.langPill}>
            <Text style={styles.langPillText}>RU / UZ</Text>
          </View>
        </View>
      </View>

      {/* 2. Название и подзаголовок */}
      <Text style={styles.lessonTitle}>{title}</Text>
      <Text style={styles.lessonSubtitle}>{subtitle}</Text>
      <Text style={styles.lessonDesc} numberOfLines={3}>{summary}</Text>

      {/* 3. Уровни компетенций (Junior, Middle, Senior) */}
      <View style={styles.levelsRow}>
        <View style={[styles.levelTag, { backgroundColor: '#4ADE80' }]}>
          <Text style={styles.levelTagText}>JUNIOR</Text>
        </View>
        <View style={[styles.levelTag, { backgroundColor: '#FDE047' }]}>
          <Text style={styles.levelTagText}>MIDDLE</Text>
        </View>
        <View style={[styles.levelTag, { backgroundColor: '#F472B6' }]}>
          <Text style={styles.levelTagText}>SENIOR</Text>
        </View>
      </View>

      {/* 4. Кнопка открытия урока */}
      <AnimatedBrutalButton
        animationType="hop"
        style={styles.openBtn}
        onPress={() => onOpenLesson && onOpenLesson(lesson.id)}
      >
        <Feather name="book-open" size={15} color="#000000" style={{ marginRight: 6 }} />
        <Text style={styles.openBtnText}>
          {t.readLessonBtn || 'Читать урок'}
        </Text>
      </AnimatedBrutalButton>
    </View>
  );
}

const styles = StyleSheet.create({
  lessonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: '#000000',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 3.5, height: 3.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  cardHeaderRow: {
    marginBottom: 10,
  },
  badgesGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 0.3,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  durationBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000000',
  },
  langPill: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  langPillText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#3730A3',
  },
  lessonTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#000000',
    lineHeight: 22,
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  lessonSubtitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0284C7',
    marginBottom: 8,
  },
  lessonDesc: {
    fontSize: 13,
    fontWeight: '500',
    color: '#3F3F46',
    lineHeight: 18,
    marginBottom: 12,
  },
  levelsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  levelTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  levelTagText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 0.3,
  },
  openBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDE047',
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  openBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 0.3,
  },
});

export default memo(LessonCard);
