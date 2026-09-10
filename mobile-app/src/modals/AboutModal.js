import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Image,
} from 'react-native';
import AnimatedIconButton from '../components/common/AnimatedIconButton';
import AnimatedDotty from '../components/common/AnimatedDotty';
import AnimatedBrutalButton from '../components/common/AnimatedBrutalButton';

export default function AboutModal({
  visible,
  onClose,
  blitzQuestions,
  collectionsData,
  lang,
  t,
}) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const totalCheatsheets = Object.values(collectionsData).reduce(
    (acc, col) => acc + (col.items ? col.items.length : 0),
    0
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, isDesktop && styles.modalOverlayDesktop]}>
        <TouchableOpacity 
          style={StyleSheet.absoluteFill} 
          activeOpacity={1} 
          onPress={onClose} 
        />
        <View style={[styles.modalContent, isDesktop && styles.modalContentDesktop, { maxHeight: '90%' }]}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.modalTitle}>{t.aboutTitle}</Text>
              <View style={styles.versionBadge}>
                <Text style={styles.versionBadgeText}>v1.2.0</Text>
              </View>
            </View>
            <AnimatedIconButton
              style={styles.closeModalBtn}
              iconName="x"
              iconSize={20}
              animationType="spin90"
              onPress={onClose}
            />
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {/* ПАСПОРТ ПРИЛОЖЕНИЯ */}
            <View style={styles.aboutHeroCard}>
              <View style={styles.aboutHeroTop}>
                <Image
                  source={require('../../assets/logo.png')}
                  style={styles.aboutHeroLogo}
                  resizeMode="contain"
                />
                <Text style={styles.aboutHeroSubtitle}>{t.aboutSubtitle}</Text>
              </View>

              <View style={styles.techTagsRow}>
                <View style={styles.techTag}>
                  <Text style={styles.techTagText}>React Native 0.86</Text>
                </View>
                <View style={styles.techTag}>
                  <Text style={styles.techTagText}>Expo SDK 57</Text>
                </View>
                <View style={[styles.techTag, { backgroundColor: '#BBF7D0' }]}>
                  <Text style={styles.techTagText}>
                    {lang === 'uz' ? '100% Oflayn' : '100% Офлайн'}
                  </Text>
                </View>
                <View style={[styles.techTag, { backgroundColor: '#FED7AA' }]}>
                  <Text style={styles.techTagText}>
                    {lang === 'uz' ? 'Neobrutalizm' : 'Необрутализм'}
                  </Text>
                </View>
              </View>

              {/* Метрики */}
              <View style={styles.aboutStatsGrid}>
                <View style={styles.aboutStatCell}>
                  <Text style={styles.aboutStatNum}>{blitzQuestions.length}</Text>
                  <Text style={styles.aboutStatLabel}>{t.blitzTestsLabel}</Text>
                </View>
                <View style={styles.aboutStatCell}>
                  <Text style={styles.aboutStatNum}>{Object.keys(collectionsData).length}</Text>
                  <Text style={styles.aboutStatLabel}>{t.foldersLabel}</Text>
                </View>
                <View style={styles.aboutStatCell}>
                  <Text style={styles.aboutStatNum}>{totalCheatsheets}</Text>
                  <Text style={styles.aboutStatLabel}>{t.cheatsheetsLabel}</Text>
                </View>
              </View>
            </View>

            {/* КАРТОЧКА ОФИЦИАЛЬНОГО ТАЛИСМАНА */}
            <View style={styles.aboutSectionCard}>
              <View style={styles.aboutSectionHeader}>
                <AnimatedDotty size={20} animated={true} style={{ marginRight: 8 }} />
                <Text style={styles.aboutSectionTitle}>{t.mascotCardTitle}</Text>
              </View>

              <View style={styles.mascotShowcaseRow}>
                <View style={styles.mascotShowcaseBadge}>
                  <AnimatedDotty size={56} animated={true} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.mascotNameTitle}>{t.mascotName}</Text>
                  <Text style={styles.mascotDescBody}>{t.mascotCardDesc}</Text>
                </View>
              </View>
            </View>

            {/* АВТОРСТВО И ИНФОРМАЦИЯ */}
            <View style={[styles.aboutSectionCard, { backgroundColor: '#F4F4F5' }]}>
              <Text style={styles.creditsTitle}>
                {lang === 'uz' ? 'Stek & Spetsifikatsiya' : 'Стек & Спецификация'}
              </Text>
              <Text style={styles.creditsDesc}>
                {lang === 'uz'
                  ? `Dasturchi: Alisher\nDizayn tizimi: Pixel-Perfect Neo-Brutalism\nPlatforma: iPhone (Expo Go, LAN / Tunnel)\nLitsenziya: MIT Open Source (Cheklovlarsiz bepul)`
                  : `Разработчик: Alisher\nДизайн-система: Pixel-Perfect Neo-Brutalism\nПлатформа: Физический iPhone (Expo Go, LAN / Tunnel)\nЛицензия: MIT Open Source (Бесплатно навсегда)`
                }
              </Text>
            </View>

            {/* КНОПКА ЗАКРЫТЬ */}
            <AnimatedBrutalButton
              animationType="hop"
              style={[styles.modalSaveBtn, { backgroundColor: '#000', marginTop: 8 }]}
              onPress={onClose}
            >
              <Text style={[styles.modalSaveBtnText, { color: '#FFF' }]}>{t.backToMenuBtn}</Text>
            </AnimatedBrutalButton>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalOverlayDesktop: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 3.5,
    borderColor: '#000',
    borderBottomWidth: 0,
    padding: 24,
    paddingBottom: 24,
  },
  modalContentDesktop: {
    width: 540,
    maxWidth: '96%',
    borderRadius: 24,
    borderBottomWidth: 3.5,
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
    letterSpacing: -0.4,
  },
  versionBadge: {
    backgroundColor: '#FDE047',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    shadowColor: '#000',
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  versionBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
  },
  closeModalBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#F4F4F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aboutHeroCard: {
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
  aboutHeroTop: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    paddingBottom: 12,
    marginBottom: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E4E4E7',
  },
  aboutHeroLogo: {
    width: 210,
    height: 56,
    marginBottom: 6,
  },
  aboutHeroSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#52525B',
    textAlign: 'center',
    marginTop: 2,
  },
  techTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  techTag: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  techTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#000',
  },
  aboutStatsGrid: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    paddingVertical: 10,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  aboutStatCell: {
    alignItems: 'center',
  },
  aboutStatNum: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
  },
  aboutStatLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#71717A',
    marginTop: 2,
  },
  aboutSectionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#000',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  aboutSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  aboutSectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#000',
  },
  mascotShowcaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  mascotShowcaseBadge: {
    width: 68,
    height: 68,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#FEF08A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2.5, height: 2.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  mascotNameTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#000',
    marginBottom: 4,
  },
  mascotDescBody: {
    fontSize: 12,
    fontWeight: '600',
    color: '#52525B',
    lineHeight: 17,
  },
  creditsTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000',
    marginBottom: 6,
  },
  creditsDesc: {
    fontSize: 12,
    fontWeight: '600',
    color: '#52525B',
    lineHeight: 18,
  },
  modalSaveBtn: {
    backgroundColor: '#000000',
    borderWidth: 2.5,
    borderColor: '#000',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  modalSaveBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFF',
  },
});
