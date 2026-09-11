import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AnimatedIconButton from '../components/common/AnimatedIconButton';
import AnimatedDotty from '../components/common/AnimatedDotty';
import AnimatedChoiceButton from '../components/blitz/AnimatedChoiceButton';
import AnimatedBrutalButton from '../components/common/AnimatedBrutalButton';
import { MASCOT_TIPS } from '../constants/mascotTips';

// Метаданные категорий: цвета, бейджи и иконки
const CATEGORY_THEMES = {
  node: { name: 'Node.js', color: '#22C55E', icon: 'server', bg: '#DCFCE7' },
  nest: { name: 'NestJS', color: '#E11D48', icon: 'shield', bg: '#FFE4E6' },
  express: { name: 'Express', color: '#D97706', icon: 'zap', bg: '#FEF3C7' },
  react: { name: 'React', color: '#0284C7', icon: 'code', bg: '#E0F2FE' },
  nginx: { name: 'Nginx', color: '#059669', icon: 'shuffle', bg: '#D1FAE5' },
  postgres: { name: 'PostgreSQL', color: '#6366F1', icon: 'database', bg: '#EEF2FF' },
  docker: { name: 'Docker', color: '#0284C7', icon: 'box', bg: '#E0F2FE' },
  git: { name: 'Git', color: '#EA580C', icon: 'git-branch', bg: '#FFEDD5' },
  ts: { name: 'TypeScript', color: '#2563EB', icon: 'file-text', bg: '#DBEAFE' },
  linux: { name: 'Linux', color: '#CA8A04', icon: 'terminal', bg: '#FEF08A' },
};

