import React, { useRef } from 'react';
import { TouchableOpacity, Animated, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function AnimatedCopyButton({ onPress, label, style, textStyle }) {
  const btnHop = useRef(new Animated.Value(0)).current;
  const btnRot = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const iconHop = useRef(new Animated.Value(0)).current;

  const handlePress = (e) => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(btnHop, { toValue: -3, duration: 55, useNativeDriver: true }),
        Animated.spring(btnHop, { toValue: 0, friction: 3.8, tension: 190, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.06, duration: 60, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 160, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(btnRot, { toValue: -1, duration: 40, useNativeDriver: true }),
        Animated.timing(btnRot, { toValue: 1, duration: 45, useNativeDriver: true }),
        Animated.spring(btnRot, { toValue: 0, friction: 3, tension: 160, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(iconHop, { toValue: -4, duration: 60, useNativeDriver: true }),
        Animated.spring(iconHop, { toValue: 0, friction: 4, tension: 140, useNativeDriver: true }),
      ]),
    ]).start();

    if (onPress) onPress(e);
  };

  const rotInterp = btnRot.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-3deg', '0deg', '3deg'],
  });

  return (
    <Animated.View
      style={{
        transform: [
          { translateY: btnHop },
          { scale: scaleAnim },
          { rotate: rotInterp },
        ],
      }}
    >
      <TouchableOpacity
        style={style}
        activeOpacity={0.7}
        onPress={handlePress}
      >
        <Animated.View style={{ transform: [{ translateY: iconHop }], marginRight: label ? 6 : 0 }}>
          <Feather name="copy" size={label ? 14 : 15} color="#000" />
        </Animated.View>
        {label ? <Text style={textStyle}>{label}</Text> : null}
      </TouchableOpacity>
    </Animated.View>
  );
}
