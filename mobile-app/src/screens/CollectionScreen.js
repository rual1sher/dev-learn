import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Platform } from 'react-native';
import ScreenHeader from '../components/common/ScreenHeader';
import FolderMetaBanner from '../components/common/FolderMetaBanner';
import SearchBar from '../components/common/SearchBar';
import EmptyState from '../components/common/EmptyState';
import AnimatedIconButton from '../components/common/AnimatedIconButton';
import CollectionEntryCard from '../components/collection/CollectionEntryCard';
import { handleOpenUrl } from '../utils/helpers';

/**
 * Интеллектуальный резолвер карточек (поддержка структурированных данных и легаси)
 */
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
    id: entry.id,
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

/**
 * CollectionScreen — экран тематической папки (DevOps, Web, Interview, Architecture, English, Tools, News).
 * Полностью стандартизирован: единый ScreenHeader, FolderMetaBanner, SearchBar, EmptyState и мемоизированные карточки.
 */
export default function CollectionScreen({
  onBack,
  activeCollectionKey,
  collectionData,
  onAddNote,
  onCopySnippet,
  lang = 'ru',
  t = {},
}) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!collectionData) return null;

  const isUz = lang === 'uz';
  const title = isUz && collectionData.title_uz ? collectionData.title_uz : collectionData.title;
  const desc = isUz && collectionData.desc_uz ? collectionData.desc_uz : collectionData.desc;
  const subtitle = isUz && collectionData.subtitle_uz ? collectionData.subtitle_uz : collectionData.subtitle;

  // Оптимизированная фильтрация с поиском
  const filteredItems = useMemo(() => {
    const rawItems = collectionData.items || [];
    if (!searchQuery.trim()) return rawItems;

    const q = searchQuery.toLowerCase().trim();
    return rawItems.filter((entry) => {
      const item = resolveCardData(entry, lang);
      return (
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.desc && item.desc.toLowerCase().includes(q)) ||
        (item.code && item.code.toLowerCase().includes(q)) ||
        (item.phrase && item.phrase.toLowerCase().includes(q)) ||
        (item.tag && item.tag.toLowerCase().includes(q))
      );
    });
  }, [collectionData?.items, searchQuery, lang]);

  const handleOpenLink = useCallback((url) => {
    handleOpenUrl(url, lang);
  }, [lang]);

  return (
    <View style={styles.collectionScreen}>
      {/* 1. ЕДИНЫЙ НЕО-БРУТАЛЬНЫЙ ХЕДЕР ПАПКИ */}
      <ScreenHeader
        title={title}
        badgeColor={collectionData.color || '#FDE047'}
        onBack={onBack}
        rightAction={
          <AnimatedIconButton
            style={styles.addBtn}
            iconName="plus"
            iconSize={20}
            animationType="hop"
            onPress={onAddNote}
          />
        }
      />

      {/* 2. ЕДИНЫЙ МЕТА-БАННЕР ПАПКИ */}
      <FolderMetaBanner
        subtitle={subtitle}
        desc={desc}
        countText={`${collectionData.items?.length || 0} ${t.links || (isUz ? 'materiallar' : 'материалов')}`}
        tagText={collectionData.badge}
        tagColor={collectionData.color}
      />

      {/* 3. ЕДИНОЕ ПОЛЕ ПОИСКА ПО ШПАРГАЛКАМ И КОДУ */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder={isUz ? "Ushbu jild ichidan qidirish..." : "Поиск по материалам и коду..."}
      />

      {/* 4. СПИСОК КАРТОЧЕК ИЛИ ЕДИНЫЙ EMPTY STATE С DOTTY */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredItems.length === 0 ? (
          <EmptyState
            title={isUz ? "Hech narsa topilmadi" : "Ничего не найдено"}
            subtitle={isUz
              ? "Ushbu jildda bunday shpargalka yo'q. Qidiruv so'zini o'zgartirib ko'ring."
              : "В этой папке нет таких материалов. Попробуйте изменить поисковый запрос."}
            onReset={searchQuery ? () => setSearchQuery('') : null}
            resetLabel={isUz ? "Qidiruvni tozalash" : "Сбросить поиск"}
          />
        ) : (
          filteredItems.map((entry) => (
            <CollectionEntryCard
              key={entry.id}
              item={resolveCardData(entry, lang)}
              lang={lang}
              t={t}
              onCopySnippet={onCopySnippet}
              onOpenUrl={handleOpenLink}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  collectionScreen: {
    flex: 1,
    paddingHorizontal: Platform.OS === 'web' ? 36 : 20,
    backgroundColor: '#FFFFFF',
  },
  addBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  scrollContent: {
    paddingBottom: 36,
  },
});
