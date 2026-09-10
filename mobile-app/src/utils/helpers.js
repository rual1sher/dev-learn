import { Platform, StatusBar, Dimensions, Linking, Alert } from 'react-native';

const { height: DEVICE_HEIGHT } = Dimensions.get('window');

// Точный расчет отступа для безопасного отображения тоаста под чёлкой (iPhone 13 Pro Max и др.)
export const getToastTopOffset = () => {
  if (Platform.OS === 'web') {
    return 46; // Внутри веб-мокапа для ПК — ровно под строкой статуса
  }
  if (Platform.OS === 'ios') {
    // iPhone с Dynamic Island (14 Pro, 14 Pro Max, 15, 16)
    if (DEVICE_HEIGHT >= 852 && DEVICE_HEIGHT !== 896 && DEVICE_HEIGHT !== 926) {
      return 62;
    }
    // iPhone 13 Pro Max (высота 926pt, чёлка 47pt) и другие iPhone с чёлкой (X, 11, 12, 13, 14)
    if (DEVICE_HEIGHT >= 812) {
      return 58; // 11pt запаса под нижней гранью чёлки iPhone 13 Pro Max
    }
    // iPhone без чёлки (SE 2020/2022, 8)
    return 28;
  }
  // Android
  return (StatusBar.currentHeight || 24) + 12;
};

// Открытие внешних ссылок (YouTube, edX, Web) без сбоев на iOS и Web
export const handleOpenUrl = async (url, lang = 'ru') => {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(url, '_blank');
      return;
    }
    const cleanUrl = encodeURI(url);
    await Linking.openURL(cleanUrl);
  } catch (err) {
    console.warn('Error opening URL:', err);
    Linking.openURL(url).catch(() => {
      Alert.alert(lang === 'uz' ? 'Havola' : 'Ссылка', url);
    });
  }
};
