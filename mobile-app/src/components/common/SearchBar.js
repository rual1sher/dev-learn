import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

/**
 * SearchBar — унифицированная нео-бруталистская строка поиска для всех экранов.
 *
 * @param {string} value - Текущий поисковый запрос
 * @param {Function} onChangeText - Обработчик изменения ввода
 * @param {string} placeholder - Текст плейсхолдера
 * @param {Function} onClear - Кастомный сброс поиска (по умолчанию onChangeText(''))
 * @param {string} iconType - Тип левой иконки ('search' | 'hash')
 * @param {object} style - Дополнительные стили внешнего контейнера
 */
export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Поиск...',
  onClear,
  iconType = 'search',
  style,
}) {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChangeText) {
      onChangeText('');
    }
  };

  const hasQuery = Boolean(value && value.length > 0);

  return (
    <View style={[styles.searchBox, style]}>
      {iconType === 'hash' ? (
        <Text style={styles.hashSymbol}>#</Text>
      ) : (
        <Feather name="search" size={16} color="#71717A" style={styles.searchIcon} />
      )}

      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor="#71717A"
        value={value}
        onChangeText={onChangeText}
        autoCorrect={false}
        autoCapitalize="none"
      />

      {hasQuery ? (
        <TouchableOpacity
          style={styles.clearBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={handleClear}
        >
          <Feather name="x" size={16} color="#000000" />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: '#000000',
    paddingHorizontal: 12,
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  hashSymbol: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000000',
    marginRight: 8,
    lineHeight: 20,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    paddingVertical: 0,
  },
  clearBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#F4F4F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
  },
});
