import React, { memo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AnimatedBrutalButton from '../common/AnimatedBrutalButton';
import AnimatedCopyButton from '../common/AnimatedCopyButton';

/**
 * MediaResourceCard — мемоизированная карточка внешнего медиа-ресурса (YouTube, подкаст, курс, статья).
 *
 * @param {object} item - Элемент ресурса из OPEN_MEDIA_RESOURCES
 * @param {string} lang - 'ru' | 'uz'
 * @param {Function} onOpenUrl - Коллбэк открытия ссылки
 * @param {Function} onCopyUrl - Коллбэк копирования ссылки
 */
function MediaResourceCard({ item, lang = 'ru', onOpenUrl, onCopyUrl }) {
  const isUz = lang === 'uz';
  const title = isUz && item.title_uz ? item.title_uz : item.title;
  const desc = isUz && item.desc_uz ? item.desc_uz : item.desc;
  const langBadge = isUz && item.langBadge_uz ? item.langBadge_uz : item.langBadge;
  const duration = isUz && item.duration_uz ? item.duration_uz : item.duration;

  const getActionInfo = () => {
    switch (item.category) {
      case 'course':
        return { icon: 'book-open', label: isUz ? 'Kursni ochish' : 'Открыть курс' };
      case 'podcast':
        return { icon: 'headphones', label: isUz ? 'Podkastni tinglash' : 'Слушать подкаст' };
      case 'digest':
        return { icon: 'file-text', label: isUz ? "Dayjestni o'qish" : 'Читать дайджест' };
      case 'video':
      default:
        return { icon: 'play', label: isUz ? "Videoni ko'rish" : 'Смотреть видео' };
    }
  };

  const actionInfo = getActionInfo();

  return (
    <View style={styles.mediaCard}>
      {/* 1. Бейджи в шапке карточки: платформа, язык, хронометраж */}
      <View style={styles.cardHeaderRow}>
        <View style={styles.badgesGroup}>
          <View style={styles.platformBadge}>
            <Feather name={item.platform_icon || 'video'} size={12} color="#000000" style={{ marginRight: 4 }} />
            <Text style={styles.platformBadgeText}>{item.platform}</Text>
          </View>

          <View style={[
            styles.langBadge,
            item.langCode === 'uz' && styles.langBadgeUz,
            item.langCode === 'ru' && styles.langBadgeRu,
            item.langCode === 'en' && styles.langBadgeEn,
            item.langCode === 'ru_en' && styles.langBadgeBilingual,
          ]}>
            <Text style={styles.langBadgeText}>{langBadge}</Text>
          </View>
        </View>

        {duration ? (
          <View style={styles.durationBadge}>
            <Text style={styles.durationBadgeText}>{duration}</Text>
          </View>
        ) : null}
      </View>

      {/* 2. Название и описание */}
      <Text style={styles.mediaTitle}>{title}</Text>
      <Text style={styles.mediaDesc}>{desc}</Text>

      {/* 3. Адрес ресурса */}
      {item.url ? (
        <View style={styles.urlBox}>
          <Feather name="globe" size={13} color="#71717A" style={{ marginRight: 6 }} />
          <Text style={styles.urlText} numberOfLines={1}>{item.url}</Text>
        </View>
      ) : null}

      {/* 4. Кнопки действий */}
      <View style={styles.actionsRow}>
        {item.url && onOpenUrl ? (
          <AnimatedBrutalButton
            animationType="hop"
            style={styles.openBtn}
            containerStyle={{ flex: 1 }}
            onPress={() => onOpenUrl(item.url)}
          >
            <View style={styles.openBtnInner}>
              <Feather name={actionInfo.icon} size={14} color="#000000" style={{ marginRight: 6 }} />
              <Text style={styles.openBtnText}>{actionInfo.label}</Text>
              <Feather name="arrow-up-right" size={14} color="#000000" style={{ marginLeft: 4 }} />
            </View>
          </AnimatedBrutalButton>
        ) : null}

        {item.url && onCopyUrl ? (
          <AnimatedCopyButton
            style={styles.copyBtn}
            onPress={() => onCopyUrl(item.url)}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mediaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: '#000000',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 3.5, height: 3.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  badgesGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  platformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  platformBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000000',
  },
  langBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  langBadgeUz: {
    backgroundColor: '#DCFCE7',
  },
  langBadgeRu: {
    backgroundColor: '#DBEAFE',
  },
  langBadgeEn: {
    backgroundColor: '#FEF08A',
  },
  langBadgeBilingual: {
    backgroundColor: '#F3E8FF',
  },
  langBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000000',
  },
  durationBadge: {
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  durationBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000000',
  },
  mediaTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
    lineHeight: 21,
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  mediaDesc: {
    fontSize: 13,
    fontWeight: '500',
    color: '#3F3F46',
    lineHeight: 18,
    marginBottom: 12,
  },
  urlBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 14,
  },
  urlText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  openBtn: {
    flex: 1,
    backgroundColor: '#38BDF8',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
    paddingVertical: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  openBtnInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  openBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 0.3,
  },
  copyBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#FEF08A',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
});

export default memo(MediaResourceCard);
