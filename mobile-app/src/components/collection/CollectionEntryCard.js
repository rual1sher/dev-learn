import React, { memo } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AnimatedCopyButton from '../common/AnimatedCopyButton';
import AnimatedBrutalButton from '../common/AnimatedBrutalButton';

// Цветовая палитра бейджей по категориям
const getTagColor = (tag = '') => {
  const t = (tag || '').toLowerCase();
  if (t.includes('linux') || t.includes('devops')) return '#E0F2FE';
  if (t.includes('nginx') || t.includes('docker')) return '#DCFCE7';
  if (t.includes('react') || t.includes('rn')) return '#CFFAFE';
  if (t.includes('node') || t.includes('nest')) return '#FEF3C7';
  if (t.includes('type') || t.includes('js')) return '#FEF9C3';
  if (t.includes('sql') || t.includes('db') || t.includes('data')) return '#FCE7F3';
  if (t.includes('arch') || t.includes('design') || t.includes('scale') || t.includes('road')) return '#EDE9FE';
  if (t.includes('sec')) return '#FFE4E6';
  if (t.includes('tool') || t.includes('web') || t.includes('doc')) return '#FFEDD5';
  if (t.includes('phrase') || t.includes('engl') || t.includes('ibora') || t.includes('muloqot') || t.includes('sleng')) return '#F3E8FF';
  return '#F3F4F6';
};

/**
 * CollectionEntryCard — мемоизированная карточка единицы знаний внутри папки коллекций.
 * Поддерживает: команды терминала, код, архитектурные тезисы, фразы IT English, тулзы и новости.
 */
function CollectionEntryCard({
  item,
  lang = 'ru',
  t = {},
  onCopySnippet,
  onOpenUrl,
}) {
  const tagBg = getTagColor(item.tag);
  const isUz = lang === 'uz';

  return (
    <View style={styles.entryCard}>
      {/* 1. Верхний ряд: Название и Тэг */}
      <View style={styles.entryTopRow}>
        <Text style={styles.entryTitle}>
          {item.title}
        </Text>
        {item.tag ? (
          <View style={[styles.entryTagBadge, { backgroundColor: tagBg }]}>
            <Text style={styles.entryTagText}>
              {item.tag}
            </Text>
          </View>
        ) : null}
      </View>

      {/* 2. IT English: Выделенная английская фраза */}
      {item.phrase ? (
        <View style={styles.phraseCallout}>
          <View style={styles.phraseHeader}>
            <Feather name="message-circle" size={13} color="#7C3AED" style={{ marginRight: 6 }} />
            <Text style={styles.phraseHeaderLabel}>
              {isUz ? 'Inglizcha professional ibora:' : 'Английская фраза:'}
            </Text>
          </View>
          <Text style={styles.phraseText}>"{item.phrase}"</Text>
        </View>
      ) : null}

      {/* 3. Описание / Суть темы */}
      {item.desc ? (
        <Text style={styles.conceptText}>
          {item.desc}
        </Text>
      ) : null}

      {/* 4. Чеклист тезисов (для архитектуры и Roadmap) */}
      {item.points && item.points.length > 0 ? (
        <View style={styles.pointsList}>
          {item.points.map((point, idx) => (
            <View key={idx} style={styles.pointRow}>
              <Feather name="check" size={13} color="#16A34A" style={styles.pointIcon} />
              <Text style={styles.pointText}>{point}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* 5. Блок кода или терминала */}
      {item.code ? (
        <View style={styles.codeSnippetContainer}>
          <View style={styles.codeSnippetHeader}>
            <Feather
              name={item.type === 'command' ? 'terminal' : 'code'}
              size={13}
              color="#334155"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.codeSnippetHeaderTitle}>
              {item.type === 'command'
                ? (isUz ? "Terminal buyrug'i" : 'Команда терминала')
                : (isUz ? 'Kod namunasi' : 'Пример реализации')}
            </Text>
          </View>
          <View style={styles.codeSnippetBox}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Text style={styles.snippetText}>{item.code}</Text>
            </ScrollView>
          </View>
        </View>
      ) : null}

      {/* 6. Кнопки действий: внешняя ссылка и копирование */}
      {(item.url || item.code || item.phrase) ? (
        <View style={styles.actionsRow}>
          {item.url && onOpenUrl ? (
            <AnimatedBrutalButton
              animationType="hop"
              style={styles.openUrlBtn}
              onPress={() => onOpenUrl(item.url)}
            >
              <Feather name="external-link" size={13} color="#000" style={{ marginRight: 6 }} />
              <Text style={styles.openUrlText}>
                {item.type === 'news'
                  ? (t.readSourceBtn || 'Читать источник')
                  : (t.openServiceBtn || 'Открыть сервис')}
              </Text>
            </AnimatedBrutalButton>
          ) : null}

          {item.url && !item.code && !item.phrase && onCopySnippet ? (
            <AnimatedCopyButton
              style={styles.compactCopyBtn}
              label={t.copyLinkBtn || 'Скопировать ссылку'}
              textStyle={styles.compactCopyText}
              onPress={() => onCopySnippet(item.url)}
            />
          ) : null}

          {item.code && onCopySnippet ? (
            <AnimatedCopyButton
              style={styles.compactCopyBtn}
              label={item.type === 'command'
                ? (t.copyCommandBtn || 'Скопировать команду')
                : (t.copyCodeBtn || 'Скопировать код')}
              textStyle={styles.compactCopyText}
              onPress={() => onCopySnippet(item.code)}
            />
          ) : null}

          {item.phrase && onCopySnippet ? (
            <AnimatedCopyButton
              style={styles.compactCopyBtn}
              label={t.copyPhraseBtn || 'Скопировать фразу'}
              textStyle={styles.compactCopyText}
              onPress={() => onCopySnippet(item.phrase)}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: '#000000',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 3.5, height: 3.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  entryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  entryTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '900',
    color: '#000000',
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  entryTagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  entryTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000000',
  },
  phraseCallout: {
    backgroundColor: '#F3E8FF',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
    padding: 12,
    marginBottom: 10,
  },
  phraseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  phraseHeaderLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#6B21A8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  phraseText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E1B4B',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  conceptText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#27272A',
    lineHeight: 19,
    marginBottom: 12,
  },
  pointsList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#000000',
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pointIcon: {
    marginTop: 2,
    marginRight: 8,
  },
  pointText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 17,
  },
  codeSnippetContainer: {
    marginBottom: 12,
  },
  codeSnippetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  codeSnippetHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  codeSnippetBox: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
    padding: 12,
  },
  snippetText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#38BDF8',
    lineHeight: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  openUrlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#38BDF8',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  openUrlText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#000000',
  },
  compactCopyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF08A',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  compactCopyText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#000000',
  },
});

export default memo(CollectionEntryCard);
