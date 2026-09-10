/**
 * Интерактивные документированные уроки и руководства DevLearn (Interactive Lessons)
 * 
 * Каждый урок построен по трёхуровневой методологии:
 *  - 🔰 JUNIOR: Концепция, суть, минимальный рабочий пример без воды.
 *  - ⚡ MIDDLE: "Под капотом" (runtime, память, жизненный цикл), архитектурные правила и частые ошибки.
 *  - 🚀 SENIOR: Производительность, профилирование, компромиссы (trade-offs), нативные интеграции и паттерны.
 *  - 💡 DOTTY PRO-TIP: Фирменный секрет или каверзный вопрос с технических собеседований.
 */

export const LESSONS_DATA = [
  // =========================================================================
  // 1. REACT NATIVE (RN)
  // =========================================================================
  {
    id: 'react-native',
    title: 'React Native: Архитектура от Junior до Senior',
    title_uz: 'React Native: Junior-dan Senior-gacha arxitektura',
    subtitle: 'Компоненты, Хуки, Fabric, TurboModules, Оптимизация 60/120 FPS',
    subtitle_uz: 'Komponentlar, Huklar, Fabric, TurboModules, 60/120 FPS optimallash',
    icon: 'smartphone',
    badge: 'FRAMEWORK',
    badge_uz: 'FRAYMVORK',
    color: '#38BDF8',
    category: 'mobile',
    readTime: '18 мин',
    readTime_uz: '18 daq',
    summary: 'Полное погружение в React Native: как JavaScript управляет нативными UI-компонентами Android и iOS, разница между Старой и Новой архитектурой (JSI/Fabric), оптимизация FlatList и профилирование Hermes.',
    summary_uz: "React Native-ga to'liq sho'ng'ish: JavaScript qanday qilib Android va iOS UI-ni boshqaradi, Yangi arxitektura (JSI/Fabric), FlatList optimallashtirish va Hermes profillash.",

    // 🔰 JUNIOR УРОВЕНЬ
    junior: {
      tag: 'JUNIOR • ОСНОВЫ',
      tag_uz: 'JUNIOR • ASOSLAR',
      title: 'Что такое React Native и как работает нативный UI',
      title_uz: 'React Native nima va nativ UI qanday ishlaydi',
      concept: `React Native (RN) — это фреймворк, позволяющий писать кросс-платформенные мобильные приложения на JavaScript / TypeScript с использованием синтаксиса React.

Главное отличие от WebView-решений (Cordova, Capacitor):
React Native НЕ запускает приложение внутри скрытого веб-браузера! Вместо этого компоненты React Native (такие как <View>, <Text>, <Image>) напрямую трансформируются в настоящие нативные виджеты операционной системы:
• В Android: <View> превращается в android.view.ViewGroup, а <Text> в android.widget.TextView.
• В iOS: <View> превращается в UIView, а <Text> в UITextView.

Ключевые отличия верстки от Web:
1. Нет DOM, нет тегов <div>, <span>, <p>. Только встроенные примитивы: <View>, <Text>, <ScrollView>, <FlatList>.
2. Все текстовые строки ОБЯЗАНЫ быть обернуты в <Text>, иначе на Android приложение упадет с ошибкой.
3. Flexbox включен по умолчанию для всех контейнеров, но flexDirection по умолчанию равен 'column' (а не 'row', как в вебе!).
4. Все размеры указываются в аппаратно-независимых точках (dp на Android, points на iOS), а не в пикселях (px).`,
      concept_uz: `React Native (RN) — bu React sintaksisi yordamida JavaScript / TypeScript tilida kross-platformali mobil ilovalar yaratish freymvorki.

WebView texnologiyalaridan (Cordova, Capacitor) asosiy farqi:
React Native ilovani yashirin veb-brauzer ichida ishlatmaydi! Uning komponentlari (<View>, <Text>, <Image>) to'g'ridan-to'g'ri operatsion tizimning haqiqiy nativ vidjetlariga aylanadi:
• Android-da: <View> android.view.ViewGroup-ga, <Text> esa android.widget.TextView-ga aylanadi.
• iOS-da: <View> UIView-ga, <Text> esa UITextView-ga aylanadi.

Vebdan asosiy farqlari:
1. DOM va <div>, <span> teglari yo'q. Faqat <View>, <Text>, <ScrollView>, <FlatList>.
2. Har qanday matn faqat <Text> ichida bo'lishi shart, aks holda Android-da ilova qulab tushadi.
3. Flexbox standart bo'yicha yoqilgan, lekin flexDirection standart holatda 'column' (vebdagi 'row' emas!).
4. O'lchamlar pikselda (px) emas, qurilma nuqtalarida (dp/points) beriladi.`,
      codeTitle: 'Минимальный компонент и стилизация (StyleSheet)',
      codeTitle_uz: 'Minimal komponent va stilizatsiya (StyleSheet)',
      code: `import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

export default function CounterScreen() {
  const [count, setCount] = useState(0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Счётчик кликов</Text>
        <Text style={styles.counterValue}>{count}</Text>

        {/* Интерактивная кнопка с обработкой нажатия */}
        <TouchableOpacity 
          style={styles.primaryButton}
          activeOpacity={0.8}
          onPress={() => setCount((prev) => prev + 1)}
        >
          <Text style={styles.buttonText}>+ Увеличить</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// StyleSheet компилирует стили в константные числовые ID для оптимизации передачи через движок
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#18181B', marginBottom: 8 },
  counterValue: { fontSize: 56, fontWeight: '900', color: '#38BDF8', marginBottom: 24 },
  primaryButton: {
    backgroundColor: '#000000',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000000',
    // Твердая тень Neo-Brutalism
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  buttonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
});`,
      keyPoints: [
        'Используйте SafeAreaView для учета вырезов экрана («челок») и статус-баров.',
        'Всегда используйте StyleSheet.create() вместо inline-объектов — это экономит память при ре-рендерах.',
        'Для кнопок используйте TouchableOpacity или Pressable с обратной связью (activeOpacity / ripple).',
      ],
      keyPoints_uz: [
        'Ekran teshiklari va holat panelini hisobga olish uchun SafeAreaView-dan foydalaning.',
        'Inline-ob\'yektlar o\'rniga har doim StyleSheet.create() ishlating — bu xotirani tejaydi.',
        'Tugmalar uchun TouchableOpacity yoki Pressable ishlating.',
      ],
    },

    // ⚡ MIDDLE УРОВЕНЬ
    middle: {
      tag: 'MIDDLE • ПОД КАПОТОМ',
      tag_uz: 'MIDDLE • ICHKI TUZILISH',
      title: 'Рантайм, New Architecture (JSI, Fabric) и рендеринг списков',
      title_uz: 'Rantaym, Yangi Arxitektura (JSI, Fabric) va ro\'yxatlar',
      concept: `Как React Native работает под капотом (Архитектурный сдвиг 2024-2026):

1. СТАРАЯ АРХИТЕКТУРА (The Bridge):
Раньше существовало 3 независимых потока:
- JS Thread (выполнение кода приложения на JavaScript).
- Native/UI Thread (отрисовка пикселей и обработка тач-событий).
- Shadow Thread (расчет макета Yoga layout).
Они общались через асинхронный мост (Bridge) сериализуя данные в JSON-строки.
Узкое горлышко: при быстром скролле списков сообщения в очереди Bridge застревали, из-за чего появлялись «белые экраны» во FlatList.

2. НОВАЯ АРХИТЕКТУРА (JSI + Fabric + TurboModules):
- JSI (JavaScript Interface): C++ прослойка, позволяющая JavaScript напрямую вызывать C++ методы и хранить ссылки на нативные Java/Obj-C объекты без JSON-сериализации!
- Fabric: новый движок рендеринга, способный рендерить UI синхронно прямо из C++ потока.
- TurboModules: нативные модули больше не инициализируются все сразу при старте приложения — они загружаются лениво (по требованию), сокращая время холодного старта (TBT) на 50%.

3. Оптимизация списков (FlatList / FlashList):
В мобильных устройствах нельзя отрендерить 10 000 элементов сразу — закончится RAM. FlatList виртуализирует список, уничтожая элементы вне экрана.
Критичные пропсы FlatList для 60 FPS:
- initialNumToRender: сколько элементов отрендерить в первом кадре.
- maxToRenderPerBatch: порция элементов за тик.
- windowSize: окно элементов вокруг видимой зоны (по умолчанию 21 — это слишком много! Ставьте 5 или 7).
- getItemLayout: избавляет FlatList от необходимости измерять размеры ячеек динамически.`,
      concept_uz: `React Native kapoti ostida qanday ishlaydi (2024-2026 Yangi Arxitekturasi):

1. ESKI ARXITEKTURA (The Bridge):
Ilgari 3 ta alohida oqim bo'lgan: JS Thread, Native UI Thread va Shadow Thread (Yoga). Ular JSON orqali Bridge orqali muloqot qilgan. Katta ro'yxatlar tez aylantirilganda oqimlar tiqilib, oq bo'shliqlar paydo bo'lardi.

2. YANGI ARXITEKTURA (JSI + Fabric + TurboModules):
- JSI (JavaScript Interface): JS to'g'ridan-to'g'ri C++ orqali nativ ob'ektlar bilan JSON-siz ishlaydi.
- Fabric: yangi UI render tizimi, sinxron chizish imkoniyatini beradi.
- TurboModules: nativ modullar ilova ochilganda emas, kerak bo'lgandagina xotiraga yuklanadi.

3. Ro'yxatlarni optimallashtirish (FlatList):
Katta ro'yxatlarda xotira to'lmasligi uchun FlatList faqat ekrandagi qismini ushlab turadi.
Muhim parametrlar: windowSize={5}, initialNumToRender={10}, getItemLayout (o'lchashlarni bekor qiladi).`,
      codeTitle: 'Высокопроизводительный виртуализированный FlatList с getItemLayout',
      codeTitle_uz: 'getItemLayout bilan yuqori unumli FlatList',
      code: `import React, { useCallback } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';

const ITEM_HEIGHT = 72; // Фиксированная высота ячейки для мгновенного скролла

export function OptimizedFeedList({ data, onCardPress }) {
  // useCallback гарантирует сохранение ссылки на рендер-функцию между кадрами
  const renderItem = useCallback(({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardSnippet} numberOfLines={1}>{item.snippet}</Text>
    </View>
  ), []);

  const keyExtractor = useCallback((item) => item.id, []);

  // getItemLayout пропускает расчет высоты через нативный движок Yoga
  const getItemLayout = useCallback((_, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      initialNumToRender={10}
      maxToRenderPerBatch={8}
      windowSize={5}                 // Сокращаем виртуальное окно с 21 до 5 экранов
      removeClippedSubviews={true}   // Выгружает невидимые нативные View из памяти
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  card: { height: ITEM_HEIGHT, justifyContent: 'center', paddingHorizontal: 16, borderBottomWidth: 1, borderColor: '#E4E4E7' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#18181B' },
  cardSnippet: { fontSize: 13, color: '#71717A', marginTop: 2 },
});`,
      keyPoints: [
        'Избегайте анонимных стрелочных функций в renderItem={({item}) => ...} — оборачивайте в useCallback.',
        'Если высота ячеек одинаковая, всегда объявляйте getItemLayout: скролл станет плавным на любых дистанциях.',
        'Используйте removeClippedSubviews={true} для длинных списков с картинками.',
      ],
      keyPoints_uz: [
        'renderItem ichida nomsiz funksiyalardan qoching — useCallback ishlating.',
        'Katakcha balandligi bir xil bo\'lsa, getItemLayout qo\'shing — silliq skroll kafolatlanadi.',
        'Rasmli uzun ro\'yxatlar uchun removeClippedSubviews={true} yoqing.',
      ],
    },

    // 🚀 SENIOR УРОВЕНЬ
    senior: {
      tag: 'SENIOR • АРХИТЕКТУРА & PROD',
      tag_uz: 'SENIOR • ARXITEKTURA & PROD',
      title: 'Утечки памяти, Hermes Профилирование и Offline-First архитектура',
      title_uz: 'Xotira oqishi, Hermes profillash va Offline-First arxitekturasi',
      concept: `Инженерные паттерны промышленной мобильной разработки:

1. ДВИЖОК HERMES И БАЙТКОД:
React Native использует движок Hermes, разработанный специально для мобильных:
- Он не использует JIT (Just-in-Time) компиляцию на устройстве, чтобы не расходовать батарею и оперативную память.
- Вместо этого JS-код компилируется в предсказуемый байткод заранее во время сборки приложения (AOT — Ahead-of-Time).
- Hermes Garbage Collector ориентирован на быстрое освобождение короткоживущих аллокаций.

2. ДИАГНОСТИКА УТЕЧЕК ПАМЯТИ (Memory Leaks):
Самые частые причины утечек в RN:
- Неотписанные слушатели событий: DeviceEventEmitter, AppState, NetInfo без cleanup функции в useEffect.
- Зависшие таймеры (setInterval/setTimeout), ссылающиеся на размонтированные компоненты.
- Кэширование огромных изображений в памяти без ресайза: скачивание 4K картинки в аватарку 48x48 съедает до 30 МБ видеопамяти! Всегда передавайте параметры resizeMode и миниатюры.

3. OFFLINE-FIRST АРХИТЕКТУРА:
Профессиональное приложение никогда не заставляет пользователя смотреть на бесконечный спиннер при отсутствии интернета:
- Локальное быстрое хранилище: SQLite (better-sqlite3 / op-sqlite) или key-value MMKV (в 30 раз быстрее AsyncStorage).
- Паттерн синхронизации: запись локально ➔ мгновенное обновление UI ➔ отправка очереди запросов на бэкенд в фоне с Idempotency Key.`,
      concept_uz: `Senior darajadagi mobil dasturlash tamoyillari:

1. HERMES DVIJOGI:
Hermes batareyani tejash uchun telefonda JIT ishlatmaydi. Kod AOT (Ahead-of-Time) orqali oldindan baytkodga aylanadi va darhol ishga tushadi.

2. XOTIRA OQISHI (MEMORY LEAKS):
- useEffect ichida tozalanmagan listenerlar (DeviceEventEmitter, NetInfo).
- O'chirilgan komponentlarga bog'langan setInterval/setTimeout.
- 4K rasmlarni kichik ikonkalarga siqmasdan to'g'ridan-to'g'ri yuklash.

3. OFFLINE-FIRST ARXITEKTURASI:
Ilova internetsiz ham ishlashi shart. AsyncStorage o'rniga MMKV yoki SQLite ishlatiladi: dastlab ma'lumot lokal saqlanadi, so'ng fonda sinxronlashadi.`,
      codeTitle: 'Паттерн безопасного хука с очисткой памяти и подпиской на AppState',
      codeTitle_uz: 'Xotira tozalanishi va AppState bilan xavfsiz huk andozasi',
      code: `import { useEffect, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';

/**
 * Хук безопасного таймера и отслеживания активности приложения (Foreground/Background)
 * Гарантирует 0% утечек памяти при размонтировании экрана
 */
export function useSafeAppLifecycle(onAppResume) {
  const [appState, setAppState] = useState(AppState.currentState);
  const callbackRef = useRef(onAppResume);

  // Всегда держим свежую ссылку на функцию, избегая лишних переподписок
  useEffect(() => {
    callbackRef.current = onAppResume;
  }, [onAppResume]);

  useEffect(() => {
    // Подписка на нативные события жизненного цикла ОС
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active' && callbackRef.current) {
        callbackRef.current();
      }
      setAppState(nextState);
    });

    // ОБЯЗАТЕЛЬНАЯ ОЧИСТКА (CLEANUP): предотвращает утечку памяти
    return () => {
      subscription.remove();
    };
  }, []);

  return { appState, isForeground: appState === 'active' };
}`,
      keyPoints: [
        'Используйте Flipper или React DevTools Profiler для замера времени рендера компонентов (target: < 16ms на кадр).',
        'Для тяжелых вычислений выносите логику в C++ через JSI или используйте Web Workers / React Native Worklets.',
        'Никогда не храните конфиденциальные токены в AsyncStorage — используйте react-native-keychain / EncryptedSharedPreferences.',
      ],
      keyPoints_uz: [
        'Komponentlar render vaqtini o\'lchash uchun Profiler ishlating (maqsad: 1 kadr < 16ms).',
        'Og\'ir hisob-kitoblarni JSI yoki Workletlar orqali alohida oqimga chiqaring.',
        'Maxfiy tokenlarni AsyncStorage-da saqlamang — Keychain / EncryptedStorage ishlating.',
      ],
    },

    proTip: {
      title: 'Главный каверзный вопрос на собеседовании по React Native',
      title_uz: "React Native intervyusidagi eng nozik savol",
      content: `Вопрос тимлида: «Почему при анимации через Animated.timing с useNativeDriver: true нельзя анимировать width, height или backgroundColor, а можно только transform и opacity?»

Правильный ответ Senior:
«При useNativeDriver: true конфигурация анимации один раз отправляется через JSI/Bridge в нативный поток (Native UI Thread), и каждый следующий кадр анимируется полностью внутри нативного драйвера со скоростью 60/120 FPS, даже если главный поток JavaScript намертво зависнет!
Однако изменение width, height, top или left требует пересчета макета Yoga Layout и повторного вызова measure() на каждом кадре, что невозможно без участия потока Shadow/JS. Поэтому нативный драйвер поддерживает только свойства компоновщика GPU — transform (координаты, масштаб, вращение) и opacity (прозрачность). Для плавных анимаций размеров и цветов сегодня используют react-native-reanimated с механизмами UI-worklets!»`,
      content_uz: `Texnik intervyu savoli: «Nima uchun useNativeDriver: true bo'lganda width va height-ni animatsiya qilib bo'lmaydi, faqat transform va opacity ruxsat etilgan?»

Senior javobi:
«useNativeDriver: true qilinganda animatsiya konfiguratsiyasi bir marta Nativ UI oqimiga yuboriladi va har bir kadr to'g'ridan-to'g'ri GPU/Native oqimda chiziladi (hatto JS qotib qolsa ham animatsiya to'xtamaydi).
Lekin width va height o'zgarsa, har bir kadrda Yoga Layout orqali butun ekranni qayta hisoblash talab qilinadi, bu esa JS-siz imkonsiz. Shu sababli faqat GPU-da bevosita o'zgaradigan transform va opacity qo'llab-quvvatlanadi. O'lcham va ranglarni 60/120 FPS animatsiya qilish uchun esa react-native-reanimated kutubxonasi ishlatiladi!»`,
    },
  },

  // =========================================================================
  // 2. DART & FLUTTER CORE
  // =========================================================================
  {
    id: 'dart',
    title: 'Dart: Язык, Машина, Асинхронность и Память',
    title_uz: "Dart: Til, Virtual Mashina, Asinxronlik va Xotira",
    subtitle: 'Null Safety, Event Loop, Isolates, Streams, Garbage Collector',
    subtitle_uz: "Null Safety, Event Loop, Izolyatlar, Streams va Xotira tozalagich",
    icon: 'code',
    badge: 'LANGUAGE',
    badge_uz: 'DASTURLASH TILI',
    color: '#60A5FA',
    category: 'mobile',
    readTime: '20 мин',
    readTime_uz: '20 daq',
    summary: 'Глубокий инженерный курс по языку Dart: статическая типизация с Sound Null Safety, архитектура Event Loop (Microtasks против Event Queue), многопоточность без гонок данных через Isolates и модель сборщика мусора.',
    summary_uz: "Dart tili bo'yicha to'liq qo'llanma: Sound Null Safety, Event Loop mexanizmi, Isolates orqali poygasiz ko'p oqimli ishlash va generatsion Garbage Collector.",

    // 🔰 JUNIOR УРОВЕНЬ
    junior: {
      tag: 'JUNIOR • СИНТАКСИС & БАЗА',
      tag_uz: 'JUNIOR • SINTAKSIS & ASOSLAR',
      title: 'Введение в Dart: Статическая типизация и Sound Null Safety',
      title_uz: 'Dart tiliga kirish: Qat\'iy tiplash va Sound Null Safety',
      concept: `Dart — это объектно-ориентированный язык со строгой статической типизацией, разработанный Google. Он является базовым языком для фреймворка Flutter.

Два режима компиляции (уникальная фишка Dart):
1. JIT (Just-In-Time): во время разработки код компилируется прямо на лету, обеспечивая мгновенный Stateful Hot Reload (сохранение состояния UI за 200 мс).
2. AOT (Ahead-Of-Time): при сборке релиза код компилируется напрямую в машинный код процессора (ARM64 / x86), давая максимальную скорость и запуск без тяжелой виртуальной машины.

Что такое Sound Null Safety:
В Dart переменная по умолчанию НИКОГДА не может быть null, если вы явно не разрешили это через оператор ?:
• String name = 'Alisher'; // Не может быть null. Ошибка компиляции, если присвоить null!
• String? bio = null;      // Может содержать строку ИЛИ null.

Специальные операторы Null Safety:
• ?. (Safe navigation): bio?.length — вернет null, если bio равен null, вместо выброса исключения.
• ?? (Null-coalescing): bio ?? 'Биография отсутствует' — fallback значение по умолчанию.
• ! (Bang operator / Force unwrap): bio!.length — гарантирует компилятору, что переменная точно не null (осторожно: если там null, приложение выбросит Crash!).
• late: отложенная инициализация переменной, которая будет заполнена перед первым обращением.`,
      concept_uz: `Dart — Google tomonidan yaratilgan, qat'iy statik tiplarga ega ob'ektga yo'naltirilgan dasturlash tili. U Flutter freymvorkining asosi hisoblanadi.

Ikkita kompilyatsiya rejimi:
1. JIT (Just-In-Time): dasturlash jarayonida kod to'g'ridan-to'g'ri ishlab, Hot Reload (kodni 200ms-da yangilash) imkonini beradi.
2. AOT (Ahead-Of-Time): reliz yig'ilganda kod to'g'ridan-to'g'ri protsessor mashina kodiga (ARM64) aylanadi va eng yuqori tezlikda ishlaydi.

Sound Null Safety mohiyati:
Dart-da o'zgaruvchilar standart bo'yicha HECH QACHON null bo'la olmaydi (? qo'yilmasa):
• String name = 'Alisher'; // null bo'lishi mumkin emas, kompilyator xato beradi!
• String? bio = null;      // satr YOKI null bo'lishi mumkin.

Null operatorlari: ?. (xavfsiz murojaat), ?? (standart qiymat berish), ! (majburiy ochish), late (kechiktirilgan e'lon).`,
      codeTitle: 'Чистый Dart: Класс модели, именованные параметры и Null Safety',
      codeTitle_uz: 'Toza Dart: Model klassi, nomlangan parametrlar va Null Safety',
      code: `// Пример современной модели данных в Dart с неизменяемостью (immutability)
class Developer {
  final String id;
  final String name;
  final String? githubUsername; // nullable: может отсутствовать
  final List<String> skills;
  final DateTime registeredAt;

  // Конструктор с обязательными и опциональными именованными параметрами
  const Developer({
    required this.id,
    required this.name,
    this.githubUsername,
    this.skills = const [],     // Значение по умолчанию
    required this.registeredAt,
  });

  // Удобный метод для безопасного копирования объекта с изменениями (copyWith)
  Developer copyWith({
    String? name,
    String? githubUsername,
    List<String>? skills,
  }) {
    return Developer(
      id: this.id,
      name: name ?? this.name,
      githubUsername: githubUsername ?? this.githubUsername,
      skills: skills ?? this.skills,
      registeredAt: this.registeredAt,
    );
  }

  // Вычисляемое свойство (getter)
  String get displayProfile => 
      '👨‍💻 \$name (\${githubUsername != null ? '@\$githubUsername' : 'no github'})';
}

void main() {
  final dev = Developer(
    id: 'u-101',
    name: 'Alisher',
    githubUsername: 'alisher-dev',
    skills: ['Flutter', 'Dart', 'React Native'],
    registeredAt: DateTime.now(),
  );

  print(dev.displayProfile);
  print('Навыков: \${dev.skills.length}');
}`,
      keyPoints: [
        'Всегда объявляйте поля класса как final, если они не должны мутировать (Immutability защищает от багов).',
        'Используйте const конструкторы везде, где возможно — Dart кэширует одинаковые экземпляры в памяти.',
        'Используйте паттерн copyWith для создания обновленных копий неизменяемых моделей.',
      ],
      keyPoints_uz: [
        'Klass maydonlarini final qiling — o\'zgarmaslik (immutability) xatolardan saqlaydi.',
        'Iloji boricha const konstruktorlardan foydalaning — Dart xotiradagi nusxalarni keshlaydi.',
        'O\'zgarmas modellarni yangilash uchun copyWith andozasidan foydalaning.',
      ],
    },

    // ⚡ MIDDLE УРОВЕНЬ
    middle: {
      tag: 'MIDDLE • ПОД КАПОТОМ',
      tag_uz: 'MIDDLE • ICHKI TUZILISH',
      title: 'Event Loop, Microtasks, Future и реактивные Streams',
      title_uz: 'Event Loop, Microtasks, Future va reaktiv Streamlar',
      concept: `Как устроена асинхронность в Dart:

1. ОДНОПОТОЧНЫЙ EVENT LOOP:
Как и JavaScript, Dart исполняет код в одном главном потоке (Single-Threaded).
Но внутри Event Loop у него есть ДВЕ очереди задач с разным приоритетом:
- Microtask Queue (Очередь микротасок): имеет НАИВЫСШИЙ приоритет. Обрабатывает внутренние системные события (scheduleMicrotask).
- Event Queue (Очередь событий): внешние события I/O, таймеры (Timer), сокеты, клики пользователя, события Future.
Правило: Пока в Microtask Queue есть хотя бы одна задача, Event Queue НЕ НАЧНЕТ выполняться!

2. FUTURE И ASYNC/AWAIT:
Future<T> представляет результат вычисления, который появится в будущем (аналог Promise в JS).
Синтаксис async/await компилируется под капотом в подписку future.then() и передачу управления в Event Loop.

3. ПОТОКИ ДАННЫХ (STREAMS):
Если Future отдает результат ровно 1 раз, то Stream — это асинхронный конвейер последовательности событий во времени:
- Single-Subscription Stream: можно подписаться только 1 раз (например, чтение файла или HTTP-загрузка).
- Broadcast Stream: можно подписываться сколько угодно подписчикам параллельно (например, сокеты, координаты GPS, действия пользователя в UI).
- Операторы трансформации: map, where, debounce, distinct, asyncExpand.`,
      concept_uz: `Dart-da asinxronlik qanday ishlaydi:

1. BIR OQIMLI EVENT LOOP:
Dart bitta oqimda ishlaydi, lekin Event Loop ichida IKKITA navbat bor:
- Microtask Queue: ENG YUQORI ustuvorlikka ega (scheduleMicrotask).
- Event Queue: tashqi hodisalar, taymerlar (Timer), Future-lar.
Qoida: Microtask navbati to'liq bo'shimaguncha, Event Queue-dagi hodisalar boshlanmaydi!

2. FUTURE VA ASYNC/AWAIT:
Future bir martalik kelajakdagi qiymat (JS Promise kabi). async/await esa uni qulay o'qiladigan qiladi.

3. OQIMLAR (STREAMS):
Stream — bu vaqt bo'yicha ketma-ket keluvchi ma'lumotlar konveyeri.
- Single-Subscription: faqat 1 marta obuna bo'lish mumkin (fayl o'qish).
- Broadcast Stream: bir vaqtning o'zida bir nechta joydan tinglash mumkin (WebSocket, GPS).`,
      codeTitle: 'Работа со StreamController, трансформациями и асинхронным генератором',
      codeTitle_uz: 'StreamController, transformatsiyalar va asinxron generator',
      code: `import 'dart:async';

// Асинхронный генератор через async* возвращает поток данных по мере их поступления
Stream<int> countdownTimer(int from) async* {
  for (int i = from; i >= 0; i--) {
    await Future.delayed(const Duration(seconds: 1));
    yield i; // Отправляем очередное значение подписчикам
  }
}

void main() async {
  print('⏱️ Старт таймера...');

  // Реактивный конвейер: слушаем, фильтруем и выводим
  final subscription = countdownTimer(5)
      .where((seconds) => seconds % 2 == 0) // Только четные секунды
      .map((seconds) => 'Четная секунда: \$seconds')
      .listen(
        (message) => print('🔔 \$message'),
        onDone: () => print('🏁 Обратный отсчет завершен!'),
        onError: (err) => print('❌ Ошибка потока: \$err'),
        cancelOnError: true,
      );

  // Обязательная отмена подписки при ненадобности предотвратит утечки памяти
  // subscription.cancel();
}`,
      keyPoints: [
        'Никогда не забивайте Microtask Queue бесконечными циклами — это заблокирует обработку тачей и отрисовку кадров.',
        'Всегда закрывайте StreamController (controller.close()) и отменяйте StreamSubscription (subscription.cancel()).',
        'Используйте async* и yield для чистого создания собственных потоков данных без бойлерплейта.',
      ],
      keyPoints_uz: [
        'Microtask navbatini og\'ir sikllar bilan to\'ldirmang — bu ekran chizilishini qotirib qo\'yadi.',
        'Har doim StreamController-ni yoping (.close()) va obunalarni bekor qiling (.cancel()).',
        'Stream yaratish uchun async* va yield operatorlaridan foydalaning.',
      ],
    },

    // 🚀 SENIOR УРОВЕНЬ
    senior: {
      tag: 'SENIOR • АРХИТЕКТУРА & PROD',
      tag_uz: 'SENIOR • ARXITEKTURA & PROD',
      title: 'Isolates (Многопоточность), Память и Generational Garbage Collection',
      title_uz: 'Izolyatlar (Ko\'p oqimlilik), Xotira va Generatsion GC',
      concept: `Архитектура многопоточности и управления памятью в Dart:

1. ПОЧЕМУ В DART НЕТ ГОНОК ДАННЫХ (RACE CONDITIONS):
В традиционных языках (Java, C++) потоки делят одну общую оперативную память (Shared Memory), из-за чего требуются мьютексы, блокировки (locks) и возникают Deadlocks.
В Dart потоки изолированы друг от друга и называются ISOLATES (Изоляты):
- У каждого изолята своя собственная независимая куча памяти (Heap) и свой собственный Event Loop.
- Ни один изолят не может напрямую мутировать память другого изолята!
- Общение происходит исключительно через отправку сообщений (Message Passing) с помощью пар SendPort и ReceivePort.
- В современных версиях Dart крупные бинарные буферы могут передаваться между изолятами без копирования через Zero-Copy Transfer (передавая право владения указателем).

2. СБОРЩИК МУСОРА (GENERATIONAL GARBAGE COLLECTOR):
Dart спроектирован под отрисовку UI со скоростью 60 и 120 кадров в секунду (время на кадр всего 8–16 мс!).
Поэтому сборщик мусора разделен на 2 поколения:
• Young Generation (Scavenger): ультра-быстрая очистка короткоживущих объектов (например, виджетов, пересоздаваемых на каждом кадре). Занимает всего 1–2 мс и не вызывает видимых зависаний (jank).
• Old Generation (Mark-Sweep): медленная очистка долгоживущих объектов (синглтоны, сервисы, базы данных). Запускается реже, выполняет фазу сжатия памяти.`,
      concept_uz: `Dart-da xotira va ko'p oqimlilik arxitekturasi:

1. ISOLATES (IZOLYATLAR) — NIMA UCHUN POYGA BO'LMAYDI:
Java yoki C++ da oqimlar umumiy xotirada ishlab, deadlock keltirib chiqarishi mumkin.
Dart-da esa har bir oqim ISOLATE deb ataladi:
- Har bir izolyatning shaxsiy xotirasi (Heap) va shaxsiy Event Loop-i bor.
- Bitta izolyat boshqasining xotirasiga to'g'ridan-to'g'ri tegolmaydi.
- Ular faqat portlar (SendPort / ReceivePort) orqali xabar almashadi. Bu poyga (race condition) xavfini 0 ga tushiradi!

2. GENERATSION XOTIRA TOZALAGICH (GARBAGE COLLECTOR):
- Young Generation: bir necha millisekundda yashab o'ladigan vidjetlarni 1-2 ms ichida tozalaydi (ekran qotmaydi).
- Old Generation: uzoq yashovchi katta ob'ektlarni fonda tozaydi.`,
      codeTitle: 'Вынос тяжелых вычислений в фоновый Isolate (Isolate.run / compute)',
      codeTitle_uz: 'Og\'ir hisob-kitoblarni fonga Isolate orqali chiqarish',
      code: `import 'dart:isolate';
import 'dart:convert';

// Тяжелая функция: парсинг огромного JSON на 50 000 записей
List<Map<String, dynamic>> parseHugeDataset(String rawJson) {
  final dynamic decoded = jsonDecode(rawJson);
  if (decoded is List) {
    return decoded.cast<Map<String, dynamic>>();
  }
  return [];
}

Future<void> fetchAndProcessData(String rawJson) async {
  print('🚀 Запуск парсинга в отдельном потоке...');

  // Isolate.run автоматически создает фоновый изолят,
  // выполняет в нем функцию и возвращает результат в главный поток,
  // после чего безопасно уничтожает изолят.
  final parsed = await Isolate.run(() => parseHugeDataset(rawJson));

  print('✅ Парсинг завершен! Элементов: \${parsed.length}');
  print('📱 Главный UI-поток не заблокировался ни на 1 миллисекунду!');
}`,
      keyPoints: [
        'Для тяжелых CPU-задач (парсинг JSON > 2МБ, шифрование, обработка изображений) всегда используйте Isolate.run().',
        'Не держите глобальные статические коллекции, которые постоянно растут — сборщик мусора переместит их в Old Space, вызывая задержки.',
        'Для бесконечных фоновых задач используйте связку ReceivePort и SendPort с двусторонним протоколом сообщений.',
      ],
      keyPoints_uz: [
        'Og\'ir vazifalar uchun (katta JSON, rasm qayta ishlash) har doim Isolate.run() ishlating.',
        'Haddan tashqari o\'sib boruvchi static ro\'yxatlardan saqlaning — ular Old Space-ni to\'ldiradi.',
        'Uzoq yashovchi fon jarayonlari uchun ReceivePort va SendPort ishlating.',
      ],
    },

    proTip: {
      title: 'Каверзный вопрос на Senior Dart / Flutter собеседовании',
      title_uz: "Senior Dart intervyusidagi qiyin savol",
      content: `Вопрос: «Что произойдет, если в Dart вызвать scheduleMicrotask(() { while(true) {} })? Сможет ли пользователь нажать на кнопку или сработает ли Timer(Duration(seconds: 1), ...)?»

Правильный ответ Senior:
«Приложение намертво зависнет, интерфейс полностью перестанет реагировать на касания, а таймер НИКОГДА не сработает!
Причина кроется в строгой приоритетности Event Loop: очередь Microtask Queue имеет абсолютное преимущество перед Event Queue. Поскольку бесконечный цикл в микротаске никогда не отдаст управление, Event Loop никогда не перейдет к Event Queue, где находятся тач-события и тики таймеров. Поэтому в микротаски можно помещать только мгновенные вспомогательные операции!»`,
      content_uz: `Intervyu savoli: «Agar scheduleMicrotask(() { while(true) {} }) chaqirilsa, nima bo'ladi? Ekrandagi tugma bosiladimi yoki Timer ishlaydimi?»

Senior javobi:
«Ilova butunlay qotib qoladi, ekranga tegishlar ishlamaydi va taymer HECH QACHON ishga tushmaydi!
Chunki Dart Event Loop arxitekturasida Microtask navbati Event Queue navbatidan mutlaq ustundir. Sikl tugamaguncha, Event Loop sensorli bosishlar va taymerlar joylashgan Event Queue-ga navbat bermaydi. Shuning uchun mikrotasklarga faqat juda qisqa operatsiyalar beriladi!»`,
    },
  },
];
