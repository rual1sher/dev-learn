import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AnimatedIconButton from '../components/common/AnimatedIconButton';
import AnimatedBrutalButton from '../components/common/AnimatedBrutalButton';
import AnimatedDotty from '../components/common/AnimatedDotty';

/**
 * LessonsInfoModal — модальное окно с методологией интерактивных уроков DevLearn.
 *
 * @param {boolean} visible - Видимость модального окна
 * @param {Function} onClose - Обработчик закрытия
 * @param {string} lang - Язык ('ru' | 'uz')
 */
export default function LessonsInfoModal({ visible, onClose, lang = 'ru' }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const isUz = lang === 'uz';

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={[styles.modalCard, isDesktop && styles.modalCardDesktop]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderTitleRow}>
              <View style={[styles.modalHeaderIconBadge, { backgroundColor: '#F472B6' }]}>
                <Feather name="book-open" size={18} color="#000000" />
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
              onPress={onClose}
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
                  <Feather name="zap" size={11} color="#000000" style={{ marginRight: 4 }} />
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
                <Feather name="layers" size={18} color="#000000" />
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
                <Feather name="code" size={18} color="#000000" />
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
                <Feather name="cpu" size={18} color="#000000" />
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
                <Feather name="award" size={18} color="#000000" />
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
            onPress={onClose}
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
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxHeight: '88%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#000000',
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  modalCardDesktop: {
    maxWidth: 580,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 2,
    borderColor: '#E4E4E7',
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  modalHeaderIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -0.2,
  },
  modalSubHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
    marginTop: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalCloseIconBtn: {
    width: 36,
    height: 36,
    backgroundColor: '#F4F4F5',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScrollView: {
    marginBottom: 16,
  },
  mascotBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF08A',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#000000',
    padding: 12,
    marginBottom: 14,
  },
  mascotAvatarBox: {
    marginRight: 12,
  },
  mascotTextBox: {
    flex: 1,
  },
  mascotBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#000000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 4,
  },
  mascotBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 0.5,
  },
  mascotLeadText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#18181B',
    lineHeight: 16,
  },
  featureItemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#000000',
    padding: 14,
    marginBottom: 12,
  },
  featureIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 4,
  },
  levelsPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  levelMiniBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000',
  },
  levelMiniText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#000000',
  },
  levelArrow: {
    fontSize: 11,
    fontWeight: '900',
    color: '#71717A',
  },
  featureDesc: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
    lineHeight: 17,
  },
  modalActionBtn: {
    backgroundColor: '#000000',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
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
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
});
