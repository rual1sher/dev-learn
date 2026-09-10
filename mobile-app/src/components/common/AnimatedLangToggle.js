import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native';

export default function AnimatedLangToggle({ lang, onToggle }) {
  const slideAnim = useRef(new Animated.Value(lang === 'uz' ? 1 : 0)).current;
  const pillScale = useRef(new Animated.Value(1)).current;
  const ruScale = useRef(new Animated.Value(lang === 'ru' ? 1.08 : 1.0)).current;
  const uzScale = useRef(new Animated.Value(lang === 'uz' ? 1.08 : 1.0)).current;
  const hopY = useRef(new Animated.Value(0)).current;
  const wiggleRot = useRef(new Animated.Value(0)).current;

  const triggerToggleHop = () => {
    hopY.setValue(0);
    wiggleRot.setValue(0);
    Animated.parallel([
      Animated.sequence([
        Animated.timing(hopY, { toValue: -2.5, duration: 50, useNativeDriver: true }),
        Animated.spring(hopY, { toValue: 0, friction: 3.8, tension: 190, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(wiggleRot, { toValue: -1, duration: 40, useNativeDriver: true }),
        Animated.timing(wiggleRot, { toValue: 1, duration: 45, useNativeDriver: true }),
        Animated.spring(wiggleRot, { toValue: 0, friction: 3, tension: 160, useNativeDriver: true }),
      ]),
    ]).start();
  };

  useEffect(() => {
    const isUz = lang === 'uz';
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: isUz ? 1 : 0,
        friction: 6,
        tension: 190,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(pillScale, { toValue: 1.15, duration: 70, useNativeDriver: true }),
        Animated.spring(pillScale, { toValue: 1.0, friction: 4, tension: 170, useNativeDriver: true }),
      ]),
      Animated.spring(isUz ? uzScale : ruScale, {
        toValue: 1.08,
        friction: 4,
        tension: 160,
        useNativeDriver: true,
      }),
      Animated.spring(isUz ? ruScale : uzScale, {
        toValue: 1.0,
        friction: 4,
        tension: 160,
        useNativeDriver: true,
      }),
    ]).start();
  }, [lang]);

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 38],
  });

  const rotInterp = wiggleRot.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-3deg', '0deg', '3deg'],
  });

  return (
    <Animated.View
      style={[
        styles.langToggleGroup,
        {
          transform: [
            { translateY: hopY },
            { rotate: rotInterp },
          ],
        },
      ]}
    >
      {/* Плавный скользящий фон-переключатель */}
      <Animated.View
        style={[
          styles.langActiveSlider,
          {
            transform: [
              { translateX },
              { scale: pillScale },
            ],
          },
        ]}
      />

      {/* Сегмент RU */}
      <TouchableOpacity 
        style={styles.langBtnSegment} 
        activeOpacity={0.7}
        onPress={() => {
          triggerToggleHop();
          onToggle('ru');
        }}
      >
        <Animated.Text
          style={[
            styles.langBtnText,
            lang === 'ru' && styles.langBtnTextActive,
            { transform: [{ scale: ruScale }] },
          ]}
        >
          RU
        </Animated.Text>
      </TouchableOpacity>

      {/* Сегмент UZ */}
      <TouchableOpacity 
        style={styles.langBtnSegment} 
        activeOpacity={0.7}
        onPress={() => {
          triggerToggleHop();
          onToggle('uz');
        }}
      >
        <Animated.Text
          style={[
            styles.langBtnText,
            lang === 'uz' && styles.langBtnTextActive,
            { transform: [{ scale: uzScale }] },
          ]}
        >
          UZ
        </Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  langToggleGroup: {
    position: 'relative',
    flexDirection: 'row',
    width: 86,
    height: 44,
    backgroundColor: '#F4F4F5',
    borderWidth: 2.5,
    borderColor: '#000000',
    borderRadius: 12,
    padding: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 2.5, height: 2.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  langActiveSlider: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 37,
    height: 33,
    backgroundColor: '#FDE047',
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    zIndex: 1,
  },
  langBtnSegment: {
    width: 37,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  langBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#71717A',
  },
  langBtnTextActive: {
    color: '#000000',
    fontWeight: '900',
  },
});
