import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

/**
 * FolderMetaBanner — унифицированный нео-бруталистский блок описания папки/раздела:
 * Отображает подзаголовок, краткое описание и опциональные мета-бейджи (количество заметок, тэг).
 *
 * @param {string} subtitle - Верхний акцентный подзаголовок (например: "LINUX, DOCKER, NGINX, GIT")
 * @param {string} desc - Описание папки
 * @param {string} countText - Текст количества элементов (например: "12 заметок")
 * @param {string} tagText - Акцентный тэг категории (например: "DEVOPS")
 * @param {string} tagColor - Цвет фона акцентного тэга
 * @param {object} style - Дополнительные стили
 */
export default function FolderMetaBanner({
  subtitle,
  desc,
  countText,
  tagText,
  tagColor = '#FEF08A',
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      {subtitle ? (
        <Text style={styles.subtitleText} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}

      {desc ? (
        <Text style={styles.descText}>
          {desc}
        </Text>
      ) : null}

      {(countText || tagText) && (
        <View style={styles.chipsRow}>
          {tagText && (
            <View style={[styles.metaChip, { backgroundColor: tagColor }]}>
              <Text style={styles.metaChipText}>{tagText}</Text>
            </View>
          )}
          {countText && (
            <View style={[styles.metaChip, styles.countChip]}>
              <Text style={styles.countChipText}>{countText}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingLeft: 12,
    borderLeftWidth: 3.5,
    borderColor: '#000000',
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  descText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3F3F46',
    lineHeight: 18,
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  metaChip: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  metaChipText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 0.3,
  },
  countChip: {
    backgroundColor: '#F4F4F5',
  },
  countChipText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#52525B',
  },
});
