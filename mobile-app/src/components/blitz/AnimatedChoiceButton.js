import React, { useRef } from 'react';
import { StyleSheet, TouchableOpacity, Animated, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function AnimatedChoiceButton({ type, onPress, title, subtitle, disabled, hotkey }) {
  const btnHop = useRef(new Animated.Value(0)).current;
  const btnRot = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const iconHop = useRef(new Animated.Value(0)).current;

  const isFalse = type === 'false';
  const iconName = isFalse ? 'x' : 'check';
  const btnStyle = isFalse ? styles.fakeBtn : styles.trueBtn;

  const handlePress = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.sequence([
        Animated.timing(btnHop, { toValue: -4, duration: 60, useNativeDriver: true }),
        Animated.spring(btnHop, { toValue: 0, friction: 3.8, tension: 190, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.05, duration: 60, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 160, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(btnRot, { toValue: isFalse ? -1 : 1, duration: 40, useNativeDriver: true }),
        Animated.timing(btnRot, { toValue: isFalse ? 0.6 : -0.6, duration: 45, useNativeDriver: true }),
        Animated.spring(btnRot, { toValue: 0, friction: 3, tension: 160, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(iconHop, { toValue: -5, duration: 60, useNativeDriver: true }),
        Animated.spring(iconHop, { toValue: 0, friction: 4, tension: 160, useNativeDriver: true }),
      ]),
    ]).start();

    if (onPress) onPress();
  };

  const rotInterp = btnRot.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-3.5deg', '0deg', '3.5deg'],
  });

  return (
    <Animated.View
      style={{
        flex: 1,
        transform: [
          { translateY: btnHop },
          { scale: scaleAnim },
          { rotate: rotInterp },
        ],
      }}
    >
      <TouchableOpacity
        style={[styles.brutalDecisionBtn, btnStyle, disabled && styles.btnDisabled]}
        activeOpacity={0.7}
        disabled={disabled}
        onPress={handlePress}
      >
        <Animated.View style={{ transform: [{ translateY: iconHop }] }}>
          <Feather name={iconName} size={24} color="#000" />
        </Animated.View>
        <Text style={styles.decisionBtnText}>{title}</Text>
        {subtitle ? <Text style={styles.decisionSubText}>{subtitle}</Text> : null}
        {hotkey ? (
          <Animated.View style={styles.hotkeyBadge}>
            <Text style={styles.hotkeyText}>{hotkey}</Text>
          </Animated.View>
        ) : null}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  brutalDecisionBtn: {
    flex: 1,
    minHeight: 82,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  fakeBtn: {
    backgroundColor: '#FB7185',
  },
  trueBtn: {
    backgroundColor: '#4ADE80',
  },
  btnDisabled: {
    opacity: 0.35,
  },
  decisionBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#000',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  decisionSubText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000',
    marginTop: 1,
    opacity: 0.85,
    letterSpacing: 0.5,
  },
  hotkeyBadge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  hotkeyText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.4,
  },
});
