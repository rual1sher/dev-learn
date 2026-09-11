import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
  Platform,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AnimatedIconButton from '../components/common/AnimatedIconButton';
import AnimatedLangToggle from '../components/common/AnimatedLangToggle';
import AnimatedDotty from '../components/common/AnimatedDotty';
import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';
import AnimatedFolderCard from '../components/home/AnimatedFolderCard';
import { MASCOT_TIPS } from '../constants/mascotTips';

export default function HomeScreen({
  filteredCards,
  searchQuery,
  setSearchQuery,
  onOpenSettings,
  onOpenAddModal,
  onSelectFolder,
  lang,
  switchLanguage,
  t,
  mascotHop,
  handleMascotPress,
  showMascotBubble,
  setShowMascotBubble,
  mascotTipIndex,
}) {
  const { width } = useWindowDimensions();
  const [gridWidth, setGridWidth] = useState(0);

  // На больших экранах по 4 в ряд, на mobile по 2
  const isDesktop = width >= 768;
  const numColumns = isDesktop ? 4 : 2;
  const colGap = isDesktop ? 16 : 12;
  const totalGap = (numColumns - 1) * colGap;

  const paddingH = isDesktop ? 36 : 22;
  const estimatedContainerWidth = (Platform.OS === 'web' ? Math.min(width, 1160) : width) - paddingH * 2;
  const nativeCardWidth = gridWidth > 0
    ? Math.floor((gridWidth - totalGap) / numColumns)
    : Math.floor((estimatedContainerWidth - totalGap) / numColumns);

  // На Web используем точный CSS calc, занимающий ровно 100% ширины ряда без пустот
  const cardWidth = Platform.OS === 'web'
    ? `calc((100% - ${totalGap}px) / ${numColumns})`
    : nativeCardWidth;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.scrollContent,
        isDesktop && { paddingHorizontal: 36, paddingTop: 16 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* ТОП-БАР НАВИГАЦИИ С НЕО-БРУТАЛЬНЫМ БЕЙДЖЕМ И DEV.LEARN */}
      <View style={styles.topNavRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setSearchQuery('')}
          style={styles.brandLogoTouch}
        >
          <Image
            source={require('../../assets/logo-badge.png')}
            style={styles.brandBadgeImg}
            resizeMode="contain"
          />
          <View style={styles.brandTextWrapper}>
            <Text style={styles.brandTextMain}>
              dev<Text style={styles.brandTextDot}>.</Text>learn
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.topNavRightGroup}>
          {/* ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКА (RU / UZ) С АНИМАЦИЕЙ */}
          <AnimatedLangToggle
            lang={lang}
            onToggle={switchLanguage}
          />

          {/* Настройки */}
          <AnimatedIconButton
            style={[styles.brutalIconButton, { marginLeft: 10 }]}
            iconName="settings"
            iconSize={20}
            animationType="spin"
            onPress={onOpenSettings}
          />
        </View>
      </View>

      {/* ГЛАВНЫЙ ЗАГОЛОВОК И ТАЛИСМАН ПЛАТФОРМЫ */}
      <View style={styles.heroTitleContainer}>
        <View style={styles.heroTitleRow}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.heroTitleLine1}>{t.heroLine1}</Text>
            <Text style={styles.heroTitleLine2}>{t.heroLine2}</Text>
          </View>

          {/* ИНТЕРАКТИВНЫЙ ТАЛИСМАН ДЛЯ ПЛАТФОРМЫ */}
          <TouchableOpacity
            style={styles.heroMascotButton}
            activeOpacity={0.85}
            onPress={handleMascotPress}
          >
            <Animated.View style={{ transform: [{ translateY: mascotHop }] }}>
              <AnimatedDotty size={48} animated={true} />
            </Animated.View>
            <View style={styles.mascotPill}>
              <Text style={styles.mascotPillText}>DOTTY</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* СПИЧ-БАББЛ СОВЕТА ОТ ТАЛИСМАНА */}
        {showMascotBubble && (
          <View style={styles.mascotSpeechBubble}>
            <View style={styles.bubbleHeader}>
              <View style={styles.bubbleTag}>
                <Text style={styles.bubbleTagText}>{t.mascotTipTitle}</Text>
              </View>
              <TouchableOpacity 
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={() => setShowMascotBubble(false)}
              >
                <Feather name="x" size={14} color="#000" />
              </TouchableOpacity>
            </View>
            <Text style={styles.bubbleText}>
              {MASCOT_TIPS[lang][mascotTipIndex]}
            </Text>
          </View>
        )}
      </View>

      {/* ИНПУТ СИМВОЛ # + ЖЕЛТАЯ КНОПКА + */}
      <View style={styles.searchRow}>
        <SearchBar
          style={{ flex: 1, marginBottom: 0, marginRight: 10 }}
          iconType="hash"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t.searchPlaceholder}
        />

        {/* Желтая кнопка "+" открывает добавление */}
        <AnimatedIconButton
          style={styles.yellowAddButton}
          iconName="plus"
          iconSize={26}
          animationType="bounce"
          onPress={onOpenAddModal}
        />
      </View>

      {/* СЕКЦИЯ КОЛЛЕКЦИЙ */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeading}>{t.collectionsHeading}</Text>
        <Text style={styles.sectionCountText}>{filteredCards.length} {t.foldersCount}</Text>
      </View>

      {/* СЕТКА ПАПОК 2 КОЛОНКИ ИЛИ ЕДИНЫЙ EMPTY STATE С DOTTY */}
      {filteredCards.length === 0 ? (
        <EmptyState
          title={lang === 'uz' ? 'Hech narsa topilmadi' : 'Ничего не найдено'}
          subtitle={lang === 'uz'
            ? "Dotti qidirdi, lekin bunday mavzu yo'q. Qidiruv so'zini o'zgartiring!"
            : "Дотти искал, но такой темы нет. Попробуй изменить запрос!"}
          onReset={searchQuery ? () => setSearchQuery('') : null}
          resetLabel={lang === 'uz' ? "Qidiruvni tozalash" : "Сбросить поиск"}
        />
      ) : (
        <View
          onLayout={(e) => {
            const w = e.nativeEvent.layout.width;
            if (w > 0 && Math.abs(w - gridWidth) > 1) {
              setGridWidth(w);
            }
          }}
          style={[styles.cardsGrid, { columnGap: colGap, rowGap: 18 }]}
        >
          {filteredCards.map((item) => (
            <AnimatedFolderCard
              key={item.id}
              item={item}
              lang={lang}
              cardWidth={cardWidth}
              onPress={() => onSelectFolder(item.id)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 36,
  },
  topNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  brandLogoTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  brandBadgeImg: {
    width: 32,
    height: 40,
    marginRight: 9,
  },
  brandTextWrapper: {
    justifyContent: 'center',
  },
  brandTextMain: {
    fontSize: 22,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -0.6,
  },
  brandTextDot: {
    color: '#EAB308',
  },
  topNavRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
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
  heroTitleContainer: {
    marginBottom: 20,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroTitleLine1: {
    fontSize: 34,
    fontWeight: '900',
    color: '#000000',
    lineHeight: 38,
    letterSpacing: -0.8,
  },
  heroTitleLine2: {
    fontSize: 34,
    fontWeight: '900',
    color: '#000000',
    lineHeight: 38,
    letterSpacing: -0.8,
  },
  heroMascotButton: {
    alignItems: 'center',
    backgroundColor: '#FDE047',
    borderWidth: 2.5,
    borderColor: '#000000',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  mascotPill: {
    backgroundColor: '#000000',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  mascotPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  mascotSpeechBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 12,
    padding: 10,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 2.5, height: 2.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  bubbleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  bubbleTag: {
    backgroundColor: '#FDE047',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  bubbleTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000',
  },
  bubbleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#18181B',
    lineHeight: 17,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  inputBox: {
    flex: 1,
    height: 52,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  hashSymbol: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000000',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  yellowAddButton: {
    width: 52,
    height: 52,
    backgroundColor: '#FFD02F',
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -0.3,
  },
  sectionCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#71717A',
  },
  cardsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  emptyMascotBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D4D4D8',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  emptyMascotTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
    marginBottom: 6,
  },
  emptyMascotSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#71717A',
    textAlign: 'center',
    lineHeight: 18,
  },
});
