import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LESSONS_DATA } from '../constants/lessonsData';
import AnimatedIconButton from '../components/common/AnimatedIconButton';
import AnimatedCopyButton from '../components/common/AnimatedCopyButton';
import AnimatedBrutalButton from '../components/common/AnimatedBrutalButton';
import AnimatedDotty from '../components/common/AnimatedDotty';

export default function LessonScreen({
  navigation,
  route,
  lang = 'ru',
  t,
  onCopySnippet,
}) {
  const lessonId = route?.params?.lessonId || 'react-native';

  // Поиск выбранного урока или fallback на первый
  const lesson = useMemo(() => {
    return (
      LESSONS_DATA.find((item) => item.id === lessonId) ||
      LESSONS_DATA[0]
    );
  }, [lessonId]);

  // Фильтр уровня сложности: 'all' | 'junior' | 'middle' | 'senior'
  const [selectedLevel, setSelectedLevel] = useState('all');

  const isUz = lang === 'uz';

  const handleBack = () => {
    if (navigation?.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else if (navigation?.navigate) {
      navigation.navigate('Lessons');
    }
  };

  const levelTabs = [
    { key: 'all', label: t.allLevelsFilter || 'Все уровни', icon: 'layers' },
    { key: 'junior', label: 'Junior', icon: 'zap' },
    { key: 'middle', label: 'Middle', icon: 'cpu' },
    { key: 'senior', label: 'Senior', icon: 'award' },
  ];

  const lessonTitle = isUz && lesson.title_uz ? lesson.title_uz : lesson.title;
  const lessonSubtitle = isUz && lesson.subtitle_uz ? lesson.subtitle_uz : lesson.subtitle;
  const lessonSummary = isUz && lesson.summary_uz ? lesson.summary_uz : lesson.summary;
  const lessonBadge = isUz && lesson.badge_uz ? lesson.badge_uz : lesson.badge;
  const readTime = isUz && lesson.readTime_uz ? lesson.readTime_uz : lesson.readTime;

  return (
    <View style={styles.collectionScreen}>
      {/* 1. НЕО-БРУТАЛЬНАЯ ШАПКА УРОКА (FEED HEADER) */}
      <View style={styles.feedHeader}>
        <AnimatedIconButton
          style={styles.brutalIconButton}
          iconName="arrow-left"
          iconSize={20}
          animationType="nudge"
          onPress={handleBack}
        />

        <View style={[styles.collectionHeaderBadge, { backgroundColor: lesson.color || '#38BDF8' }]}>
          <Text
            style={styles.collectionHeaderTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {lessonBadge}: {lessonTitle.split(':')[0]}
          </Text>
        </View>

        <AnimatedIconButton
          style={styles.brutalIconButton}
          iconName="grid"
          iconSize={20}
          animationType="bounce"
          onPress={() => navigation.navigate('Lessons')}
        />
      </View>

      {/* 2. ОПИСАНИЕ И ЗАГОЛОВОК */}
      <View style={styles.collectionDescContainer}>
        <Text style={styles.collectionSubtitle}>
          {lessonSubtitle}
        </Text>
        <Text style={styles.collectionDesc}>
          {lessonSummary}
        </Text>
      </View>

      {/* 3. БАННЕР ВРЕМЕНИ ЧТЕНИЯ */}
      <View style={styles.mediaNoteBanner}>
        <Feather name="clock" size={14} color="#0284C7" style={{ marginRight: 6 }} />
        <Text style={styles.mediaNoteText}>
          {isUz ? `O'qish vaqti: ${readTime}` : `Время чтения: ${readTime}`} • {isUz ? "3 ta muhandislik darajasi" : "3 инженерных уровня: Junior / Middle / Senior"}
        </Text>
      </View>

      {/* 4. СЕЛЕКТОР УРОВНЕЙ (JUNIOR / MIDDLE / SENIOR PILLS) */}
      <View style={{ marginBottom: 12, overflow: 'visible' }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ overflow: 'visible' }}
          contentContainerStyle={styles.mediaFilterContainer}
        >
          {levelTabs.map((tab) => {
            const isActive = selectedLevel === tab.key;
            return (
              <AnimatedBrutalButton
                key={tab.key}
                animationType="hop"
                style={[
                  styles.mediaFilterPill,
                  isActive && styles.mediaFilterPillActive,
                ]}
                onPress={() => setSelectedLevel(tab.key)}
              >
                <Feather
                  name={tab.icon}
                  size={13}
                  color="#000000"
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.mediaFilterText,
                    isActive && styles.mediaFilterTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </AnimatedBrutalButton>
            );
          })}
        </ScrollView>
      </View>

      {/* 5. ОСНОВНОЙ СКРОЛЛ СЕКЦИЙ */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* 🔰 JUNIOR СЕКЦИЯ */}
        {(selectedLevel === 'all' || selectedLevel === 'junior') && lesson.junior && (
          <View style={styles.entryCard}>
            <View style={styles.entryTopRow}>
              <View style={[styles.entryTagBadge, { backgroundColor: '#4ADE80' }]}>
                <Text style={styles.entryTagText}>
                  {isUz && lesson.junior.tag_uz ? lesson.junior.tag_uz : lesson.junior.tag}
                </Text>
              </View>
              <Feather name="zap" size={16} color="#000000" />
            </View>

            <Text style={styles.entryTitle}>
              {isUz && lesson.junior.title_uz ? lesson.junior.title_uz : lesson.junior.title}
            </Text>

            <Text style={styles.conceptText}>
              {isUz && lesson.junior.concept_uz ? lesson.junior.concept_uz : lesson.junior.concept}
            </Text>

            {/* БЛОК КОДА */}
            {lesson.junior.code && (
              <View style={{ marginBottom: 12 }}>
                <View style={styles.codeSnippetHeader}>
                  <Feather name="terminal" size={13} color="#000" style={{ marginRight: 6 }} />
                  <Text style={styles.codeSnippetTitle}>
                    {isUz && lesson.junior.codeTitle_uz ? lesson.junior.codeTitle_uz : lesson.junior.codeTitle}
                  </Text>
                </View>
                <View style={styles.codeSnippetBox}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Text style={styles.snippetText}>{lesson.junior.code}</Text>
                  </ScrollView>
                </View>
                <AnimatedCopyButton
                  style={styles.copyBtnBrutal}
                  label={t.copyCodeBtn || 'Скопировать код'}
                  textStyle={styles.copyBtnText}
                  onPress={() => onCopySnippet && onCopySnippet(lesson.junior.code)}
                />
              </View>
            )}

            {/* КЛЮЧЕВЫЕ ПРАВИЛА */}
            {lesson.junior.keyPoints && (
              <View style={styles.keyPointsBox}>
                <Text style={styles.keyPointsHeading}>
                  {t.keyPointsTitle || 'Ключевые инженерные правила:'}
                </Text>
                {(isUz && lesson.junior.keyPoints_uz ? lesson.junior.keyPoints_uz : lesson.junior.keyPoints).map((point, idx) => (
                  <View key={idx} style={styles.pointRow}>
                    <Feather name="check" size={14} color="#16A34A" style={styles.pointIcon} />
                    <Text style={styles.pointText}>{point}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ⚡ MIDDLE СЕКЦИЯ */}
        {(selectedLevel === 'all' || selectedLevel === 'middle') && lesson.middle && (
          <View style={styles.entryCard}>
            <View style={styles.entryTopRow}>
              <View style={[styles.entryTagBadge, { backgroundColor: '#FDE047' }]}>
                <Text style={styles.entryTagText}>
                  {isUz && lesson.middle.tag_uz ? lesson.middle.tag_uz : lesson.middle.tag}
                </Text>
              </View>
              <Feather name="cpu" size={16} color="#000000" />
            </View>

            <Text style={styles.entryTitle}>
              {isUz && lesson.middle.title_uz ? lesson.middle.title_uz : lesson.middle.title}
            </Text>

            <Text style={styles.conceptText}>
              {isUz && lesson.middle.concept_uz ? lesson.middle.concept_uz : lesson.middle.concept}
            </Text>

            {/* БЛОК КОДА */}
            {lesson.middle.code && (
              <View style={{ marginBottom: 12 }}>
                <View style={styles.codeSnippetHeader}>
                  <Feather name="cpu" size={13} color="#000" style={{ marginRight: 6 }} />
                  <Text style={styles.codeSnippetTitle}>
                    {isUz && lesson.middle.codeTitle_uz ? lesson.middle.codeTitle_uz : lesson.middle.codeTitle}
                  </Text>
                </View>
                <View style={styles.codeSnippetBox}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Text style={styles.snippetText}>{lesson.middle.code}</Text>
                  </ScrollView>
                </View>
                <AnimatedCopyButton
                  style={styles.copyBtnBrutal}
                  label={t.copyCodeBtn || 'Скопировать код'}
                  textStyle={styles.copyBtnText}
                  onPress={() => onCopySnippet && onCopySnippet(lesson.middle.code)}
                />
              </View>
            )}

            {/* КЛЮЧЕВЫЕ ПРАВИЛА */}
            {lesson.middle.keyPoints && (
              <View style={styles.keyPointsBox}>
                <Text style={styles.keyPointsHeading}>
                  {t.keyPointsTitle || 'Ключевые инженерные правила:'}
                </Text>
                {(isUz && lesson.middle.keyPoints_uz ? lesson.middle.keyPoints_uz : lesson.middle.keyPoints).map((point, idx) => (
                  <View key={idx} style={styles.pointRow}>
                    <Feather name="check" size={14} color="#CA8A04" style={styles.pointIcon} />
                    <Text style={styles.pointText}>{point}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* 🚀 SENIOR СЕКЦИЯ */}
        {(selectedLevel === 'all' || selectedLevel === 'senior') && lesson.senior && (
          <View style={styles.entryCard}>
            <View style={styles.entryTopRow}>
              <View style={[styles.entryTagBadge, { backgroundColor: '#F472B6' }]}>
                <Text style={styles.entryTagText}>
                  {isUz && lesson.senior.tag_uz ? lesson.senior.tag_uz : lesson.senior.tag}
                </Text>
              </View>
              <Feather name="shield" size={16} color="#000000" />
            </View>

            <Text style={styles.entryTitle}>
              {isUz && lesson.senior.title_uz ? lesson.senior.title_uz : lesson.senior.title}
            </Text>

            <Text style={styles.conceptText}>
              {isUz && lesson.senior.concept_uz ? lesson.senior.concept_uz : lesson.senior.concept}
            </Text>

            {/* БЛОК КОДА */}
            {lesson.senior.code && (
              <View style={{ marginBottom: 12 }}>
                <View style={styles.codeSnippetHeader}>
                  <Feather name="shield" size={13} color="#000" style={{ marginRight: 6 }} />
                  <Text style={styles.codeSnippetTitle}>
                    {isUz && lesson.senior.codeTitle_uz ? lesson.senior.codeTitle_uz : lesson.senior.codeTitle}
                  </Text>
                </View>
                <View style={styles.codeSnippetBox}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <Text style={styles.snippetText}>{lesson.senior.code}</Text>
                  </ScrollView>
                </View>
                <AnimatedCopyButton
                  style={styles.copyBtnBrutal}
                  label={t.copyCodeBtn || 'Скопировать код'}
                  textStyle={styles.copyBtnText}
                  onPress={() => onCopySnippet && onCopySnippet(lesson.senior.code)}
                />
              </View>
            )}

            {/* КЛЮЧЕВЫЕ ПРАВИЛА */}
            {lesson.senior.keyPoints && (
              <View style={styles.keyPointsBox}>
                <Text style={styles.keyPointsHeading}>
                  {t.keyPointsTitle || 'Ключевые инженерные правила:'}
                </Text>
                {(isUz && lesson.senior.keyPoints_uz ? lesson.senior.keyPoints_uz : lesson.senior.keyPoints).map((point, idx) => (
                  <View key={idx} style={styles.pointRow}>
                    <Feather name="check" size={14} color="#DB2777" style={styles.pointIcon} />
                    <Text style={styles.pointText}>{point}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* 💡 ТАЛИСМАН DOTTY: PRO-TIP ДЛЯ СОБЕСЕДОВАНИЙ */}
        {lesson.proTip && (
          <View style={styles.proTipCard}>
            <View style={styles.proTipHeaderRow}>
              <AnimatedDotty size={42} animated={true} />
              <View style={styles.proTipTitleBox}>
                <View style={styles.proTipPill}>
                  <Text style={styles.proTipPillText}>DOTTY PRO-TIP</Text>
                </View>
                <Text style={styles.proTipTitle}>
                  {isUz && lesson.proTip.title_uz ? lesson.proTip.title_uz : lesson.proTip.title}
                </Text>
              </View>
            </View>
            <Text style={styles.proTipBody}>
              {isUz && lesson.proTip.content_uz ? lesson.proTip.content_uz : lesson.proTip.content}
            </Text>
          </View>
        )}

        {/* ПЕРЕХОД К ДРУГИМ УРОКАМ */}
        <View style={styles.otherLessonsSection}>
          <Text style={styles.otherLessonsHeading}>
            {isUz ? "Boshqa darslar:" : "Другие интерактивные уроки:"}
          </Text>
          <View style={styles.otherLessonsRow}>
            {LESSONS_DATA.map((item) => {
              const isCurrent = item.id === lesson.id;
              const otherBadge = isUz && item.badge_uz ? item.badge_uz : item.badge;
              const otherTitle = isUz && item.title_uz ? item.title_uz.split(':')[0] : item.title.split(':')[0];
              return (
                <AnimatedBrutalButton
                  key={item.id}
                  animationType="hop"
                  style={[
                    styles.otherLessonPillBtn,
                    isCurrent && styles.otherLessonPillBtnActive,
                  ]}
                  onPress={() => navigation.navigate('Lesson', { lessonId: item.id })}
                >
                  <Feather
                    name={item.icon || 'book'}
                    size={14}
                    color="#000000"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.otherLessonPillText}>
                    {otherBadge}: {otherTitle}
                  </Text>
                </AnimatedBrutalButton>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  collectionScreen: {
    flex: 1,
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  brutalIconButton: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  collectionHeaderBadge: {
    borderWidth: 2.5,
    borderColor: '#000',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    maxWidth: '62%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000',
    textAlign: 'center',
  },
  collectionDescContainer: {
    marginBottom: 12,
  },
  collectionSubtitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#000',
    marginBottom: 4,
  },
  collectionDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: '#52525B',
    lineHeight: 18,
  },
  mediaNoteBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  mediaNoteText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
    flex: 1,
  },
  mediaFilterContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 4,
    overflow: 'visible',
  },
  mediaFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  mediaFilterPillActive: {
    backgroundColor: '#FDE047',
  },
  mediaFilterText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#3F3F46',
  },
  mediaFilterTextActive: {
    color: '#000000',
    fontWeight: '900',
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: '#000',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  entryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryTagBadge: {
    borderWidth: 1.5,
    borderColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  entryTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.5,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  conceptText: {
    fontSize: 13.5,
    lineHeight: 21,
    color: '#27272A',
    fontWeight: '500',
    marginBottom: 14,
  },
  codeSnippetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  codeSnippetTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000',
  },
  codeSnippetBox: {
    backgroundColor: '#F4F4F5',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  snippetText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#18181B',
    fontWeight: '600',
    lineHeight: 18,
  },
  copyBtnBrutal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDE047',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  copyBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000',
  },
  keyPointsBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 12,
    gap: 8,
    marginTop: 4,
  },
  keyPointsHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 2,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  pointIcon: {
    marginTop: 2,
  },
  pointText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 17,
    color: '#374151',
    fontWeight: '600',
  },
  proTipCard: {
    backgroundColor: '#FEF08A',
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: '#000000',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  proTipHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  proTipTitleBox: {
    flex: 1,
  },
  proTipPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#000000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  proTipPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FDE047',
    letterSpacing: 0.5,
  },
  proTipTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000000',
    lineHeight: 18,
  },
  proTipBody: {
    fontSize: 13,
    lineHeight: 20,
    color: '#18181B',
    fontWeight: '600',
  },
  otherLessonsSection: {
    marginTop: 8,
  },
  otherLessonsHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 8,
  },
  otherLessonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  otherLessonPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  otherLessonPillBtnActive: {
    backgroundColor: '#FED7AA',
  },
  otherLessonPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000000',
  },
});