export default function BlitzScreen({
  onBack,
  blitzQuestions,
  blitzIndex,
  combo,
  answeredState,
  handleAnswer,
  handleNextQuestion,
  lang,
  t,
}) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  // Локальная статистика текущей сессии
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [maxStreak, setMaxStreak] = useState(combo || 0);

  // Кастомная фраза маскота при клике
  const [customMascotTip, setCustomMascotTip] = useState(null);

  // Анимация подпрыгивания карточки и пульсации комбо
  const cardPopAnim = useRef(new Animated.Value(1)).current;
  const comboPulseAnim = useRef(new Animated.Value(1)).current;
  const mascotHopAnim = useRef(new Animated.Value(0)).current;

  const currentQ = blitzQuestions[blitzIndex] || blitzQuestions[0];
  const statement = lang === 'uz' && currentQ.s_uz ? currentQ.s_uz : currentQ.s;
  const categoryKey = (currentQ.cat || 'node').toLowerCase();
  const catTheme = CATEGORY_THEMES[categoryKey] || {
    name: categoryKey.toUpperCase(),
    color: '#8B5CF6',
    icon: 'code',
    bg: '#EDE9FE',
  };

  // Обновление рекорда серии и счетчиков
  useEffect(() => {
    if (combo > maxStreak) {
      setMaxStreak(combo);
    }
  }, [combo, maxStreak]);

  // Анимация пульсации при росте комбо
  useEffect(() => {
    if (combo > 0) {
      Animated.sequence([
        Animated.timing(comboPulseAnim, { toValue: 1.18, duration: 90, useNativeDriver: true }),
        Animated.spring(comboPulseAnim, { toValue: 1, friction: 3.5, tension: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [combo]);

  // Анимация появления новой карточки
  useEffect(() => {
    Animated.sequence([
      Animated.timing(cardPopAnim, { toValue: 0.97, duration: 50, useNativeDriver: true }),
      Animated.spring(cardPopAnim, { toValue: 1, friction: 5, tension: 160, useNativeDriver: true }),
    ]).start();
  }, [blitzIndex]);

  // Обработка ответа с обновлением сессионной статистики
  const onAnswerPress = (choice) => {
    if (answeredState !== null) return;
    const isCorrect = choice === currentQ.t;
    setSessionTotal((prev) => prev + 1);
    if (isCorrect) {
      setSessionCorrect((prev) => prev + 1);
    }
    handleAnswer(choice);
  };

  // Горячие клавиши на Web для аркадного темпа игры
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;

      if (e.key === 'ArrowLeft' || e.key === '1' || e.key.toLowerCase() === 'a') {
        if (answeredState === null) {
          onAnswerPress(0);
        }
      } else if (e.key === 'ArrowRight' || e.key === '2' || e.key.toLowerCase() === 'd') {
        if (answeredState === null) {
          onAnswerPress(1);
        }
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (answeredState !== null) {
          e.preventDefault();
          handleNextQuestion();
        }
      } else if (e.key === 'Escape') {
        if (onBack) onBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [answeredState, blitzIndex]);

  // Клик по маскоту — реакция и случайная цитата
  const handleMascotTap = () => {
    Animated.sequence([
      Animated.timing(mascotHopAnim, { toValue: -12, duration: 80, useNativeDriver: true }),
      Animated.spring(mascotHopAnim, { toValue: 0, friction: 3.5, tension: 200, useNativeDriver: true }),
    ]).start();

    const tips = MASCOT_TIPS[lang] || MASCOT_TIPS.ru;
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setCustomMascotTip(randomTip);
  };

  // Расчет точности ответов
  const accuracy = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 100;
  const progressPercent = Math.min(100, Math.round(((blitzIndex + 1) / blitzQuestions.length) * 100));

  // Динамическая реплика маскота
  const getMascotSpeech = () => {
    if (customMascotTip) return customMascotTip;
    if (answeredState) {
      return answeredState.isCorrect
        ? (lang === 'uz' ? 'Ajoyib! To\'g\'ri javob! 🔥' : '🎉 В точку! Отличная интуиция!')
        : (lang === 'uz' ? 'Xato bo\'ldi! Lekin bu muhim tajriba 💪' : '💡 Ошиблись? Не беда, запоминай панчлайн!');
    }
    if (combo >= 5) {
      return lang === 'uz' ? `🔥 QOYIL! x${combo} seriya! To'xtama!` : `🔥 БЕЗУМИЕ! x${combo} подряд! Ты машина кода! 🏆`;
    }
    if (combo >= 3) {
      return lang === 'uz' ? `⚡ Kuchli temp! x${combo} seriya!` : `⚡ Отличный разгон! x${combo} в серии!`;
    }
    if (combo >= 1) {
      return lang === 'uz' ? 'Yaxshi boshlanish! Davom et!' : 'Хорошее начало! Так держать!';
    }
    return lang === 'uz'
      ? 'Blits-Sprintga xush kelibsiz! Rostmi yoki Yolg\'on?'
      : 'Готов к спринту? Читай утверждение и жми ответ!';
  };

  return (
    <ScrollView
      style={styles.screenScroll}
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.mainConsole, isDesktop && styles.mainConsoleDesktop]}>
        
        {/* ==================================================================== */}
        {/* 1. ВЕРХНИЙ ХЕДЕР И НАВИГАЦИЯ                                          */}
        {/* ==================================================================== */}
        <View style={styles.headerRow}>
          <AnimatedIconButton
            style={styles.backButton}
            iconName="arrow-left"
            iconSize={22}
            animationType="nudge"
            onPress={onBack}
          />

          <View style={styles.titleBadge}>
            <AnimatedDotty size={20} animated={true} style={{ marginRight: 8 }} />
            <Text style={styles.titleBadgeText}>
              {t.feedScreenTitle || 'БЛИЦ-СПРИНТ'}
            </Text>
          </View>

          {/* КОМБО-СЕРИЯ С ОГНЕННОЙ АНИМАЦИЕЙ */}
          <Animated.View style={{ transform: [{ scale: comboPulseAnim }] }}>
            <View style={[styles.comboBadge, combo > 0 ? styles.comboActive : styles.comboIdle]}>
              <Feather
                name={combo > 0 ? 'zap' : 'activity'}
                size={15}
                color="#000"
                style={{ marginRight: 5 }}
              />
              <Text style={styles.comboBadgeText}>
                {combo > 0 ? `x${combo} 🔥` : 'x0'}
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* ==================================================================== */}
        {/* 2. ИНДИКАТОР ПРОГРЕССА И СТАТИСТИКА РАУНДА                          */}
        {/* ==================================================================== */}
        <View style={styles.progressContainer}>
          <View style={styles.progressMetaRow}>
            <View style={styles.progressLabelWrap}>
              <Text style={styles.progressLabelBold}>
                {t.questionLabel || 'ВОПРОС'} {blitzIndex + 1}
              </Text>
              <Text style={styles.progressLabelSub}> / {blitzQuestions.length}</Text>
            </View>

            <View style={styles.metaPillsRow}>
              {/* Точность */}
              <View style={styles.accuracyPill}>
                <Text style={styles.accuracyPillText}>🎯 {accuracy}%</Text>
              </View>

              {/* Тематика */}
              <View style={[styles.categoryPill, { backgroundColor: catTheme.bg, borderColor: '#000' }]}>
                <Feather name={catTheme.icon} size={11} color="#000" style={{ marginRight: 4 }} />
                <Text style={styles.categoryPillText}>{catTheme.name}</Text>
              </View>
            </View>
          </View>

          {/* Чанки-прогресс-бар Neo-Brutalism */}
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {/* ==================================================================== */}
        {/* 3. ДИНАМИЧЕСКИЙ ТАЛИСМАН ДОТТИ С ОБЛАЧКОМ РЕАКЦИИ                    */}
        {/* ==================================================================== */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleMascotTap}
          style={styles.mascotSpeechRow}
        >
          <Animated.View style={{ transform: [{ translateY: mascotHopAnim }] }}>
            <View style={styles.mascotAvatarBox}>
              <AnimatedDotty size={36} animated={true} />
            </View>
          </Animated.View>

          <View style={styles.speechBubble}>
            <View style={styles.speechTriangle} />
            <Text style={styles.speechBubbleText} numberOfLines={2}>
              {getMascotSpeech()}
            </Text>
          </View>
        </TouchableOpacity>

        {/* ==================================================================== */}
        {/* 4. ОСНОВНАЯ КАРТОЧКА ВОПРОСА (GAME FLASHCARD)                        */}
        {/* ==================================================================== */}
        <Animated.View style={{ transform: [{ scale: cardPopAnim }] }}>
          <View style={styles.cardContainer}>
            {/* Папочный ярлычок Neo-Brutalism с цветом категории */}
            <View style={[styles.folderTab, { backgroundColor: catTheme.color }]}>
              <Feather name={catTheme.icon} size={12} color="#000" style={{ marginRight: 5 }} />
              <Text style={styles.folderTabText}>{catTheme.name.toUpperCase()}</Text>
            </View>

            {/* Тело карточки */}
            <View style={styles.cardBody}>
              {/* Верхняя строка карточки */}
              <View style={styles.cardTopBar}>
                <View style={styles.modeBadge}>
                  <Text style={styles.modeBadgeText}>⚡ TRUE OR FALSE</Text>
                </View>

                <View style={styles.cardCounterPill}>
                  <Text style={styles.cardCounterText}>#{blitzIndex + 1}</Text>
                </View>
              </View>

              {/* Блок цитаты / утверждения */}
              <View style={styles.statementBox}>
                <View style={styles.quoteDecorLeft}>
                  <Text style={styles.quoteDecorChar}>“</Text>
                </View>

                <Text style={styles.statementText}>
                  {statement}
                </Text>

                <View style={styles.quoteDecorRight}>
                  <Text style={styles.quoteDecorChar}>”</Text>
                </View>
              </View>

              {/* ================================================================ */}
              {/* РЕЗУЛЬТАТ И РАЗБОР (ПОЯВЛЯЕТСЯ ПОСЛЕ ОТВЕТА)                      */}
              {/* ================================================================ */}
              {answeredState && (
                <View
                  style={[
                    styles.resultCard,
                    answeredState.isCorrect ? styles.resultCardSuccess : styles.resultCardDanger,
                  ]}
                >
                  <View style={styles.resultHeaderRow}>
                    <View
                      style={[
                        styles.resultIconCircle,
                        { backgroundColor: answeredState.isCorrect ? '#22C55E' : '#EF4444' },
                      ]}
                    >
                      <Feather
                        name={answeredState.isCorrect ? 'check' : 'x'}
                        size={16}
                        color="#FFFFFF"
                      />
                    </View>
                    <Text style={styles.resultHeaderTitle}>
                      {answeredState.isCorrect
                        ? (lang === 'uz' ? 'TO\'G\'RI! (+1 SERIYAGA)' : 'ВЕРНО! ПОБЕДА (+1 В СЕРИЮ)')
                        : (lang === 'uz' ? 'XATO! TO\'G\'RI JAVOB:' : 'ОШИБКА! РАЗБОР ОТВЕТА:')}
                    </Text>
                  </View>

                  <Text style={styles.punchlineText}>
                    {answeredState.punchline}
                  </Text>

                  <AnimatedBrutalButton
                    animationType="hop"
                    style={styles.nextQuestionBtn}
                    onPress={handleNextQuestion}
                  >
                    <Text style={styles.nextQuestionBtnText}>
                      {t.nextQuestionBtn || 'Следующий вопрос'} →
                    </Text>
                    {Platform.OS === 'web' && (
                      <View style={styles.keycapHint}>
                        <Text style={styles.keycapText}>SPACE</Text>
                      </View>
                    )}
                  </AnimatedBrutalButton>
                </View>
              )}

              {/* ================================================================ */}
              {/* КНОПКИ ВЫБОРА (ЛОЖЬ / ПРАВДА)                                    */}
              {/* ================================================================ */}
              {!answeredState && (
                <View style={styles.choiceButtonsRow}>
                  <AnimatedChoiceButton
                    type="false"
                    disabled={false}
                    onPress={() => onAnswerPress(0)}
                    title={t.falseBtn || 'ЛОЖЬ'}
                    subtitle={t.falseSub || 'НЕ ПОМНЮ'}
                    hotkey={Platform.OS === 'web' ? '[ 1 / ← ]' : null}
                  />
                  <AnimatedChoiceButton
                    type="true"
                    disabled={false}
                    onPress={() => onAnswerPress(1)}
                    title={t.trueBtn || 'ПРАВДА'}
                    subtitle={t.trueSub || 'ПОМНЮ'}
                    hotkey={Platform.OS === 'web' ? '[ 2 / → ]' : null}
                  />
                </View>
              )}
            </View>
          </View>
        </Animated.View>

        {/* ==================================================================== */}
        {/* 5. ПОДВАЛ И ШПАРГАЛКА ПО КЛАВИШАМ                                    */}
        {/* ==================================================================== */}
        <View style={styles.footerHud}>
          {Platform.OS === 'web' ? (
            <View style={styles.hotkeysRow}>
              <Text style={styles.hotkeysTitle}>⌨️ КЛАВИШИ:</Text>
              <View style={styles.hotkeyTag}><Text style={styles.hotkeyTagText}>← Ложь</Text></View>
              <View style={styles.hotkeyTag}><Text style={styles.hotkeyTagText}>→ Правда</Text></View>
              <View style={styles.hotkeyTag}><Text style={styles.hotkeyTagText}>Пробел Далее</Text></View>
              <View style={styles.hotkeyTag}><Text style={styles.hotkeyTagText}>Esc Выход</Text></View>
            </View>
          ) : (
            <View style={styles.mobileHudInfo}>
              <Feather name="award" size={14} color="#000" style={{ marginRight: 6 }} />
              <Text style={styles.mobileHudText}>
                {lang === 'uz' ? 'Eng yaxshi seriya: ' : 'Рекорд серии: '}
                <Text style={{ fontWeight: '900' }}>x{maxStreak}</Text>
                {'  •  '}
                {lang === 'uz' ? 'To\'g\'ri: ' : 'Верно: '}
                <Text style={{ fontWeight: '900' }}>{sessionCorrect}</Text>
              </Text>
            </View>
          )}
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenScroll: {
    flex: 1,
    backgroundColor: '#FDFCF7',
  },
  screenContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  mainConsole: {
    width: '100%',
    maxWidth: 680,
  },
  mainConsoleDesktop: {
    maxWidth: 740,
    paddingTop: 10,
  },

  // Хедер
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
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
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDE047',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 2.5, height: 2.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  titleBadgeText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.5,
  },
  comboBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 2.5, height: 2.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  comboIdle: {
    backgroundColor: '#FFFFFF',
  },
  comboActive: {
    backgroundColor: '#FB923C',
  },
  comboBadgeText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000',
  },

  // Прогресс
  progressContainer: {
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  progressMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabelWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  progressLabelBold: {
    fontSize: 13,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.3,
  },
  progressLabelSub: {
    fontSize: 12,
    fontWeight: '800',
    color: '#71717A',
  },
  metaPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accuracyPill: {
    backgroundColor: '#FEF08A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#000',
  },
  accuracyPillText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#000',
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#000',
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#000',
  },
  progressBarTrack: {
    height: 12,
    backgroundColor: '#E4E4E7',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#000',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 4,
  },

  // Маскот и облачко речи
  mascotSpeechRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  mascotAvatarBox: {
    width: 46,
    height: 46,
    backgroundColor: '#FEF08A',
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  speechBubble: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    position: 'relative',
  },
  speechTriangle: {
    position: 'absolute',
    left: -7,
    top: 14,
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderTopColor: 'transparent',
    borderBottomWidth: 5,
    borderBottomColor: 'transparent',
    borderRightWidth: 7,
    borderRightColor: '#000',
  },
  speechBubbleText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#18181B',
    lineHeight: 16,
  },

  // Карточка вопроса
  cardContainer: {
    marginBottom: 14,
  },
  folderTab: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 2.5,
    borderColor: '#000',
    borderBottomWidth: 0,
    marginBottom: -2.5,
    marginLeft: 12,
    zIndex: 2,
  },
  folderTabText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.5,
  },
  cardBody: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#000',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  cardTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modeBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#000',
  },
  modeBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#312E81',
    letterSpacing: 0.5,
  },
  cardCounterPill: {
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#000',
  },
  cardCounterText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#000',
  },

  // Поле вопроса
  statementBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#000',
    paddingVertical: 22,
    paddingHorizontal: 18,
    marginBottom: 18,
    position: 'relative',
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteDecorLeft: {
    position: 'absolute',
    top: 2,
    left: 8,
  },
  quoteDecorRight: {
    position: 'absolute',
    bottom: -14,
    right: 8,
  },
  quoteDecorChar: {
    fontSize: 32,
    fontWeight: '900',
    color: '#CBD5E1',
    lineHeight: 32,
  },
  statementText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#09090B',
    lineHeight: 29,
    textAlign: 'center',
    letterSpacing: -0.3,
  },

  // Кнопки Ложь / Правда
  choiceButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 4,
  },

  // Результат ответа
  resultCard: {
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: '#000',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  resultCardSuccess: {
    backgroundColor: '#DCFCE7',
  },
  resultCardDanger: {
    backgroundColor: '#FEE2E2',
  },
  resultHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  resultHeaderTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.3,
  },
  punchlineText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#18181B',
    lineHeight: 20,
    marginBottom: 14,
  },
  nextQuestionBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  nextQuestionBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  keycapHint: {
    backgroundColor: '#3F3F46',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#71717A',
  },
  keycapText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#E4E4E7',
    letterSpacing: 0.5,
  },

  // Нижний HUD
  footerHud: {
    marginTop: 8,
    alignItems: 'center',
  },
  hotkeysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
  },
  hotkeysTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#71717A',
    marginRight: 4,
  },
  hotkeyTag: {
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000',
  },
  hotkeyTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000',
  },
  mobileHudInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#000',
  },
  mobileHudText: {
    fontSize: 11,
    color: '#3F3F46',
  },
});
