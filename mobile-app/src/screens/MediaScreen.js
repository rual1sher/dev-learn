import React, { useState, useMemo, useCallback } from "react";
import { StyleSheet, View, Text, ScrollView, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { OPEN_MEDIA_RESOURCES } from "../constants/mediaResources";
import { handleOpenUrl } from "../utils/helpers";
import ScreenHeader from "../components/common/ScreenHeader";
import FolderMetaBanner from "../components/common/FolderMetaBanner";
import SearchBar from "../components/common/SearchBar";
import EmptyState from "../components/common/EmptyState";
import AnimatedIconButton from "../components/common/AnimatedIconButton";
import AnimatedBrutalButton from "../components/common/AnimatedBrutalButton";
import MediaResourceCard from "../components/media/MediaResourceCard";
import MediaInfoModal from "../modals/MediaInfoModal";

/**
 * MediaScreen — экран медиатеки (видеокурсы, подкасты, открытые лекции).
 * Стандартизирован в едином Neo-Brutalist стиле: ScreenHeader, FolderMetaBanner, SearchBar, MediaResourceCard, EmptyState.
 */
export default function MediaScreen({
  onBack,
  onCopySnippet,
  lang = "ru",
  t = {},
}) {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [mediaFilter, setMediaFilter] = useState("all");
  const [mediaLangFilter, setMediaLangFilter] = useState("all");
  const [mediaSearch, setMediaSearch] = useState("");

  const isUz = lang === "uz";

  const filteredMediaResources = useMemo(() => {
    return OPEN_MEDIA_RESOURCES.filter((item) => {
      const matchesFilter =
        mediaFilter === "all" || item.category === mediaFilter;
      const matchesLang =
        mediaLangFilter === "all" ||
        item.langCode === mediaLangFilter ||
        (mediaLangFilter === "ru" && item.langCode === "ru_en") ||
        (mediaLangFilter === "en" && item.langCode === "ru_en");

      const query = mediaSearch.toLowerCase().trim();
      if (!query) return matchesFilter && matchesLang;

      const matchesSearch =
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.title_uz && item.title_uz.toLowerCase().includes(query)) ||
        (item.desc && item.desc.toLowerCase().includes(query)) ||
        (item.desc_uz && item.desc_uz.toLowerCase().includes(query)) ||
        (item.platform && item.platform.toLowerCase().includes(query));

      return matchesFilter && matchesLang && matchesSearch;
    });
  }, [mediaFilter, mediaLangFilter, mediaSearch]);

  const handleOpenResource = useCallback(
    (url) => {
      handleOpenUrl(url, lang);
    },
    [lang],
  );

  const handleResetFilters = useCallback(() => {
    setMediaSearch("");
    setMediaFilter("all");
    setMediaLangFilter("all");
  }, []);

  return (
    <View style={styles.container}>
      {/* 1. ЕДИНЫЙ НЕО-БРУТАЛЬНЫЙ ХЕДЕР ПАПКИ */}
      <ScreenHeader
        title={t.mediaScreenTitle || (isUz ? "Media & Video" : "Медиа & Видео")}
        badgeColor="#38BDF8"
        onBack={onBack}
        rightAction={
          <AnimatedIconButton
            style={styles.infoBtn}
            iconName="info"
            iconSize={20}
            animationType="bounce"
            onPress={() => setIsInfoModalOpen(true)}
          />
        }
      />

      {/* 2. ЕДИНЫЙ МЕТА-БАННЕР ПАПКИ */}
      <FolderMetaBanner
        subtitle={
          isUz
            ? "Ochiq video va podkastlar"
            : "Открытые курсы, видео и подкасты"
        }
        desc={
          t.mediaScreenSubtitle ||
          (isUz
            ? "YouTube, Habr va IT hamjamiyatining eng sara bepul media resurslari."
            : "Лучшие бесплатные видеокурсы, подкасты и дайджесты от экспертов индустрии.")
        }
        countText={`${OPEN_MEDIA_RESOURCES.length} ${t.mediaCount || (isUz ? "resurslar" : "материалов")}`}
        tagText="MEDIA"
        tagColor="#38BDF8"
      />

      {/* 3. ЕДИНОЕ ПОЛЕ ПОИСКА */}
      <SearchBar
        value={mediaSearch}
        onChangeText={setMediaSearch}
        placeholder={
          t.mediaSearchPlaceholder ||
          (isUz
            ? "Video va kurslarni qidirish..."
            : "Поиск по видео и курсам...")
        }
        style={{ marginBottom: 10 }}
      />

      {/* 4. ФИЛЬТРЫ КАТЕГОРИЙ */}
      <View style={styles.filterScrollWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {[
            {
              key: "all",
              label: t.allTab || (isUz ? "Barchasi" : "Все"),
              icon: "grid",
            },
            {
              key: "course",
              label: t.coursesTab || (isUz ? "Kurslar" : "Курсы"),
              icon: "book-open",
            },
            {
              key: "video",
              label: t.videosTab || (isUz ? "Videolar" : "Видео"),
              icon: "video",
            },
            {
              key: "podcast",
              label: t.podcastsTab || (isUz ? "Podkastlar" : "Подкасты"),
              icon: "mic",
            },
            {
              key: "digest",
              label: t.newsTab || (isUz ? "Dayjestlar" : "Дайджесты"),
              icon: "rss",
            },
          ].map((f) => {
            const isActive = mediaFilter === f.key;
            return (
              <AnimatedBrutalButton
                key={f.key}
                animationType="hop"
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => setMediaFilter(f.key)}
              >
                <Feather
                  name={f.icon}
                  size={12}
                  color="#000000"
                  style={{ marginRight: 5 }}
                />
                <Text
                  style={[
                    styles.filterPillText,
                    isActive && styles.filterPillTextActive,
                  ]}
                >
                  {f.label}
                </Text>
              </AnimatedBrutalButton>
            );
          })}
        </ScrollView>
      </View>

      {/* 5. ФИЛЬТРЫ ЯЗЫКОВ */}
      <View style={styles.langFilterScrollWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {[
            {
              key: "all",
              label: t.allLangFilter || (isUz ? "Barcha tillar" : "Все языки"),
              icon: "globe",
            },
            { key: "uz", label: "O'zbekcha", icon: null },
            { key: "ru", label: "Русский", icon: null },
            { key: "en", label: "English", icon: null },
          ].map((lf) => {
            const isActive = mediaLangFilter === lf.key;
            return (
              <AnimatedBrutalButton
                key={lf.key}
                animationType="wiggle"
                style={[
                  styles.langFilterPill,
                  isActive && styles.langFilterPillActive,
                ]}
                onPress={() => setMediaLangFilter(lf.key)}
              >
                {lf.icon ? (
                  <Feather
                    name={lf.icon}
                    size={11}
                    color="#000000"
                    style={{ marginRight: 4 }}
                  />
                ) : null}
                <Text
                  style={[
                    styles.langFilterPillText,
                    isActive && styles.langFilterPillTextActive,
                  ]}
                >
                  {lf.label}
                </Text>
              </AnimatedBrutalButton>
            );
          })}
        </ScrollView>
      </View>

      {/* 6. СПИСОК РЕСУРСОВ ИЛИ ЕДИНЫЙ EMPTY STATE С DOTTY */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredMediaResources.length === 0 ? (
          <EmptyState
            title={
              t.emptyMediaTitle ||
              (isUz ? "Resurslar topilmadi" : "Материалов не найдено")
            }
            subtitle={
              t.emptyMediaDesc ||
              (isUz
                ? "Filtr yoki qidiruv so'zini o'zgartirib ko'ring."
                : "Попробуйте изменить категорию, язык или поисковый запрос.")
            }
            onReset={handleResetFilters}
            resetLabel={isUz ? "Filtrlarni tozalash" : "Сбросить фильтры"}
          />
        ) : (
          filteredMediaResources.map((item) => (
            <MediaResourceCard
              key={item.id}
              item={item}
              lang={lang}
              onOpenUrl={handleOpenResource}
              onCopyUrl={onCopySnippet}
            />
          ))
        )}
      </ScrollView>

      {/* ИНФОРМАЦИОННОЕ МОДАЛЬНОЕ ОКНО МЕДИАТЕКИ */}
      <MediaInfoModal
        visible={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        lang={lang}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Platform.OS === "web" ? 36 : 20,
    backgroundColor: "#FFFFFF",
  },
  infoBtn: {
    width: 44,
    height: 44,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  filterScrollWrap: {
    marginBottom: 6,
  },
  langFilterScrollWrap: {
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 2,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#000000",
    shadowColor: "#000000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  filterPillActive: {
    backgroundColor: "#38BDF8",
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#000000",
  },
  filterPillTextActive: {
    fontWeight: "900",
  },
  langFilterPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#000000",
    shadowColor: "#000000",
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 1,
  },
  langFilterPillActive: {
    backgroundColor: "#FEF08A",
  },
  langFilterPillText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#000000",
  },
  langFilterPillTextActive: {
    fontWeight: "900",
  },
  scrollContent: {
    paddingBottom: 36,
  },
});
