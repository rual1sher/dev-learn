import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AnimatedIconButton from '../components/common/AnimatedIconButton';
import AnimatedCopyButton from '../components/common/AnimatedCopyButton';
import AnimatedBrutalButton from '../components/common/AnimatedBrutalButton';
import { handleOpenUrl } from '../utils/helpers';

// Цветовые акценты бейджей по категориям и тегам
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

// Интеллектуальный резолвер карточек (поддержка структурированных данных и легаси)
const resolveCardData = (entry, lang) => {
  const isUz = lang === 'uz';
  const title = isUz && entry.title_uz ? entry.title_uz : entry.title;
  const tag = isUz && entry.tag_uz ? entry.tag_uz : entry.tag;
  const desc = isUz && entry.desc_uz ? entry.desc_uz : (entry.desc || null);
  const code = isUz && entry.code_uz ? entry.code_uz : (entry.code || null);
  const phrase = isUz && entry.phrase_uz ? entry.phrase_uz : (entry.phrase || null);
  const url = entry.url || null;
  const points = isUz && entry.points_uz ? entry.points_uz : (entry.points || null);

  let finalDesc = desc;
  let finalCode = code;
  let finalUrl = url;
  let finalPhrase = phrase;
  let finalType = entry.type || null;

  // Если у записи старый формат с одним общим snippet
  if (!finalDesc && !finalCode && !finalPhrase && entry.snippet) {
    const raw = isUz && entry.snippet_uz ? entry.snippet_uz : entry.snippet;
    const isNewsLike = (
      entry.type === 'news' ||
      raw.startsWith('•') ||
      raw.includes('• ') ||
      (tag && ['новости', 'дайджест', 'news', 'yangilik', 'dayjest', 'ekotizim', 'trends'].includes(tag.toLowerCase()))
    );

    if (isNewsLike) {
      finalType = 'news';
      if (raw.includes('http://') || raw.includes('https://')) {
        const urlMatch = raw.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
          finalUrl = urlMatch[0];
          finalDesc = raw.replace(urlMatch[0], '').replace(/^[—\s-]+|[—\s-]+$/g, '').trim();
        } else {
          finalDesc = raw;
        }
      } else {
        finalDesc = raw;
      }
    } else if (raw.startsWith('http://') || raw.startsWith('https://')) {
      const parts = raw.split(' — ');
      if (parts.length > 1) {
        finalUrl = parts[0].trim();
        finalDesc = parts[1].trim();
      } else {
        finalUrl = raw.trim();
      }
      finalType = 'tool';
    } else if (raw.startsWith('"') && raw.includes(' = ')) {
      const parts = raw.split(' = ');
      finalPhrase = parts[0].replace(/^"|"$/g, '').trim();
      finalDesc = parts[1].trim();
      finalType = 'phrase';
    } else if (
      !raw.includes('•') && (
        raw.startsWith('sudo ') ||
        raw.startsWith('docker ') ||
        raw.startsWith('git ') ||
        raw.startsWith('curl ') ||
        raw.startsWith('journalctl ') ||
        raw.startsWith('location ') ||
        raw.startsWith('gzip ') ||
        raw.startsWith('ssh ') ||
        raw.startsWith('ss ') ||
        raw.startsWith('du ') ||
        raw.startsWith('type ') ||
        raw.startsWith('const ') ||
        raw.startsWith('let ') ||
        raw.startsWith('export ') ||
        raw.startsWith('@') ||
        raw.startsWith('0.1 + 0.2') ||
        raw.startsWith('function ') ||
        raw.startsWith('class ') ||
        raw.startsWith('SELECT ') ||
        raw.startsWith('CREATE ') ||
        raw.includes('=>')
      )
    ) {
      finalCode = raw;
      finalType = (
        raw.startsWith('sudo') ||
        raw.startsWith('docker') ||
        raw.startsWith('git') ||
        raw.startsWith('curl') ||
        raw.startsWith('journalctl') ||
        raw.startsWith('ss ') ||
        raw.startsWith('ssh ') ||
        raw.startsWith('du ')
      ) ? 'command' : 'code';
    } else {
      finalDesc = raw;
      finalType = 'concept';
    }
  }

  if (!finalType) {
    if (finalPhrase) finalType = 'phrase';
    else if (finalUrl) finalType = 'tool';
    else if (finalCode) finalType = 'code';
    else finalType = 'concept';
  }

  return {
    title,
    tag,
    desc: finalDesc,
    code: finalCode,
    phrase: finalPhrase,
    url: finalUrl,
    points,
    type: finalType,
  };
};

