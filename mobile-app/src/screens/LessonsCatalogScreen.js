import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LESSONS_DATA } from '../constants/lessonsData';
import AnimatedIconButton from '../components/common/AnimatedIconButton';
import AnimatedBrutalButton from '../components/common/AnimatedBrutalButton';
import AnimatedDotty from '../components/common/AnimatedDotty';

export default function LessonsCatalogScreen({
  navigation,
  lang = 'ru',
  t,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

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

  const handleBack = () => {
    if (navigation?.canGoBack && navigation.canGoBack()) {
      navigation.goBack();
    } else if (navigation?.navigate) {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.collectionScreen}>
      {/* 1. НЕО-БРУТАЛЬНЫЙ ХЕДЕР КАТАЛОГА (FEED HEADER) */}
      <View style={styles.feedHeader}>
        <AnimatedIconButton
          style={styles.brutalIconButton}
          iconName="arrow-left"
          iconSize={20}
          animationType="nudge"
          onPress={handleBack}
        />

        <View style={[styles.collectionHeaderBadge, { backgroundColor: '#F472B6' }]}>
          <Text
            style={styles.collectionHeaderTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {t.lessonsScreenTitle || 'Интерактивные Уроки'}
          </Text>
        </View>

        <AnimatedIconButton
          style={styles.brutalIconButton}
          iconName="info"
          iconSize={20}
          animationType="bounce"
          onPress={() => setIsInfoModalOpen(true)}
        />
      </View>

      {/* 2. ПОДЗАГОЛОВОК И ОПИСАНИЕ */}
      <View style={styles.collectionDescContainer}>
        <Text style={styles.collectionSubtitle}>
          {isUz ? "Junior / Middle / Senior chuqur qo'llanmalar" : "Junior / Middle / Senior глубокие руководства"}
        </Text>
        <Text style={styles.collectionDesc}>
          {t.lessonsScreenSubtitle || 'Полные текстовые руководства с исходным кодом, архитектурой и разбором под капотом.'}
        </Text>
      </View>

      {/* 3. БАННЕР УВЕДОМЛЕНИЯ (NOTE BANNER) */}
      <View style={styles.mediaNoteBanner}>
        <Feather name="book-open" size={14} color="#0284C7" style={{ marginRight: 6 }} />
        <Text style={styles.mediaNoteText}>
          {isUz
            ? "Nativ o'qish rejimi: to'liq matn va kodlar ilova ichida saqlangan"
            : "Нативное чтение: полные тексты и примеры кода прямо внутри платформы"}
        </Text>
      </View>

      {/* 4. ПОИСКОВАЯ СТРОКА (INPUT BOX С НЕО-БРУТАЛЬНОЙ ТЕНЬЮ) */}
      <View style={[styles.inputBox, { height: 46, marginBottom: 16, borderRadius: 12 }]}>
        <Feather name="search" size={16} color="#71717A" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.textInput}
          placeholder={isUz ? "Darslarni qidirish..." : "Поиск по урокам и технологиям..."}
          placeholderTextColor="#71717A"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Feather name="x" size={16} color="#000" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* 5. СПИСОК КАРТОЧЕК УРОКОВ (MEDIA CARD DESIGN) */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {filteredLessons.map((lesson) => {
          const title = isUz && lesson.title_uz ? lesson.title_uz : lesson.title;
          const subtitle = isUz && lesson.subtitle_uz ? lesson.subtitle_uz : lesson.subtitle;
          const summary = isUz && lesson.summary_uz ? lesson.summary_uz : lesson.summary;
          const badge = isUz && lesson.badge_uz ? lesson.badge_uz : lesson.badge;
          const readTime = isUz && lesson.readTime_uz ? lesson.readTime_uz : lesson.readTime;

          return (
            <View key={lesson.id} style={styles.mediaCard}>
              {/* Бейджи в шапке карточки */}
              <View style={styles.mediaCardHeader}>
                <View style={styles.mediaHeaderBadges}>
                  <View style={[styles.mediaPlatformBadge, { backgroundColor: lesson.color || '#38BDF8' }]}>
                    <Feather name={lesson.icon || 'code'} size={12} color="#000" style={{ marginRight: 4 }} />
                    <Text style={styles.mediaPlatformText}>{badge}</Text>
                  </View>

                  <View style={styles.mediaDurationBadge}>
                    <Feather name="clock" size={11} color="#000" style={{ marginRight: 3 }} />
                    <Text style={styles.mediaDurationText}>{readTime}</Text>
                  </View>

                  <View style={styles.mediaPlatformBadge}>
                    <Text style={styles.mediaPlatformText}>RU / UZ</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.mediaCardTitle}>{title}</Text>
              <Text style={styles.mediaCardSubtitle}>{subtitle}</Text>
              <Text style={styles.mediaCardDesc} numberOfLines={3}>{summary}</Text>

              {/* Уровни сложности */}
              <View style={styles.levelsRow}>
                <View style={[styles.levelTagPill, { backgroundColor: '#4ADE80' }]}>
                  <Text style={styles.levelTagText}>JUNIOR</Text>
                </View>
                <View style={[styles.levelTagPill, { backgroundColor: '#FDE047' }]}>
                  <Text style={styles.levelTagText}>MIDDLE</Text>
                </View>
                <View style={[styles.levelTagPill, { backgroundColor: '#F472B6' }]}>
                  <Text style={styles.levelTagText}>SENIOR</Text>
                </View>
              </View>

              {/* Кнопка открытия урока */}
              <AnimatedBrutalButton
                animationType="hop"
                style={styles.openLessonBtn}
                onPress={() => navigation.navigate('Lesson', { lessonId: lesson.id })}
              >
                <Feather name="book-open" size={15} color="#000" style={{ marginRight: 6 }} />
                <Text style={styles.openLessonBtnText}>
                  {t.readLessonBtn || 'Читать урок'}
                </Text>
              </AnimatedBrutalButton>
            </View>
          );
        })}

        {filteredLessons.length === 0 && (
          <View style={styles.emptyBox}>
            <Feather name="search" size={32} color="#A1A1AA" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyTitle}>
              {isUz ? "Darslar topilmadi" : "Уроков не найдено"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {isUz ? "Qidiruv so'zini o'zgartirib ko'ring" : "Попробуйте изменить поисковый запрос"}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* МОДАЛЬНОЕ ОКНО ИНФОРМАЦИИ: МЕТОДОЛОГИЯ УРОКОВ */}
      <Modal
        visible={isInfoModalOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsInfoModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setIsInfoModalOpen(false)}
          />
          <View style={[styles.modalCard, isDesktop && styles.modalCardDesktop]}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <View style={[styles.modalHeaderIconBadge, { backgroundColor: '#F472B6' }]}>
                  <Feather name="book-open" size={18} color="#000" />
                </View>
                <View>
                  <Text style={styles.modalTitle}>
                    {isUz ? "Darslar metodologiyasi" : "Методология уроков"}
                  </Text>
                  <Text style={styles.modalSubHeader}>
                    {isUz ? "DevLearn Core Framework" : "Инженерный подход DevLearn"}
                  </Text>
                </View>
              </View>
              <AnimatedIconButton
                style={styles.modalCloseIconBtn}
                iconName="x"
                iconSize={18}
                animationType="spin90"
                onPress={() => setIsInfoModalOpen(false)}
              />
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.modalScrollView}
              contentContainerStyle={{ paddingBottom: 6 }}
            >
              {/* Mascot Dotty Intro Banner */}
              <View style={styles.mascotBannerCard}>
                <View style={styles.mascotAvatarBox}>
                  <AnimatedDotty size={42} animated={true} />
                </View>
                <View style={styles.mascotTextBox}>
                  <View style={styles.mascotBadgePill}>
                    <Feather name="zap" size={11} color="#000" style={{ marginRight: 4 }} />
                    <Text style={styles.mascotBadgeText}>
                      {isUz ? "DOTTY MASLAHATLARI" : "СОВЕТ ТАЛИСМАНА DOTTY"}
                    </Text>
                  </View>
                  <Text style={styles.mascotLeadText}>
                    {isUz
                      ? "Har bir dars amaliy tajribaga asoslangan: kod, dvijok mexanizmlari va intervyu sirlari!"
                      : "Каждый урок создан инженерами без абстракций: разбираем живой код, архитектуру под капотом и вопросы с собеседований!"}
                  </Text>
                </View>
              </View>

              {/* 1. Карточка 3 уровней */}
              <View style={styles.featureItemCard}>
                <View style={[styles.featureIconBox, { backgroundColor: '#FDE047' }]}>
                  <Feather name="layers" size={18} color="#000" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featureTitle}>
                    {isUz ? "3 xil muhandislik darajasi" : "3 инженерных уровня"}
                  </Text>
                  <View style={styles.levelsPillRow}>
                    <View style={[styles.levelMiniBadge, { backgroundColor: '#BBF7D0' }]}>
                      <Text style={styles.levelMiniText}>JUNIOR</Text>
                    </View>
                    <Text style={styles.levelArrow}>→</Text>
                    <View style={[styles.levelMiniBadge, { backgroundColor: '#BAE6FD' }]}>
                      <Text style={styles.levelMiniText}>MIDDLE</Text>
                    </View>
                    <Text style={styles.levelArrow}>→</Text>
                    <View style={[styles.levelMiniBadge, { backgroundColor: '#FBCFE8' }]}>
                      <Text style={styles.levelMiniText}>SENIOR</Text>
                    </View>
                  </View>
                  <Text style={styles.featureDesc}>
                    {isUz
                      ? "Material bosqichma-bosqich tuzilgan: asosiy tushunchalardan tortib, arxitektura, trade-off va chuqur optimizatsiyalargacha."
                      : "Материал структурирован пошагово: от базового синтаксиса до архитектуры, трейдоффов и тонких оптимизаций."}
                  </Text>
                </View>
              </View>

              {/* 2. Реальный Production-код */}
              <View style={styles.featureItemCard}>
                <View style={[styles.featureIconBox, { backgroundColor: '#86EFAC' }]}>
                  <Feather name="code" size={18} color="#000" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featureTitle}>
                    {isUz ? "Haqiqiy Production kod" : "Реальный Production-код"}
                  </Text>
                  <Text style={styles.featureDesc}>
                    {isUz
                      ? "Mavhum misollarsiz. Haqiqiy loyihalarda ishlatiladigan arxitektura, toza kod va amaliy patternlar."
                      : "Никаких абстрактных 'foo/bar'. Готовые архитектурные паттерны, чистый код и разбор реальных продакшн-юзкейсов."}
                  </Text>
                </View>
              </View>

              {/* 3. Архитектура под капотом */}
              <View style={styles.featureItemCard}>
                <View style={[styles.featureIconBox, { backgroundColor: '#C084FC' }]}>
                  <Feather name="cpu" size={18} color="#000" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featureTitle}>
                    {isUz ? "Kapoti ostidagi arxitektura" : "Архитектура под капотом"}
                  </Text>
                  <Text style={styles.featureDesc}>
                    {isUz
                      ? "Kod virtual mashinada qanday bajarilishi: xotira boshqaruvi, Event Loop, render va oqimlar."
                      : "Как код исполняется рантаймом: виртуальная память, сборщик мусора (GC), Event Loop и многопоточность."}
                  </Text>
                </View>
              </View>

              {/* 4. Dotty Pro-Tip & Собеседования */}
              <View style={styles.featureItemCard}>
                <View style={[styles.featureIconBox, { backgroundColor: '#FB923C' }]}>
                  <Feather name="award" size={18} color="#000" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featureTitle}>
                    {isUz ? "Intervyu sirlari va tuzoqlar" : "Инсайты для собеседований"}
                  </Text>
                  <Text style={styles.featureDesc}>
                    {isUz
                      ? "Senior darajadagi intervyularda beriladigan nozik savollar, tez-tez uchraydigan xatolar va sirlar tahlili."
                      : "Разбор каверзных вопросов из технических интервью BigTech, частых ошибок новичков и подводных камней."}
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Кнопка закрытия */}
            <AnimatedBrutalButton
              animationType="hop"
              style={styles.modalActionBtn}
              onPress={() => setIsInfoModalOpen(false)}
            >
              <View style={styles.modalActionBtnRow}>
                <Feather name="check-circle" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.modalActionBtnText}>
                  {isUz ? "Tushunarli, darslarga!" : "Понятно, к урокам!"}
                </Text>
              </View>
            </AnimatedBrutalButton>
          </View>
        </View>
      </Modal>
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
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    paddingHorizontal: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
  },
  mediaCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#000',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  mediaCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  mediaHeaderBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    flex: 1,
  },
  mediaPlatformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  mediaPlatformText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#000',
  },
  mediaDurationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF08A',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  mediaDurationText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#000',
  },
  mediaCardTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#000',
    letterSpacing: -0.3,
    marginBottom: 4,
    lineHeight: 22,
  },
  mediaCardSubtitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#3B82F6',
    marginBottom: 8,
  },
  mediaCardDesc: {
    fontSize: 13,
    fontWeight: '500',
    color: '#52525B',
    lineHeight: 18,
    marginBottom: 12,
  },
  levelsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  levelTagPill: {
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  levelTagText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#000',
  },
  openLessonBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDE047',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 10,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  openLessonBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#000000',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#71717A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#000000',
    borderRadius: 16,
    padding: 18,
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  modalCardDesktop: {
    maxWidth: 530,
    padding: 22,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  modalHeaderIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#000000',
  },
  modalSubHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 1,
  },
  modalCloseIconBtn: {
    width: 34,
    height: 34,
    backgroundColor: '#F4F4F5',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScrollView: {
    maxHeight: 420,
    marginBottom: 12,
  },
  mascotBannerCard: {
    flexDirection: 'row',
    backgroundColor: '#FEF9C3',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
    gap: 10,
  },
  mascotAvatarBox: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotTextBox: {
    flex: 1,
  },
  mascotBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FDE047',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginBottom: 4,
  },
  mascotBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#000',
  },
  mascotLeadText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 16,
  },
  featureItemCard: {
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    padding: 11,
    marginBottom: 10,
    gap: 12,
    alignItems: 'flex-start',
  },
  featureIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1.8,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  featureTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#000',
    marginBottom: 3,
  },
  levelsPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 5,
  },
  levelMiniBadge: {
    borderWidth: 1.2,
    borderColor: '#000',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  levelMiniText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#000',
  },
  levelArrow: {
    fontSize: 11,
    fontWeight: '900',
    color: '#71717A',
  },
  featureDesc: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#4B5563',
    lineHeight: 16.5,
  },
  modalActionBtn: {
    backgroundColor: '#000000',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  modalActionBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActionBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13.5,
  },
});
