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
 * MediaInfoModal — модальное окно информации о медиатеке открытых ресурсов DevLearn.
 *
 * @param {boolean} visible - Видимость модалки
 * @param {Function} onClose - Обработчик закрытия
 * @param {string} lang - 'ru' | 'uz'
 */
export default function MediaInfoModal({ visible, onClose, lang = 'ru' }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const isUz = lang === 'uz';

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.infoModalOverlay, isDesktop && styles.infoModalOverlayDesktop]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={[styles.infoModalContent, isDesktop && styles.infoModalContentDesktop]}>
          {/* Заголовок модалки */}
          <View style={styles.infoModalHeader}>
            <View style={styles.infoModalTitleGroup}>
              <View style={[styles.infoIconPill, { backgroundColor: '#38BDF8' }]}>
                <Feather name="tv" size={18} color="#000000" />
              </View>
              <View>
                <Text style={styles.infoModalTitle}>
                  {isUz ? "Ochiq resurslar" : "Открытые ресурсы"}
                </Text>
                <Text style={styles.infoModalSubHeader}>
                  {isUz ? "DevLearn Media Hub" : "Медиа-хаб DevLearn"}
                </Text>
              </View>
            </View>
            <AnimatedIconButton
              style={styles.infoCloseBtn}
              iconName="x"
              iconSize={18}
              animationType="spin90"
              onPress={onClose}
            />
          </View>

          {/* Описание и карточки */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.infoModalScrollView}
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
                    ? "Eng sara ochiq videodars, podkast va kurslarni saralab to'pladik: xotirani band qilmaydi, bevosita asl manbada ochiladi!"
                    : "Мы отобрали лучшие открытые видеокурсы, подкасты и лекции: они не занимают память устройства и открываются напрямую в оригинале!"}
                </Text>
              </View>
            </View>

            {/* 1. Карточка: 100% Бесплатно и Открыто */}
            <View style={styles.infoFeatureCard}>
              <View style={[styles.featureIconBadge, { backgroundColor: '#BBF7D0' }]}>
                <Feather name="check-circle" size={18} color="#000000" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.featureTitleRow}>
                  <Text style={styles.featureTitle}>
                    {isUz ? "100% Bepul va Ochiq" : "100% Бесплатно и Открыто"}
                  </Text>
                  <View style={[styles.miniBadge, { backgroundColor: '#BBF7D0' }]}>
                    <Text style={styles.miniBadgeText}>NO PAYWALL</Text>
                  </View>
                </View>
                <Text style={styles.featureText}>
                  {isUz
                    ? "Hech qanday pullik obunalar yoki yashirin to'lovlarsiz to'liq ochiq ta'lim."
                    : "Никаких платных подписок, скрытых ограничений или пейволлов."}
                </Text>
              </View>
            </View>

            {/* 2. Карточка: Знания на 3 языках */}
            <View style={styles.infoFeatureCard}>
              <View style={[styles.featureIconBadge, { backgroundColor: '#FED7AA' }]}>
                <Feather name="globe" size={18} color="#000000" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>
                  {isUz ? "3 xil tildagi bilimlar" : "Знания на 3 языках"}
                </Text>
                <View style={styles.pillTagRow}>
                  <View style={[styles.langPillBadge, { backgroundColor: '#BAE6FD' }]}>
                    <Text style={styles.langPillText}>O'ZBEK</Text>
                  </View>
                  <View style={[styles.langPillBadge, { backgroundColor: '#FEF08A' }]}>
                    <Text style={styles.langPillText}>РУССКИЙ</Text>
                  </View>
                  <View style={[styles.langPillBadge, { backgroundColor: '#FBCFE8' }]}>
                    <Text style={styles.langPillText}>ENGLISH</Text>
                  </View>
                </View>
                <Text style={styles.featureText}>
                  {isUz
                    ? "O'z ona tilingizda o'rganing yoki original ingliz tilidagi manbalar orqali texnik darajangizni oshiring."
                    : "Фильтруйте контент в один клик: учитесь на родном языке или прокачивайте технический английский."}
                </Text>
              </View>
            </View>

            {/* 3. Карточка: Прямой переход */}
            <View style={styles.infoFeatureCard}>
              <View style={[styles.featureIconBadge, { backgroundColor: '#C084FC' }]}>
                <Feather name="external-link" size={18} color="#000000" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>
                  {isUz ? "To'g'ridan-to'g'ri o'tish" : "Прямой запуск в плеере"}
                </Text>
                <Text style={styles.featureText}>
                  {isUz
                    ? "Tugmani bosishingiz bilan dars YouTube yoki rasmiy saytda ochiladi — 4K sifat va qulay tezlik."
                    : "По клику на кнопку урок запускается прямо в официальном YouTube или на сайте с поддержкой 4K и ускорения."}
                </Text>
              </View>
            </View>

            {/* 4. Карточка: Кураторский отбор */}
            <View style={styles.infoFeatureCard}>
              <View style={[styles.featureIconBadge, { backgroundColor: '#F472B6' }]}>
                <Feather name="award" size={18} color="#000000" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>
                  {isUz ? "Saralangan sifatli ta'lim" : "Кураторский отбор инженеров"}
                </Text>
                <Text style={styles.featureText}>
                  {isUz
                    ? "Garvard (CS50), Google va eng yaxshi IT ekspertlarining sinalgan va yuqori baholangan kurslari."
                    : "Только проверенные курсы от Гарварда (CS50), Google и ведущих практиков мировой индустрии."}
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
                {isUz ? "Tushunarli, ko'rishga o'tish!" : "Понятно, к материалам!"}
              </Text>
            </View>
          </AnimatedBrutalButton>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  infoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoModalOverlayDesktop: {
    padding: 30,
  },
  infoModalContent: {
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
  infoModalContentDesktop: {
    maxWidth: 580,
  },
  infoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 2,
    borderColor: '#E4E4E7',
  },
  infoModalTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  infoIconPill: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoModalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -0.2,
  },
  infoModalSubHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
    marginTop: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCloseBtn: {
    width: 36,
    height: 36,
    backgroundColor: '#F4F4F5',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoModalScrollView: {
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
  infoFeatureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#000000',
    padding: 14,
    marginBottom: 12,
  },
  featureIconBadge: {
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
  featureTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 4,
  },
  miniBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  miniBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#000000',
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
    lineHeight: 17,
  },
  pillTagRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 6,
  },
  langPillBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000',
  },
  langPillText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#000000',
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
