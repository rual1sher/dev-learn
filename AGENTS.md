# 🤖 AI Agent Guidelines & Architecture Rules (AGENTS.md)
# Targets: Gemini, Claude, GPT, Antigravity, Cursor, Zed, Copilot

## 🚨 MANDATORY INSTRUCTION: LOG EVERY CHANGE (СВЕРХВАЖНОЕ ПРАВИЛО)

Every AI assistant (Gemini, Claude, GPT, Antigravity, or any other LLM/agent) working on this project **MUST STRICTLY ADHERE** to the following rule:

### 1. Mandatory Logging in `CHANGELOG.md`
- **EVERY CHANGE** (code edits, new features, file deletions, refactoring, bug fixes, dependency updates, architectural decisions) **MUST BE RECORDED** in the file [`CHANGELOG.md`](./CHANGELOG.md).
- **NO EXCEPTIONS.** Do not finish your response without updating `CHANGELOG.md` whenever changes are made.
- When an architecture change occurs (e.g. adding a new table in SQLite, changing an API endpoint, adding a screen or service in `mobile-app`), you must explain **what** changed and **why** (architectural consequences).

### 2. Log Entry Format
Add the new entry to the top of the "История изменений" section in `CHANGELOG.md`:

```markdown
### [YYYY-MM-DD HH:MM] Short title of change
- **Автор:** AI (<Name: Gemini / Claude / GPT>) | Разработчик (alisher)
- **Тип:** Архитектура | Новая фича | Рефакторинг | Багфикс | Зависимости
- **Затронутые модули/файлы:** `path/to/file1`, `path/to/file2`
- **Что сделано:** Описание изменений.
- **Архитектурные последствия:** Влияние на систему, API, стек или структуру.
```

---

## 🏛 Project Architecture Summary

- **Architecture Type:** 2-tier monorepo / workspace:
  1. `api/` — Backend REST API (Node.js, Express.js 5, better-sqlite3, SQLite, Spaced Repetition SuperMemo SM-2).
  2. `mobile-app/` — Cross-platform client for Android, iOS, and Web (React Native 0.86, Expo 57, React Native Web, Neo-Brutalism Design, Dotty Mascot, i18n RU/UZ).
- **Web Client:** There is NO separate `client/` folder. The web version is powered directly by `mobile-app` via `react-native-web` (`npm run dev:web`). Do NOT recreate `client/` unless explicitly instructed.
- **Design System:** Neo-Brutalism (thick 2-3px black borders, hard offset shadows `4px 4px 0px #000`, vibrant contrast colors, interactive mascot Dotty).
- **Database:** Local SQLite database located at `api/database.db`.

---

## 🛠 Golden Rules for AI
1. **Never break existing functionality** in `mobile-app` or `api`.
2. **Always preserve comments and docstrings.**
3. **Always log all modifications into [`CHANGELOG.md`](./CHANGELOG.md).**
4. **Never duplicate existing components or code:** Check `mobile-app/src/components/common/` before creating any button, input, header, or animation.
5. **Follow Clean & Performant Architecture standards** detailed below.

---

## 📐 UI Component Architecture & Folder Standardization Guide

Каждый разработчик и AI обязан придерживаться единого стандарта при работе с папками и экранами в `mobile-app/src`:

### 1. Структура директорий `mobile-app/src/`:
```text
mobile-app/src/
├── components/
│   ├── common/              # Универсальные переиспользуемые примитивы
│   │   ├── ScreenHeader.js       # Единый нео-брутальный хедер для всех экранов
│   │   ├── FolderMetaBanner.js   # Единый блок описания и метаданных папки
│   │   ├── SearchBar.js          # Единая строка поиска с кнопкой сброса
│   │   ├── EmptyState.js         # Единое пустое состояние с маскотом Dotty
│   │   ├── AnimatedIconButton.js # Кнопка-иконка с физикой анимаций
│   │   ├── AnimatedBrutalButton.js # Основная нео-брутальная кнопка с тактильным эффектом
│   │   ├── AnimatedCopyButton.js # Тактильная кнопка копирования в буфер
│   │   ├── AnimatedDotty.js      # Интерактивный анимированный талисман Dotty
│   │   ├── AnimatedLangToggle.js # Переключатель языка RU / UZ
│   │   └── LangSwitchToast.js    # Всплывающее уведомление о смене языка
│   ├── collection/          # Компоненты папок коллекций (CollectionEntryCard)
│   ├── lessons/             # Компоненты интерактивных уроков (LessonCard)
│   ├── media/               # Компоненты медиатеки (MediaResourceCard)
│   ├── home/                # Компоненты главного экрана (AnimatedFolderCard)
│   └── blitz/               # Компоненты блиц-викторины (AnimatedChoiceButton)
├── screens/                 # Контейнеры экранов (чистая логика без спагетти)
│   ├── HomeScreen.js
│   ├── CollectionScreen.js
│   ├── LessonsCatalogScreen.js
│   ├── MediaScreen.js
│   ├── LessonScreen.js
│   └── BlitzScreen.js
├── modals/                  # Все модальные окна вынесены отдельно
│   ├── AboutModal.js
│   ├── AddNoteModal.js
│   ├── SettingsModal.js
│   ├── LessonsInfoModal.js
│   └── MediaInfoModal.js
├── constants/               # Данные, темы и переводы
└── utils/                   # Утилиты (хелперы, clipboard, url-opening)
```

### 2. Единый шаблон экрана папки (Folder Screen Pattern):
Каждый экран папки (`CollectionScreen`, `LessonsCatalogScreen`, `MediaScreen`, `BlitzScreen`) строится из одних и тех же стандартизированных строительных блоков:
1. `<ScreenHeader title={...} badgeColor={...} onBack={...} rightAction={...} />` — заголовок с кнопкой назад и бейджем.
2. `<FolderMetaBanner subtitle={...} desc={...} countText={...} tagText={...} />` — описание и метаданные.
3. `<SearchBar value={query} onChangeText={setQuery} placeholder={...} />` — строка поиска с кнопкой мгновенного сброса.
4. `<ScrollView>` со списком мемоизированных карточек (`React.memo`) или `<EmptyState />` с маскотом Dotty.

### 3. Правила производительности (Performance Rules):
1. **Мемоизация списков:** Все карточки (`CollectionEntryCard`, `LessonCard`, `MediaResourceCard`, `AnimatedFolderCard`) ОБЯЗАНЫ быть обернуты в `React.memo()`.
2. **Коллбэки:** Обработчики кликов внутри экранов должны оборачиваться в `useCallback`, чтобы избежать лишних ре-рендеров дочерних карточек.
3. **Фильтрация и поиск:** Все операции поиска и фильтрации массивов данных выполняются через `useMemo()`.
4. **Контракт Neo-Brutalism:** 
   - Рамки строго черные (`#000000`, толщина `2px - 2.5px`).
   - Тени жесткие со смещением без размытия (`shadowOffset: { width: 3, height: 3 }`, `shadowOpacity: 1`, `shadowRadius: 0`).
   - Скругления: `12px` (кнопки/инпуты), `16px` (карточки), `20px` (модалки).
