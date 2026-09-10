import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AnimatedIconButton from '../components/common/AnimatedIconButton';
import AnimatedDotty from '../components/common/AnimatedDotty';
import AnimatedChoiceButton from '../components/blitz/AnimatedChoiceButton';
import AnimatedBrutalButton from '../components/common/AnimatedBrutalButton';

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
  const currentQ = blitzQuestions[blitzIndex] || blitzQuestions[0];
  const statement = lang === 'uz' && currentQ.s_uz ? currentQ.s_uz : currentQ.s;

  return (
    <View style={styles.feedScreen}>
      {/* ХЕДЕР БЛИЦА */}
      <View style={styles.feedHeader}>
        <AnimatedIconButton
          style={styles.brutalIconButton}
          iconName="arrow-left"
          iconSize={20}
          animationType="nudge"
          onPress={onBack}
        />

        <View style={styles.feedTitleBadge}>
          <AnimatedDotty size={18} animated={true} style={{ marginRight: 6 }} />
          <Text style={styles.feedTitleText}>{t.feedScreenTitle}</Text>
        </View>

        <View style={styles.comboBadge}>
          <Feather name="zap" size={13} color="#000" style={{ marginRight: 4 }} />
          <Text style={styles.comboText}>x{combo}</Text>
        </View>
      </View>

      {/* КАРТОЧКА ВОПРОСА */}
      <View style={styles.feedCardWrapper}>
        <View style={[styles.folderTab, { backgroundColor: '#22C55E', width: 90 }]} />

        <View style={styles.feedCardBody}>
          <View style={styles.feedQuestionTop}>
            <View style={styles.techTag}>
              <Text style={styles.techTagText}>
                {(currentQ.cat || 'JS').toUpperCase()}
              </Text>
            </View>
            <Text style={styles.feedCounterText}>
              {blitzIndex + 1} {t.ofLabel} {blitzQuestions.length}
            </Text>
          </View>

          <Text style={styles.feedQuestionStatement}>
            "{statement}"
          </Text>

          {answeredState && (
            <View
              style={[
                styles.resultBanner,
                answeredState.isCorrect ? styles.resultCorrect : styles.resultWrong,
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Feather
                  name={answeredState.isCorrect ? "check-circle" : "alert-circle"}
                  size={16}
                  color="#000000"
                  style={{ marginRight: 8, marginTop: 2 }}
                />
                <Text style={[styles.resultText, { flex: 1 }]}>{answeredState.punchline}</Text>
              </View>
              <AnimatedBrutalButton
                animationType="hop"
                style={styles.nextBtnBrutal}
                onPress={handleNextQuestion}
              >
                <Text style={styles.nextBtnText}>{t.nextQuestionBtn}</Text>
              </AnimatedBrutalButton>
            </View>
          )}
        </View>
      </View>

      {/* КНОПКИ ВЫБОРА: ЛОЖЬ / ПРАВДА */}
      <View style={styles.feedDecisionRow}>
        <AnimatedChoiceButton
          type="false"
          disabled={answeredState !== null}
          onPress={() => handleAnswer(0)}
          title={t.falseBtn}
          subtitle={t.falseSub}
        />
        <AnimatedChoiceButton
          type="true"
          disabled={answeredState !== null}
          onPress={() => handleAnswer(1)}
          title={t.trueBtn}
          subtitle={t.trueSub}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  feedScreen: {
    flex: 1,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
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
  feedTitleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDE047',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  feedTitleText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000',
  },
  comboBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  comboText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000',
  },
  feedCardWrapper: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 14,
  },
  folderTab: {
    height: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderWidth: 2.5,
    borderColor: '#000000',
    borderBottomWidth: 0,
    marginBottom: -2,
    marginLeft: 8,
    zIndex: 1,
  },
  feedCardBody: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 3,
    borderColor: '#000',
    padding: 20,
    minHeight: 280,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  feedQuestionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  techTag: {
    backgroundColor: '#E0E7FF',
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  techTagText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#000',
  },
  feedCounterText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#71717A',
  },
  feedQuestionStatement: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
    lineHeight: 28,
    textAlign: 'center',
    marginVertical: 20,
    letterSpacing: -0.4,
  },
  resultBanner: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  resultCorrect: {
    backgroundColor: '#DCFCE7',
  },
  resultWrong: {
    backgroundColor: '#FEE2E2',
  },
  resultText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
    lineHeight: 18,
    marginBottom: 10,
  },
  nextBtnBrutal: {
    backgroundColor: '#000000',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  feedDecisionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
  },
});
