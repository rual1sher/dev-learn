import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Модульные константы и данные
import { BLITZ_QUESTIONS } from "./src/constants/blitzQuestions";
import { INITIAL_COLLECTIONS_DATA } from "./src/constants/collectionsData";
import { OPEN_MEDIA_RESOURCES } from "./src/constants/mediaResources";
import { TRANSLATIONS } from "./src/constants/translations";
import { MASCOT_TIPS } from "./src/constants/mascotTips";

// Модульные компоненты
import LangSwitchToast from "./src/components/common/LangSwitchToast";

// Модульные экраны
import HomeScreen from "./src/screens/HomeScreen";
import CollectionScreen from "./src/screens/CollectionScreen";
import BlitzScreen from "./src/screens/BlitzScreen";
import MediaScreen from "./src/screens/MediaScreen";
import LessonScreen from "./src/screens/LessonScreen";
import LessonsCatalogScreen from "./src/screens/LessonsCatalogScreen";

// Модульные модальные окна
import AddNoteModal from "./src/modals/AddNoteModal";
import SettingsModal from "./src/modals/SettingsModal";
import AboutModal from "./src/modals/AboutModal";

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: [
    "http://localhost:8081",
    "http://localhost:8082",
    "http://localhost:19006",
    "devlearn://",
  ],
  config: {
    screens: {
      Home: "",
      Media: "media",
      Blitz: "blitz",
      Lessons: "lessons",
      Lesson: "lesson/:lessonId",
      Collection: "collection/:collectionKey",
    },
  },
};

