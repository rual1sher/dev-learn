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
