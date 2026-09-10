import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function AnimatedFolderCard({ item, onPress, lang, cardWidth }) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const fallbackWidth = Platform.OS === 'web'
    ? (isDesktop ? 'calc((100% - 48px) / 4)' : 'calc((100% - 12px) / 2)')
    : (isDesktop ? '23.5%' : '48%');
  const finalWidth = cardWidth || fallbackWidth;

  const pressX = useRef(new Animated.Value(0)).current;
  const pressY = useRef(new Animated.Value(0)).current;
  const iconHop = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(pressX, { toValue: 2, duration: 60, useNativeDriver: true }),
      Animated.timing(pressY, { toValue: 2, duration: 60, useNativeDriver: true }),
      Animated.timing(iconHop, { toValue: -3, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(pressY, { toValue: -4, duration: 65, useNativeDriver: true }),
        Animated.spring(pressY, { toValue: 0, friction: 3.5, tension: 160, useNativeDriver: true }),
      ]),
      Animated.spring(pressX, { toValue: 0, friction: 4, tension: 140, useNativeDriver: true }),
      Animated.spring(iconHop, { toValue: 0, friction: 4, tension: 140, useNativeDriver: true }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        { width: finalWidth },
        {
          transform: [
            { translateX: pressX },
            { translateY: pressY },
          ],
        },
      ]}
    >
      {/* ЯРЛЫЧОК ПАПКИ */}
      <View style={[styles.folderTab, { backgroundColor: item.color }]} />

      {/* КОРПУС ПАПКИ */}
      <TouchableOpacity
        style={styles.folderCardBody}
        activeOpacity={0.92}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <View style={styles.cardTopRow}>
          <View
            style={[
              styles.cardIconBox,
              { backgroundColor: item.color },
            ]}
          >
            <Animated.View style={{ transform: [{ translateY: iconHop }] }}>
              <Feather name={item.icon} size={20} color="#000" />
            </Animated.View>
          </View>

          <View style={styles.cardMetaCol}>
            <View style={styles.metaRowWithBadge}>
              <Text style={styles.cardMetaText}>{item.meta}</Text>
              {item.badge && (
                <View style={styles.badgeNew}>
                  <Text style={styles.badgeNewText}>{item.badge}</Text>
                </View>
              )}
            </View>
            {item.extra && (
              <Text style={styles.cardExtraText}>{item.extra}</Text>
            )}
          </View>
        </View>

        <View style={styles.titleWrapper}>
          <Text style={styles.cardTitleText} numberOfLines={1}>
            {item.title}
          </Text>
          {item.subtitle ? (
            <Text style={styles.cardSubText} numberOfLines={1}>
              {item.subtitle}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
  },
  folderTab: {
    width: 65,
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
  folderCardBody: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: '#000000',
    padding: 12,
    minHeight: 120,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cardMetaCol: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 2,
  },
  metaRowWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  cardMetaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
    marginRight: 4,
  },
  cardExtraText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#71717A',
    marginTop: 2,
  },
  badgeNew: {
    backgroundColor: '#FB7185',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  badgeNewText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  titleWrapper: {
    marginTop: 12,
  },
  cardTitleText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -0.3,
  },
  cardSubText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 3,
  },
});