export default function App() {
  const [activeCollectionKey, setActiveCollectionKey] = useState("base");

  // Язык интерфейса
  const [lang, setLang] = useState("ru"); // 'ru' | 'uz'
  const [toastInfo, setToastInfo] = useState(null);

  // Данные приложения
  const [collectionsData, setCollectionsData] = useState(
    INITIAL_COLLECTIONS_DATA,
  );
  const [blitzQuestions, setBlitzQuestions] = useState(BLITZ_QUESTIONS);

  // Блиц-тренажер
  const [blitzIndex, setBlitzIndex] = useState(0);
  const [combo, setCombo] = useState(0);
  const [answeredState, setAnsweredState] = useState(null);

  // Поиск на главном экране
  const [searchQuery, setSearchQuery] = useState("");

  // Модальные окна
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // Маскот Dotty
  const mascotHop = useRef(new Animated.Value(0)).current;
  const [showMascotBubble, setShowMascotBubble] = useState(false);
  const [mascotTipIndex, setMascotTipIndex] = useState(0);

  // Плавная анимация смены экранов
  const screenFadeAnim = useRef(new Animated.Value(1)).current;

  // React Navigation реф для отслеживания маршрута и заголовков на Web
  const navigationRef = useRef(null);

  const t = TRANSLATIONS[lang];

  // Динамическое обновление заголовка вкладки в браузере (Web document.title)
  const handleNavigationStateChange = () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined' && navigationRef.current) {
      try {
        const route = navigationRef.current.getCurrentRoute();
        if (route) {
          if (route.name === 'Media') {
            document.title = `DevLearn | ${t.mediaResources || 'Медиатека'}`;
          } else if (route.name === 'Blitz') {
            document.title = `DevLearn | ${t.blitzTitle || 'Блиц-спринт'}`;
          } else if (route.name === 'Lessons') {
            document.title = `DevLearn | ${t.lessonsScreenTitle || 'Интерактивные Уроки'}`;
          } else if (route.name === 'Lesson') {
            const lId = route.params?.lessonId || 'react-native';
            document.title = `DevLearn | Урок: ${lId.toUpperCase()}`;
          } else if (route.name === 'Collection') {
            const cKey = route.params?.collectionKey || activeCollectionKey || 'base';
            const collTitle = collectionsData[cKey]?.title?.[lang] || collectionsData[cKey]?.title || cKey;
            document.title = `DevLearn | ${collTitle}`;
          } else {
            document.title = `DevLearn | ${t.appTitle || 'Коллекция знаний'}`;
          }
        }
      } catch (e) {
        // Safe fallback
      }
    }
  };

  useEffect(() => {
    handleNavigationStateChange();
  }, [lang]);

  // Смена языка с плавной анимацией и тоастом
  const switchLanguage = (newLang) => {
    if (newLang === lang) return;
    Animated.sequence([
      Animated.timing(screenFadeAnim, {
        toValue: 0.88,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(screenFadeAnim, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start();

    setLang(newLang);
    setToastInfo({ id: Date.now(), lang: newLang });
  };

  // Нажатие на маскота Dotty
  const handleMascotPress = () => {
    Animated.sequence([
      Animated.timing(mascotHop, {
        toValue: -8,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(mascotHop, {
        toValue: 0,
        friction: 3,
        tension: 160,
        useNativeDriver: true,
      }),
    ]).start();

    if (!showMascotBubble) {
      setShowMascotBubble(true);
    } else {
      setMascotTipIndex((prev) => (prev + 1) % MASCOT_TIPS[lang].length);
    }
  };

  // Ответ в блице
  const handleAnswer = (userChoice) => {
    const currentQ = blitzQuestions[blitzIndex] || blitzQuestions[0];
    const isCorrect = userChoice === currentQ.t;

    if (isCorrect) {
      setCombo((prev) => prev + 1);
    } else {
      setCombo(0);
    }

    setAnsweredState({
      isCorrect,
      punchline: lang === "uz" && currentQ.p_uz ? currentQ.p_uz : currentQ.p,
    });
  };

  const handleNextQuestion = () => {
    setAnsweredState(null);
    setBlitzIndex((prev) => (prev + 1) % blitzQuestions.length);
  };

  // Добавление новой заметки / сниппета
  const handleAddNewItem = ({ categoryKey, title, snippet }) => {
    const newItem = {
      id: Date.now().toString(),
      title,
      title_uz: title,
      snippet,
      snippet_uz: snippet,
      tag: "Custom",
      tag_uz: "Maxsus",
    };

    setCollectionsData((prev) => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        items: [newItem, ...(prev[categoryKey]?.items || [])],
      },
    }));

    Alert.alert(
      lang === "uz" ? "Saqlandi!" : "Сохранено!",
      lang === "uz"
        ? "Yangi shpargalka muvaffaqiyatli saqlandi."
        : "Новая шпаргалка сохранена в коллекцию.",
    );
  };

  // Копирование сниппета
  const handleCopySnippet = (snippet) => {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(snippet).catch(() => {});
    }
    Alert.alert(t.copiedTitle, t.copiedMsg);
  };

  // Список папок на главном экране (Коллекции + Блиц + Медиа)
  const allCards = [
    {
      id: "feed",
      title: lang === "uz" ? "Blits-Sprint" : "Блиц-Спринт",
      subtitle: lang === "uz" ? "Tezkor testlar" : "Скоростные тесты",
      icon: "zap",
      color: "#4ADE80",
      meta: `${blitzQuestions.length} ${t.tests}`,
      badge: "SPRINT",
      extra: combo > 0 ? `Серия x${combo}` : (lang === "uz" ? "Sprint rejimi" : "Режим спринта"),
    },
    {
      id: "media",
      title: lang === "uz" ? "Media & Video" : "Медиа & Видео",
      subtitle: lang === "uz" ? "YouTube & Ochiq darslar" : "YouTube & Открытые курсы",
      icon: "play-circle",
      color: "#38BDF8",
      meta: `${OPEN_MEDIA_RESOURCES.length} ${t.mediaCount}`,
      badge: "MEDIA",
      extra: lang === "uz" ? "Ochiq darslar" : "Открытые курсы",
    },
    {
      id: "lessons",
      title: lang === "uz" ? "Interaktiv Darslar" : "Интерактивные Уроки",
      subtitle: lang === "uz" ? "React Native, Dart & Mobil" : "React Native, Dart & Архитектура",
      icon: "book-open",
      color: "#F472B6",
      meta: lang === "uz" ? "2 ta to'liq dars" : "2 полных курса",
      badge: "GUIDES",
      extra: lang === "uz" ? "Junior ➔ Senior" : "Junior ➔ Senior",
    },
    ...Object.keys(collectionsData).map((key) => {
      const col = collectionsData[key];
      return {
        id: key,
        title: lang === "uz" && col.title_uz ? col.title_uz : col.title,
        subtitle: lang === "uz" && col.subtitle_uz ? col.subtitle_uz : col.subtitle,
        icon: col.icon || "folder",
        badge: col.badge || "DOCS",
        color: col.color,
        meta: `${col.items ? col.items.length : 0} ${t.links}`,
        extra: lang === "uz" && col.extra_uz ? col.extra_uz : (col.extra || "Pocket"),
      };
    }),
  ];

  const filteredCards = allCards.filter((card) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      card.title.toLowerCase().includes(query) ||
      (card.subtitle && card.subtitle.toLowerCase().includes(query)) ||
      (card.meta && card.meta.toLowerCase().includes(query))
    );
  });

  return (
    <SafeAreaView style={styles.outerCanvas}>
      <StatusBar barStyle="dark-content" />

      {/* ТОАСТ СМЕНЫ ЯЗЫКА С УЧЕТОМ ЧЁЛКИ */}
      <LangSwitchToast
        toastInfo={toastInfo}
        onClose={() => setToastInfo(null)}
      />

      {/* ГЛАВНЫЙ АДАПТИВНЫЙ КОНТЕЙНЕР (WEB + MOBILE) */}
      <View style={styles.appContainer}>
        {/* ОСНОВНОЙ КОНТЕНТ С REACT NAVIGATION V7 + WEB LINKING */}
        <Animated.View style={{ flex: 1, opacity: screenFadeAnim }}>
          <NavigationContainer
            ref={navigationRef}
            linking={linking}
            onReady={handleNavigationStateChange}
            onStateChange={handleNavigationStateChange}
          >
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                animation: "fade",
                contentStyle: { backgroundColor: "#FFFFFF" },
              }}
            >
              <Stack.Screen name="Home">
                {({ navigation }) => (
                  <HomeScreen
                    filteredCards={filteredCards}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onOpenSettings={() => setIsSettingsModalOpen(true)}
                    onOpenAddModal={() => setIsAddModalOpen(true)}
                    onSelectFolder={(folderId) => {
                      if (folderId === "feed") {
                        navigation.navigate("Blitz");
                      } else if (folderId === "media") {
                        navigation.navigate("Media");
                      } else if (folderId === "lessons") {
                        navigation.navigate("Lessons");
                      } else {
                        setActiveCollectionKey(folderId);
                        navigation.navigate("Collection", { collectionKey: folderId });
                      }
                    }}
                    lang={lang}
                    switchLanguage={switchLanguage}
                    t={t}
                    mascotHop={mascotHop}
                    handleMascotPress={handleMascotPress}
                    showMascotBubble={showMascotBubble}
                    setShowMascotBubble={setShowMascotBubble}
                    mascotTipIndex={mascotTipIndex}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="Collection">
                {({ navigation, route }) => {
                  const cKey = route?.params?.collectionKey || activeCollectionKey || "base";
                  const collData = collectionsData[cKey] || collectionsData.base;
                  return (
                    <CollectionScreen
                      onBack={() => {
                        if (navigation.canGoBack()) {
                          navigation.goBack();
                        } else {
                          navigation.navigate("Home");
                        }
                      }}
                      activeCollectionKey={cKey}
                      collectionData={collData}
                      onAddNote={() => {
                        setActiveCollectionKey(cKey);
                        setIsAddModalOpen(true);
                      }}
                      onCopySnippet={handleCopySnippet}
                      lang={lang}
                      t={t}
                    />
                  );
                }}
              </Stack.Screen>

              <Stack.Screen name="Blitz">
                {({ navigation }) => (
                  <BlitzScreen
                    onBack={() => {
                      if (navigation.canGoBack()) {
                        navigation.goBack();
                      } else {
                        navigation.navigate("Home");
                      }
                    }}
                    blitzQuestions={blitzQuestions}
                    blitzIndex={blitzIndex}
                    combo={combo}
                    answeredState={answeredState}
                    handleAnswer={handleAnswer}
                    handleNextQuestion={handleNextQuestion}
                    lang={lang}
                    t={t}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="Media">
                {({ navigation }) => (
                  <MediaScreen
                    onBack={() => {
                      if (navigation.canGoBack()) {
                        navigation.goBack();
                      } else {
                        navigation.navigate("Home");
                      }
                    }}
                    onCopySnippet={handleCopySnippet}
                    lang={lang}
                    t={t}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="Lessons">
                {({ navigation }) => (
                  <LessonsCatalogScreen
                    navigation={navigation}
                    lang={lang}
                    t={t}
                  />
                )}
              </Stack.Screen>

              <Stack.Screen name="Lesson">
                {({ navigation, route }) => (
                  <LessonScreen
                    navigation={navigation}
                    route={route}
                    lang={lang}
                    t={t}
                    onCopySnippet={handleCopySnippet}
                  />
                )}
              </Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
        </Animated.View>

        {/* МОДАЛЬНЫЕ ОКНА */}
        <AddNoteModal
          visible={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          collectionsData={collectionsData}
          onSave={handleAddNewItem}
          initialCategory={activeCollectionKey}
          lang={lang}
          t={t}
        />

        <SettingsModal
          visible={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          collectionsData={collectionsData}
          combo={combo}
          onResetStreak={() => {
            setCombo(0);
            setBlitzIndex(0);
          }}
          onOpenAbout={() => setIsAboutModalOpen(true)}
          lang={lang}
          switchLanguage={switchLanguage}
          t={t}
        />

        <AboutModal
          visible={isAboutModalOpen}
          onClose={() => setIsAboutModalOpen(false)}
          blitzQuestions={blitzQuestions}
          collectionsData={collectionsData}
          lang={lang}
          t={t}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  outerCanvas: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    width: '100%',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 1160 : '100%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'web'
      ? {
          minHeight: '100vh',
          borderLeftWidth: 2,
          borderRightWidth: 2,
          borderColor: '#E4E4E7',
        }
      : {}),
  },
});

