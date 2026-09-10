import React, { useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';

/**
 * AnimatedBrutalButton — универсальная нео-бруталистская кнопка с физикой анимаций:
 * - 'hop'    : подпрыгивает вверх с пружинным приземлением (spring hop)
 * - 'wiggle' : весело дёргается / покачивается влево-вправо (-4deg .. +4deg)
 * - 'twitch' : резкое вздрагивание со смещением (quick twitch)
 * - 'bounce' : продавливание в нео-брутальную тень и пружинный отскок-прыжок вверх
 */
export default function AnimatedBrutalButton({
  onPress,
  onPressIn,
  onPressOut,
  style,
  animationType = 'hop', // 'hop' | 'wiggle' | 'twitch' | 'bounce'
  activeOpacity = 0.85,
  disabled = false,
  children,
  ...rest
}) {
  const hopY = useRef(new Animated.Value(0)).current;
  const wiggleRot = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pressX = useRef(new Animated.Value(0)).current;
  const pressY = useRef(new Animated.Value(0)).current;

  // Запуск анимации «подпрыгивания» (Hop)
  const triggerHop = () => {
    hopY.setValue(0);
    scaleAnim.setValue(1);
    Animated.parallel([
      Animated.sequence([
        Animated.timing(hopY, {
          toValue: -3.5,
          duration: 65,
          useNativeDriver: true,
        }),
        Animated.spring(hopY, {
          toValue: 0,
          friction: 3.8,
          tension: 190,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.03,
          duration: 65,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 170,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  // Запуск анимации «дёргания» (Wiggle / Twitch)
  const triggerWiggle = () => {
    wiggleRot.setValue(0);
    hopY.setValue(0);
    Animated.parallel([
      Animated.sequence([
        Animated.timing(wiggleRot, { toValue: -1, duration: 35, useNativeDriver: true }),
        Animated.timing(wiggleRot, { toValue: 1, duration: 45, useNativeDriver: true }),
        Animated.timing(wiggleRot, { toValue: -0.6, duration: 35, useNativeDriver: true }),
        Animated.timing(wiggleRot, { toValue: 0.5, duration: 35, useNativeDriver: true }),
        Animated.spring(wiggleRot, { toValue: 0, friction: 3.5, tension: 170, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(hopY, { toValue: -1.5, duration: 50, useNativeDriver: true }),
        Animated.spring(hopY, { toValue: 0, friction: 4, tension: 180, useNativeDriver: true }),
      ]),
    ]).start();
  };

  // Запуск резкого вздрагивания (Twitch)
  const triggerTwitch = () => {
    pressX.setValue(0);
    pressY.setValue(0);
    Animated.sequence([
      Animated.timing(pressX, { toValue: -2, duration: 30, useNativeDriver: true }),
      Animated.timing(pressX, { toValue: 2, duration: 35, useNativeDriver: true }),
      Animated.timing(pressX, { toValue: -1, duration: 30, useNativeDriver: true }),
      Animated.spring(pressX, { toValue: 0, friction: 4, tension: 170, useNativeDriver: true }),
    ]).start();
  };

  const handlePressIn = (e) => {
    if (disabled) return;
    if (animationType === 'bounce') {
      Animated.parallel([
        Animated.timing(pressX, { toValue: 1.5, duration: 40, useNativeDriver: true }),
        Animated.timing(pressY, { toValue: 1.5, duration: 40, useNativeDriver: true }),
      ]).start();
    }
    if (onPressIn) onPressIn(e);
  };

  const handlePressOut = (e) => {
    if (disabled) return;
    if (animationType === 'bounce') {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pressY, { toValue: -2.5, duration: 55, useNativeDriver: true }),
          Animated.spring(pressY, { toValue: 0, friction: 3.8, tension: 170, useNativeDriver: true }),
        ]),
        Animated.spring(pressX, { toValue: 0, friction: 4, tension: 150, useNativeDriver: true }),
      ]).start();
    }
    if (onPressOut) onPressOut(e);
  };

  const handlePress = (e) => {
    if (disabled) return;

    if (animationType === 'wiggle') {
      triggerWiggle();
    } else if (animationType === 'twitch') {
      triggerTwitch();
    } else if (animationType === 'hop') {
      triggerHop();
    } else if (animationType === 'bounce') {
      triggerHop();
    }

    if (onPress) onPress(e);
  };

  const rotateInterpolation = wiggleRot.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-2.5deg', '0deg', '2.5deg'],
  });

  return (
    <Animated.View
      style={{
        transform: [
          { translateX: pressX },
          { translateY: Animated.add(pressY, hopY) },
          { scale: scaleAnim },
          { rotate: rotateInterpolation },
        ],
      }}
    >
      <TouchableOpacity
        activeOpacity={activeOpacity}
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={style}
        {...rest}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}
