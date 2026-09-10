import React, { useRef } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function AnimatedIconButton({
  onPress,
  style,
  iconName,
  iconSize = 20,
  iconColor = '#000',
  animationType = 'bounce', // 'bounce' | 'hop' | 'wiggle' | 'twitch' | 'spin' | 'nudge'
  activeOpacity = 0.8,
  children,
}) {
  const pressX = useRef(new Animated.Value(0)).current;
  const pressY = useRef(new Animated.Value(0)).current;
  const hopY = useRef(new Animated.Value(0)).current;
  const wiggleRot = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Hop (подпрыгивает)
  const triggerHop = () => {
    hopY.setValue(0);
    scaleAnim.setValue(1);
    Animated.parallel([
      Animated.sequence([
        Animated.timing(hopY, { toValue: -3.5, duration: 65, useNativeDriver: true }),
        Animated.spring(hopY, { toValue: 0, friction: 3.8, tension: 190, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.04, duration: 65, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 170, useNativeDriver: true }),
      ]),
    ]).start();
  };

  // Wiggle / Twitch (дёргается)
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

  // Spin (вращение)
  const triggerSpin = () => {
    wiggleRot.setValue(0);
    Animated.sequence([
      Animated.timing(wiggleRot, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.spring(wiggleRot, { toValue: 0, friction: 4, tension: 140, useNativeDriver: true }),
    ]).start();
  };

  const handlePressIn = () => {
    if (animationType === 'nudge') {
      Animated.timing(pressX, {
        toValue: -3,
        duration: 50,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.parallel([
        Animated.timing(pressX, { toValue: 1.5, duration: 40, useNativeDriver: true }),
        Animated.timing(pressY, { toValue: 1.5, duration: 40, useNativeDriver: true }),
      ]).start();
    }
  };

  const handlePressOut = () => {
    if (animationType === 'nudge') {
      Animated.spring(pressX, {
        toValue: 0,
        friction: 4,
        tension: 140,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pressY, { toValue: -2.5, duration: 55, useNativeDriver: true }),
          Animated.spring(pressY, { toValue: 0, friction: 3.8, tension: 170, useNativeDriver: true }),
        ]),
        Animated.spring(pressX, { toValue: 0, friction: 4, tension: 150, useNativeDriver: true }),
      ]).start();
    }
  };

  const handlePress = (e) => {
    if (animationType === 'wiggle' || animationType === 'twitch') {
      triggerWiggle();
    } else if (animationType === 'spin') {
      triggerSpin();
    } else if (animationType === 'hop' || animationType === 'bounce') {
      triggerHop();
    }
    if (onPress) onPress(e);
  };

  const rotateInterpolation = wiggleRot.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: animationType === 'spin' ? ['-180deg', '0deg', '360deg'] : ['-6deg', '0deg', '6deg'],
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
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={style}
      >
        {iconName && <Feather name={iconName} size={iconSize} color={iconColor} />}
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}
