import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  useWindowDimensions,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AnimatedIconButton from '../components/common/AnimatedIconButton';
import AnimatedDotty from '../components/common/AnimatedDotty';
import AnimatedSettingsLangBtn from '../components/common/AnimatedSettingsLangBtn';
import AnimatedBrutalButton from '../components/common/AnimatedBrutalButton';

export default function SettingsModal({
  visible,
  onClose,
  collectionsData,
  combo,
  onResetStreak,
  onOpenAbout,
  lang,
  switchLanguage,
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
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t.settingsTitle}</Text>
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
            bounces={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {/* СТАТИСТИКА И ТАЛИСМАН */}
            <View style={styles.settingsStatsBox}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.settingsStatsTitle}>{t.developerProfile}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <Feather name="zap" size={13} color="#000" style={{ marginRight: 5 }} />
                    <Text style={styles.settingsStatsSubtitle}>{t.streakRecord} x{combo}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                    <Feather name="book-open" size={13} color="#000" style={{ marginRight: 5 }} />
                    <Text style={styles.settingsStatsSubtitle}>
                      {lang === 'uz' ? "To'plamlardagi shpargalkalar: " : 'Шпаргалок в коллекциях: '}{totalCheatsheets}
                    </Text>
                  </View>
                </View>
                <View style={styles.settingsMascotMiniBadge}>
                  <AnimatedDotty size={34} animated={true} />
                </View>
              </View>
            </View>

            {/* ВЫБОР ЯЗЫКА (TILNI TANLASH) */}
            <View style={styles.settingsLangCard}>
              <Text style={styles.settingsLangHeader}>{t.langSectionTitle}</Text>
              <View style={styles.settingsLangRow}>
                <AnimatedSettingsLangBtn
                  code="RU"
                  label="Русский"
                  isActive={lang === 'ru'}
                  onPress={() => switchLanguage('ru')}
                />
                <AnimatedSettingsLangBtn
                  code="UZ"
                  label="O'zbekcha"
                  isActive={lang === 'uz'}
                  onPress={() => switchLanguage('uz')}
                />
              </View>
              <View style={styles.settingsLangActiveNote}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Feather name="check-circle" size={12} color="#16A34A" style={{ marginRight: 5 }} />
                  <Text style={styles.settingsLangActiveNoteText}>
                    {lang === 'ru' ? 'Интерфейс: Русский (активен)' : "Interfeys: O'zbekcha (faol)"}
                  </Text>
                </View>
              </View>
            </View>

            {/* О ПРИЛОЖЕНИИ */}
            <AnimatedIconButton 
              style={styles.settingsRowBtn}
              iconName="info"
              iconSize={18}
              animationType="bounce"
              onPress={() => {
                onClose();
                onOpenAbout();
              }}
            >
              <Text style={[styles.settingsRowBtnText, { marginLeft: 10 }]}>{t.aboutAppBtn}</Text>
            </AnimatedIconButton>

            {/* СБРОС СЧЕТЧИКА */}
            <AnimatedIconButton 
              style={styles.settingsRowBtn}
              iconName="refresh-cw"
              iconSize={18}
              animationType="spin"
              onPress={() => {
                onResetStreak();
                Alert.alert('OK', t.streakResetAlert);
              }}
            >
              <Text style={[styles.settingsRowBtnText, { marginLeft: 10 }]}>{t.resetFeedStreakBtn}</Text>
            </AnimatedIconButton>

            <View style={styles.settingsFooterBrand}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.settingsFooterLogo}
                resizeMode="contain"
              />
              <Text style={styles.settingsFooterBrandText}>
                DevLearn Platform • {lang === 'uz' ? "Bilimlar to'plami" : 'База знаний для разработчиков'}
              </Text>
            </View>

            <AnimatedBrutalButton
              animationType="hop"
              style={[styles.modalSaveBtn, { backgroundColor: '#000' }]}
              onPress={onClose}
            >
              <Text style={[styles.modalSaveBtnText, { color: '#FFF' }]}>{t.closeBtn}</Text>
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
    width: 520,
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
  settingsStatsBox: {
    backgroundColor: '#FDE047',
    borderWidth: 2.5,
    borderColor: '#000',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  settingsStatsTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#000',
    marginBottom: 4,
  },
  settingsStatsSubtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#18181B',
    marginTop: 2,
  },
  settingsMascotMiniBadge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    padding: 4,
  },
  settingsLangCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 2.5, height: 2.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  settingsLangHeader: {
    fontSize: 13,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 8,
  },
  settingsLangRow: {
    flexDirection: 'row',
    gap: 8,
  },
  settingsLangActiveNote: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#FEF9C3',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FACC15',
    alignItems: 'center',
  },
  settingsLangActiveNoteText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#854D0E',
  },
  settingsRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  settingsRowBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#000',
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
  settingsFooterBrand: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 6,
    paddingVertical: 8,
  },
  settingsFooterLogo: {
    width: 140,
    height: 38,
    marginBottom: 6,
  },
  settingsFooterBrandText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#71717A',
  },
});