export default function CollectionScreen({
  onBack,
  activeCollectionKey,
  collectionData,
  onAddNote,
  onCopySnippet,
  lang,
  t,
}) {
  if (!collectionData) return null;

  const title = lang === 'uz' && collectionData.title_uz ? collectionData.title_uz : collectionData.title;
  const desc = lang === 'uz' && collectionData.desc_uz ? collectionData.desc_uz : collectionData.desc;
  const subtitle = lang === 'uz' && collectionData.subtitle_uz ? collectionData.subtitle_uz : collectionData.subtitle;

  return (
    <View style={styles.collectionScreen}>
      {/* ШАПКА ПАПКИ */}
      <View style={styles.feedHeader}>
        <AnimatedIconButton
          style={styles.brutalIconButton}
          iconName="arrow-left"
          iconSize={20}
          animationType="nudge"
          onPress={onBack}
        />

        <View style={[styles.collectionHeaderBadge, { backgroundColor: collectionData.color || '#FDE047' }]}>
          <Text
            style={styles.collectionHeaderTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        </View>

        <AnimatedIconButton
          style={styles.brutalIconButton}
          iconName="plus"
          iconSize={20}
          animationType="hop"
          onPress={onAddNote}
        />
      </View>

      <View style={styles.collectionDescContainer}>
        {subtitle && (
          <Text style={styles.collectionSubtitle}>
            {subtitle}
          </Text>
        )}
        <Text style={styles.collectionDesc}>
          {desc}
        </Text>
      </View>

      {/* СПИСОК КАРТОЧЕК */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 36 }}>
        {collectionData.items.map((entry) => {
          const item = resolveCardData(entry, lang);
          const tagBg = getTagColor(item.tag);

          return (
            <View key={entry.id} style={styles.entryCard}>
              {/* 1. ВЕРХНИЙ РЯД: Заголовок и Тэг */}
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

              {/* 2. IT ENGLISH: Выделенная английская фраза */}
              {item.phrase ? (
                <View style={styles.phraseCallout}>
                  <View style={styles.phraseHeader}>
                    <Feather name="message-circle" size={13} color="#7C3AED" style={{ marginRight: 6 }} />
                    <Text style={styles.phraseHeaderLabel}>
                      {lang === 'uz' ? 'Inglizcha professional ibora:' : 'Английская фраза:'}
                    </Text>
                  </View>
                  <Text style={styles.phraseText}>"{item.phrase}"</Text>
                </View>
              ) : null}

              {/* 3. ОБЪЯСНЕНИЕ / СУТЬ (Обычный читаемый шрифт, не моноширинный) */}
              {item.desc ? (
                <Text style={styles.conceptText}>
                  {item.desc}
                </Text>
              ) : null}

              {/* 4. СПИСОК ПРАВИЛ / ТЕЗИСОВ (Архитектура и системный дизайн) */}
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

              {/* 5. БЛОК КОДА ИЛИ КОМАНДЫ (ТОЛЬКО ЕСЛИ ОНИ РЕАЛЬНО ЕСТЬ) */}
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
                        ? (lang === 'uz' ? 'Terminal buyrug\'i' : 'Команда терминала')
                        : (lang === 'uz' ? 'Kod namunasi' : 'Пример реализации')}
                    </Text>
                  </View>
                  <View style={styles.codeSnippetBox}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <Text style={styles.snippetText}>{item.code}</Text>
                    </ScrollView>
                  </View>
                </View>
              ) : null}

              {/* 6. УМНЫЕ КНОПКИ ДЕЙСТВИЙ (ТОЛЬКО ПО ДЕЛУ) */}
              {(item.url || item.code || item.phrase) ? (
                <View style={styles.actionsRow}>
                  {/* Кнопка перехода по внешней ссылке */}
                  {item.url ? (
                    <AnimatedBrutalButton
                      style={styles.openUrlBtn}
                      onPress={() => handleOpenUrl(item.url, lang)}
                    >
                      <Feather name="external-link" size={13} color="#000" style={{ marginRight: 6 }} />
                      <Text style={styles.openUrlText}>
                        {item.type === 'news'
                          ? (t.readSourceBtn || 'Читать источник')
                          : (t.openServiceBtn || 'Открыть сервис')}
                      </Text>
                    </AnimatedBrutalButton>
                  ) : null}

                  {/* Кнопка копирования ссылки для онлайн-инструментов */}
                  {item.url && !item.code && !item.phrase ? (
                    <AnimatedCopyButton
                      style={styles.compactCopyBtn}
                      label={t.copyLinkBtn || 'Скопировать ссылку'}
                      textStyle={styles.compactCopyText}
                      onPress={() => onCopySnippet(item.url)}
                    />
                  ) : null}

                  {/* Кнопка копирования кода или команды */}
                  {item.code ? (
                    <AnimatedCopyButton
                      style={styles.compactCopyBtn}
                      label={item.type === 'command'
                        ? (t.copyCommandBtn || 'Скопировать команду')
                        : (t.copyCodeBtn || 'Скопировать код')}
                      textStyle={styles.compactCopyText}
                      onPress={() => onCopySnippet(item.code)}
                    />
                  ) : null}

                  {/* Кнопка копирования английской фразы */}
                  {item.phrase ? (
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
        })}
      </ScrollView>
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
    marginBottom: 16,
  },
  collectionSubtitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000',
    marginBottom: 4,
  },
  collectionDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: '#52525B',
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: '#000',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  entryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  entryTitle: {
    fontSize: 15.5,
    fontWeight: '900',
    color: '#000',
    flex: 1,
    lineHeight: 22,
  },
  entryTagBadge: {
    borderWidth: 1.5,
    borderColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 10,
  },
  entryTagText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.2,
  },
  conceptText: {
    fontSize: 13.5,
    color: '#1F2937',
    fontWeight: '500',
    lineHeight: 20.5,
    marginBottom: 10,
  },
  phraseCallout: {
    backgroundColor: '#FAF5FF',
    borderLeftWidth: 4,
    borderLeftColor: '#9333EA',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  phraseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  phraseHeaderLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7E22CE',
  },
  phraseText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#3B0764',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  pointsList: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  pointIcon: {
    marginRight: 6,
    marginTop: 3,
  },
  pointText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 18,
    flex: 1,
  },
  codeSnippetContainer: {
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000000',
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
  },
  codeSnippetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1.5,
    borderBottomColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  codeSnippetHeaderTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#334155',
    letterSpacing: 0.2,
  },
  codeSnippetBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
  },
  snippetText: {
    fontSize: 12.5,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#0F172A',
    lineHeight: 20,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
  },
  compactCopyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDE047',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  compactCopyText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000',
  },
  openUrlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#38BDF8',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  openUrlText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000',
  },
});
