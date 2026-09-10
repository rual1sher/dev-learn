import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function AnimatedSettingsLangBtn({ code, flag, label, isActive, onPress }) {
  const pressScale = useRef(new Animated.Value(1)).current;
  const checkScale = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const btnHop = useRef(new Animated.Value(0)).current;
  const btnRot = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(checkScale, {
      toValue: isActive ? 1 : 0,
      friction: 4,
      tension: 170,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  const handlePressIn = () => {
    Animated.timing(pressScale, {
      toValue: 0.93,
      duration: 50,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      friction: 4,
      tension: 160,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = (e) => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(btnHop, { toValue: -3, duration: 55, useNativeDriver: true }),
        Animated.spring(btnHop, { toValue: 0, friction: 3.8, tension: 190, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(btnRot, { toValue: -1, duration: 40, useNativeDriver: true }),
        Animated.timing(btnRot, { toValue: 1, duration: 45, useNativeDriver: true }),
        Animated.spring(btnRot, { toValue: 0, friction: 3, tension: 160, useNativeDriver: true }),
      ]),
    ]).start();

    if (onPress) onPress(e);
  };

  const rotInterp = btnRot.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-3deg', '0deg', '3deg'],
  });

  const displayCode = code || (flag === '🇷🇺' ? 'RU' : flag === '🇺🇿' ? 'UZ' : flag);

  return (
    <Animated.View
      style={{
        flex: 1,
        transform: [
          { scale: pressScale },
          { translateY: btnHop },
          { rotate: rotInterp },
        ],
      }}
    >
      <TouchableOpacity
        style={[
          styles.settingsLangBtn,
          isActive && styles.settingsLangBtnActive,
        ]}
        activeOpacity={0.85}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
      >
        <View style={styles.langCodePill}>
          <Text style={styles.langCodeText}>{displayCode}</Text>
        </View>
        <Text
          style={[
            styles.settingsLangBtnText,
            isActive && styles.settingsLangBtnTextActive,
          ]}
        >
          {label}
        </Text>
        {isActive && (
          <Animated.View style={{ transform: [{ scale: checkScale }], marginLeft: 2 }}>
            <View style={styles.settingsCheckPill}>
              <Feather name="check" size={11} color="#FFFFFF" />
            </View>
          </Animated.View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  settingsLangBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F4F4F5',
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  settingsLangBtnActive: {
    backgroundColor: '#FDE047',
    borderWidth: 2,
    borderColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  langCodePill: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
  },
  langCodeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000000',
  },
  settingsLangBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#71717A',
  },
  settingsLangBtnTextActive: {
    color: '#000000',
    fontWeight: '900',
  },
  settingsCheckPill: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
