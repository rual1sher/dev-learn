import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { LESSONS_DATA } from '../constants/lessonsData';
import ScreenHeader from '../components/common/ScreenHeader';
import FolderMetaBanner from '../components/common/FolderMetaBanner';
import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';
import AnimatedIconButton from '../components/common/AnimatedIconButton';
import LessonCard from '../components/lessons/LessonCard';
import LessonsInfoModal from '../modals/LessonsInfoModal';

/**
 * LessonsCatalogScreen — экран каталога интерактивных курсов и уроков DevLearn.
 * Стандартизирован в едином Neo-Brutalist стиле: ScreenHeader, FolderMetaBanner, SearchBar, LessonCard, EmptyState.
 */
export default function LessonsCatalogScreen({
  navigation,
  lang = 'ru',
  t = {},
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const isUz = lang === 'uz';

  const filteredLessons = useMemo(() => {
    if (!searchQuery.trim()) return LESSONS_DATA;
    const q = searchQuery.toLowerCase().trim();
    return LESSONS_DATA.filter((lesson) => {
      const title = (isUz && lesson.title_uz ? lesson.title_uz : lesson.title).toLowerCase();
      const subtitle = (isUz && lesson.subtitle_uz ? lesson.subtitle_uz : lesson.subtitle).toLowerCase();
      const summary = (isUz && lesson.summary_uz ? lesson.summary_uz : lesson.summary).toLowerCase();
      return title.includes(q) || subtitle.includes(q) || summary.includes(q);
    });
  }, [searchQuery, isUz]);

  const handleBack = useCallback(() => {
    if (navigation?.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else if (navigation?.navigate) {
      navigation.navigate('Home');
    }
  }, [navigation]);

  const handleOpenLesson = useCallback((lessonId) => {
    if (navigation?.navigate) {
      navigation.navigate('Lesson', { lessonId });
    }
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* 1. ЕДИНЫЙ НЕО-БРУТАЛЬНЫЙ ХЕДЕР ПАПКИ */}
      <ScreenHeader
        title={t.lessonsScreenTitle || (isUz ? 'Interaktiv Darslar' : 'Интерактивные Уроки')}
        badgeColor="#F472B6"
        onBack={handleBack}
        rightAction={
          <AnimatedIconButton
            style={styles.infoBtn}
            iconName="info"
            iconSize={20}
            animationType="bounce"
            onPress={() => setIsInfoModalOpen(true)}
          />
        }
      />

      {/* 2. ЕДИНЫЙ МЕТА-БАННЕР ПАПКИ */}
      <FolderMetaBanner
        subtitle={isUz ? "Junior / Middle / Senior chuqur qo'llanmalar" : "Junior / Middle / Senior глубокие руководства"}
        desc={t.lessonsScreenSubtitle || (isUz
          ? "To'liq matnli qo'llanmalar, dastur kodi va arxitektura tahlillari."
          : "Полные текстовые руководства с исходным кодом, архитектурой и разбором под капотом.")}
        countText={`${LESSONS_DATA.length} ${isUz ? 'darslar' : 'курсов'}`}
        tagText="GUIDES"
        tagColor="#F472B6"
      />

      {/* 3. ЕДИНОЕ ПОЛЕ ПОИСКА */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={isUz ? "Darslarni qidirish..." : "Поиск по урокам и технологиям..."}
      />

      {/* 4. СПИСОК КАРТОЧЕК УРОКОВ ИЛИ EMPTY STATE С DOTTY */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredLessons.length === 0 ? (
          <EmptyState
            title={isUz ? "Darslar topilmadi" : "Уроков не найдено"}
            subtitle={isUz
              ? "Qidiruv so'zini o'zgartirib ko'ring."
              : "Попробуйте изменить поисковый запрос."}
            onReset={searchQuery ? () => setSearchQuery('') : null}
            resetLabel={isUz ? "Qidiruvni tozalash" : "Сбросить поиск"}
          />
        ) : (
          filteredLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              lang={lang}
              t={t}
              onOpenLesson={handleOpenLesson}
            />
          ))
        )}
      </ScrollView>

      {/* МОДАЛЬНОЕ ОКНО: ИНЖЕНЕРНАЯ МЕТОДОЛОГИЯ DEVLEARN */}
      <LessonsInfoModal
        visible={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        lang={lang}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  infoBtn: {
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
  scrollContent: {
    paddingBottom: 36,
  },
});
