import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import AnimatedDotty from './AnimatedDotty';
import { getToastTopOffset } from '../../utils/helpers';

export default function LangSwitchToast({ toastInfo, onClose }) {
  const translateY = useRef(new Animated.Value(-140)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const dotHop = useRef(new Animated.Value(0)).current;

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -140,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onClose) onClose();
    });
  };

  useEffect(() => {
    if (!toastInfo) return;

    translateY.setValue(-140);
    opacity.setValue(0);

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        friction: 6,
        tension: 160,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 140,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(120),
        Animated.timing(dotHop, { toValue: -6, duration: 70, useNativeDriver: true }),
        Animated.spring(dotHop, { toValue: 0, friction: 3, tension: 160, useNativeDriver: true }),
      ]),
    ]).start();

    const timer = setTimeout(() => {
      handleDismiss();
    }, 1900);

    return () => clearTimeout(timer);
  }, [toastInfo?.id]);

  if (!toastInfo) return null;

  const isRu = toastInfo.lang === 'ru';

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.langToastContainer,
        {
          top: getToastTopOffset(),
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleDismiss}
        style={styles.langToastCard}
      >
        <Animated.View style={{ transform: [{ translateY: dotHop }], marginRight: 10 }}>
          <AnimatedDotty size={28} animated={true} />
        </Animated.View>
        <View style={{ flex: 1 }}>
          <Text style={styles.langToastTitle}>
            {isRu ? 'Язык интерфейса: Русский' : "Interfeys tili: O'zbekcha"}
          </Text>
          <Text style={styles.langToastSubtitle}>
            {isRu ? 'Все шпаргалки, тесты и меню обновлены' : 'Barcha shpargalkalar, testlar va menyu yangilandi'}
          </Text>
        </View>
        <View style={styles.langToastBadge}>
          <Text style={styles.langToastBadgeText}>
            {isRu ? 'RU' : 'UZ'}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  langToastContainer: {
    position: 'absolute',
    left: 14,
    right: 14,
    zIndex: 999999,
    elevation: 999999,
  },
  langToastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#000000',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  langToastTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#000000',
  },
  langToastSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#52525B',
    marginTop: 1,
  },
  langToastBadge: {
    backgroundColor: '#FDE047',
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  langToastBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#000000',
  },
});
