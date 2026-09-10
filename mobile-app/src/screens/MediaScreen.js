import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AnimatedIconButton from '../components/common/AnimatedIconButton';
import AnimatedCopyButton from '../components/common/AnimatedCopyButton';
import AnimatedBrutalButton from '../components/common/AnimatedBrutalButton';
import AnimatedDotty from '../components/common/AnimatedDotty';
import { OPEN_MEDIA_RESOURCES } from '../constants/mediaResources';
import { handleOpenUrl } from '../utils/helpers';

export default function MediaScreen({
  onBack,
  onCopySnippet,
  lang,
  t,
}) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [mediaFilter, setMediaFilter] = useState('all');
  const [mediaLangFilter, setMediaLangFilter] = useState('all');
  const [mediaSearch, setMediaSearch] = useState('');

  const filteredMediaResources = OPEN_MEDIA_RESOURCES.filter(item => {
    const matchesFilter = mediaFilter === 'all' || item.category === mediaFilter;
    const matchesLang = 
      mediaLangFilter === 'all' ||
      item.langCode === mediaLangFilter ||
      (mediaLangFilter === 'ru' && item.langCode === 'ru_en') ||
      (mediaLangFilter === 'en' && item.langCode === 'ru_en');
    
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

  const getMediaActionInfo = (item) => {
    const isUz = lang === 'uz';
    switch (item.category) {
      case 'course':
        return {
          icon: 'book-open',
          label: isUz ? "Kursni ochish" : "Открыть курс",
        };
      case 'podcast':
        return {
          icon: 'headphones',
          label: isUz ? "Podkastni tinglash" : "Слушать подкаст",
        };
      case 'digest':
        return {
          icon: 'file-text',
          label: isUz ? "Dayjestni o'qish" : "Читать дайджест",
        };
      case 'video':
      default:
        return {
          icon: 'play',
          label: isUz ? "Videoni ko'rish" : "Смотреть видео",
        };
    }
  };

  return (
    <View style={styles.collectionScreen}>
      {/* Header */}
      <View style={styles.feedHeader}>
        <AnimatedIconButton
          style={styles.brutalIconButton}
          iconName="arrow-left"
          iconSize={20}
          animationType="nudge"
          onPress={onBack}
        />

        <View style={[styles.collectionHeaderBadge, { backgroundColor: '#38BDF8' }]}>
          <Text
            style={styles.collectionHeaderTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {t.mediaScreenTitle}
          </Text>
        </View>

        <AnimatedIconButton
          style={styles.brutalIconButton}
          iconName="info"
          iconSize={20}
          animationType="bounce"
          onPress={() => setIsInfoModalOpen(true)}
        />
      </View>

      <Text style={styles.collectionDesc}>{t.mediaScreenSubtitle}</Text>

      {/* Note banner */}
      <View style={styles.mediaNoteBanner}>
        <Feather name="zap" size={14} color="#0284C7" style={{ marginRight: 6 }} />
        <Text style={styles.mediaNoteText}>{t.noDownloadNote}</Text>
      </View>

      {/* Search Input */}
      <View style={[styles.inputBox, { height: 46, marginBottom: 12, borderRadius: 12 }]}>
        <Feather name="search" size={16} color="#71717A" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.textInput}
          placeholder={t.mediaSearchPlaceholder}
          placeholderTextColor="#71717A"
          value={mediaSearch}
          onChangeText={setMediaSearch}
        />
        {mediaSearch.length > 0 ? (
          <TouchableOpacity onPress={() => setMediaSearch('')}>
            <Feather name="x" size={16} color="#000" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Pills */}
      <View style={{ marginBottom: 4, overflow: 'visible' }}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={{ overflow: 'visible' }}
          contentContainerStyle={styles.mediaFilterContainer}
        >
          {[
            { key: 'all', label: t.allTab, icon: 'grid' },
            { key: 'course', label: t.coursesTab, icon: 'book-open' },
            { key: 'video', label: t.videosTab, icon: 'video' },
            { key: 'podcast', label: t.podcastsTab, icon: 'mic' },
            { key: 'news', label: t.newsTab, icon: 'rss' },
          ].map(f => (
            <AnimatedBrutalButton
              key={f.key}
              animationType="hop"
              style={[
                styles.mediaFilterPill,
                mediaFilter === f.key && styles.mediaFilterPillActive
              ]}
              onPress={() => setMediaFilter(f.key)}
            >
              <Feather
                name={f.icon}
                size={13}
                color="#000000"
                style={{ marginRight: 6 }}
              />
              <Text style={[
                styles.mediaFilterText,
                mediaFilter === f.key && styles.mediaFilterTextActive
              ]}>
                {f.label}
              </Text>
            </AnimatedBrutalButton>
          ))}
        </ScrollView>
      </View>

      {/* Language Filters */}
      <View style={{ marginBottom: 8, overflow: 'visible' }}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={{ overflow: 'visible' }}
          contentContainerStyle={styles.mediaLangFilterContainer}
        >
          {[
            { key: 'all', label: t.allLangFilter, icon: 'globe' },
            { key: 'uz', label: "O'zbekcha", icon: null },
            { key: 'ru', label: 'Русский', icon: null },
            { key: 'en', label: 'English', icon: null },
          ].map(lf => (
            <AnimatedBrutalButton
              key={lf.key}
              animationType="wiggle"
              style={[
                styles.mediaLangFilterPill,
                mediaLangFilter === lf.key && styles.mediaLangFilterPillActive
              ]}
              onPress={() => setMediaLangFilter(lf.key)}
            >
              {lf.icon ? (
                <Feather
                  name={lf.icon}
                  size={12}
                  color="#000000"
                  style={{ marginRight: 5 }}
                />
              ) : null}
              <Text style={[
                styles.mediaLangFilterText,
                mediaLangFilter === lf.key && styles.mediaLangFilterTextActive
              ]}>
                {lf.label}
              </Text>
            </AnimatedBrutalButton>
          ))}
        </ScrollView>
      </View>

      {/* List of Media Cards */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 36 }}>
        {filteredMediaResources.length === 0 ? (
          <View style={styles.emptyMediaBox}>
            <Feather name="search" size={32} color="#A1A1AA" style={{ marginBottom: 8 }} />
            <Text style={styles.emptyMediaTitle}>{t.emptyMediaTitle}</Text>
            <Text style={styles.emptyMediaSubtitle}>{t.emptyMediaDesc}</Text>
          </View>
        ) : (
          filteredMediaResources.map((item) => {
            const actionInfo = getMediaActionInfo(item);
            return (
              <View key={item.id} style={styles.mediaCard}>
                <View style={styles.mediaCardHeader}>
                  <View style={styles.mediaHeaderBadges}>
                    <View style={styles.mediaPlatformBadge}>
                      <Feather name={item.platform_icon || 'video'} size={12} color="#000" style={{ marginRight: 4 }} />
                      <Text style={styles.mediaPlatformText}>{item.platform}</Text>
                    </View>

                    <View style={[
                      styles.mediaLangBadge,
                      item.langCode === 'uz' && styles.langBadgeUz,
                      item.langCode === 'ru' && styles.langBadgeRu,
                      item.langCode === 'en' && styles.langBadgeEn,
                      item.langCode === 'ru_en' && styles.langBadgeBilingual,
                    ]}>
                      <Text style={styles.mediaLangBadgeText}>
                        {lang === 'uz' && item.langBadge_uz ? item.langBadge_uz : item.langBadge}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.mediaDurationBadge}>
                    <Text style={styles.mediaDurationText}>
                      {lang === 'uz' && item.duration_uz ? item.duration_uz : item.duration}
                    </Text>
                  </View>
                </View>

                <Text style={styles.mediaCardTitle}>
                  {lang === 'uz' && item.title_uz ? item.title_uz : item.title}
                </Text>

                <Text style={styles.mediaCardDesc}>
                  {lang === 'uz' && item.desc_uz ? item.desc_uz : item.desc}
                </Text>

                <View style={styles.mediaUrlBox}>
                  <Feather name="globe" size={13} color="#71717A" style={{ marginRight: 6 }} />
                  <Text style={styles.mediaUrlText} numberOfLines={1}>{item.url}</Text>
                </View>

                <View style={styles.mediaActionRow}>
                  <AnimatedBrutalButton
                    animationType="hop"
                    style={styles.mediaWatchBtn}
                    onPress={() => handleOpenUrl(item.url, lang)}
                  >
                    <View style={styles.mediaWatchBtnInner}>
                      <Feather name={actionInfo.icon} size={15} color="#000" style={{ marginRight: 6 }} />
                      <Text style={styles.mediaWatchBtnText}>{actionInfo.label}</Text>
                      <Feather name="arrow-up-right" size={15} color="#000" style={{ marginLeft: 4 }} />
                    </View>
                  </AnimatedBrutalButton>

                  <AnimatedCopyButton
                    style={styles.mediaCopyBtn}
                    onPress={() => onCopySnippet(item.url)}
                  />
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* ИНФО-МОДАЛКА: О РАЗДЕЛЕ КУРСОВ И ВИДЕО (РАБОТАЕТ НА WEB И MOBILE) */}
      <Modal
        visible={isInfoModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsInfoModalOpen(false)}
      >
        <View style={[styles.infoModalOverlay, isDesktop && styles.infoModalOverlayDesktop]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setIsInfoModalOpen(false)}
          />
          <View style={[styles.infoModalContent, isDesktop && styles.infoModalContentDesktop]}>
            {/* Заголовок модалки */}
            <View style={styles.infoModalHeader}>
              <View style={styles.infoModalTitleGroup}>
                <View style={[styles.infoIconPill, { backgroundColor: '#38BDF8' }]}>
                  <Feather name="tv" size={18} color="#000" />
                </View>
                <View>
                  <Text style={styles.infoModalTitle}>
                    {lang === 'uz' ? "Ochiq resurslar" : "Открытые ресурсы"}
                  </Text>
                  <Text style={styles.infoModalSubHeader}>
                    {lang === 'uz' ? "DevLearn Media Hub" : "Медиа-хаб DevLearn"}
                  </Text>
                </View>
              </View>
              <AnimatedIconButton
                style={styles.infoCloseBtn}
                iconName="x"
                iconSize={18}
                animationType="spin90"
                onPress={() => setIsInfoModalOpen(false)}
              />
            </View>

            {/* Описание и карточки */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.infoModalScrollView}
              contentContainerStyle={{ paddingBottom: 6 }}
            >
              {/* Mascot Dotty Intro Banner */}
              <View style={styles.mascotBannerCard}>
                <View style={styles.mascotAvatarBox}>
                  <AnimatedDotty size={42} animated={true} />
                </View>
                <View style={styles.mascotTextBox}>
                  <View style={styles.mascotBadgePill}>
                    <Feather name="zap" size={11} color="#000" style={{ marginRight: 4 }} />
                    <Text style={styles.mascotBadgeText}>
                      {lang === 'uz' ? "DOTTY MASLAHATLARI" : "СОВЕТ ТАЛИСМАНА DOTTY"}
                    </Text>
                  </View>
                  <Text style={styles.mascotLeadText}>
                    {lang === 'uz'
                      ? "Eng sara ochiq videodars, podkast va kurslarni saralab to'pladik: xotirani band qilmaydi, bevosita asl manbada ochiladi!"
                      : "Мы отобрали лучшие открытые видеокурсы, подкасты и лекции: они не занимают память устройства и открываются напрямую в оригинале!"}
                  </Text>
                </View>
              </View>

              {/* 1. Карточка: 100% Бесплатно и Открыто */}
              <View style={styles.infoFeatureCard}>
                <View style={[styles.featureIconBadge, { backgroundColor: '#BBF7D0' }]}>
                  <Feather name="check-circle" size={18} color="#000" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.featureTitleRow}>
                    <Text style={styles.featureTitle}>
                      {lang === 'uz' ? "100% Bepul va Ochiq" : "100% Бесплатно и Открыто"}
                    </Text>
                    <View style={[styles.miniBadge, { backgroundColor: '#BBF7D0' }]}>
                      <Text style={styles.miniBadgeText}>NO PAYWALL</Text>
                    </View>
                  </View>
                  <Text style={styles.featureText}>
                    {lang === 'uz'
                      ? "Hech qanday pullik obunalar yoki yashirin to'lovlarsiz to'liq ochiq ta'lim."
                      : "Никаких платных подписок, скрытых ограничений или пейволлов."}
                  </Text>
                </View>
              </View>

              {/* 2. Карточка: Знания на 3 языках */}
              <View style={styles.infoFeatureCard}>
                <View style={[styles.featureIconBadge, { backgroundColor: '#FED7AA' }]}>
                  <Feather name="globe" size={18} color="#000" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featureTitle}>
                    {lang === 'uz' ? "3 xil tildagi bilimlar" : "Знания на 3 языках"}
                  </Text>
                  <View style={styles.pillTagRow}>
                    <View style={[styles.langPillBadge, { backgroundColor: '#BAE6FD' }]}>
                      <Text style={styles.langPillText}>O'ZBEK</Text>
                    </View>
                    <View style={[styles.langPillBadge, { backgroundColor: '#FEF08A' }]}>
                      <Text style={styles.langPillText}>РУССКИЙ</Text>
                    </View>
                    <View style={[styles.langPillBadge, { backgroundColor: '#FBCFE8' }]}>
                      <Text style={styles.langPillText}>ENGLISH</Text>
                    </View>
                  </View>
                  <Text style={styles.featureText}>
                    {lang === 'uz'
                      ? "O'z ona tilingizda o'rganing yoki original ingliz tilidagi manbalar orqali texnik darajangizni oshiring."
                      : "Фильтруйте контент в один клик: учитесь на родном языке или прокачивайте технический английский."}
                  </Text>
                </View>
              </View>

              {/* 3. Карточка: Прямой переход */}
              <View style={styles.infoFeatureCard}>
                <View style={[styles.featureIconBadge, { backgroundColor: '#C084FC' }]}>
                  <Feather name="external-link" size={18} color="#000" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featureTitle}>
                    {lang === 'uz' ? "To'g'ridan-to'g'ri o'tish" : "Прямой запуск в плеере"}
                  </Text>
                  <Text style={styles.featureText}>
                    {lang === 'uz'
                      ? "Tugmani bosishingiz bilan dars YouTube yoki rasmiy saytda ochiladi — 4K sifat va qulay tezlik."
                      : "По клику на кнопку урок запускается прямо в официальном YouTube или на сайте с поддержкой 4K и ускорения."}
                  </Text>
                </View>
              </View>

              {/* 4. Карточка: Кураторский отбор */}
              <View style={styles.infoFeatureCard}>
                <View style={[styles.featureIconBadge, { backgroundColor: '#F472B6' }]}>
                  <Feather name="award" size={18} color="#000" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featureTitle}>
                    {lang === 'uz' ? "Saralangan sifatli ta'lim" : "Кураторский отбор инженеров"}
                  </Text>
                  <Text style={styles.featureText}>
                    {lang === 'uz'
                      ? "Garvard (CS50), Google va eng yaxshi IT ekspertlarining sinalgan va yuqori baholangan kurslari."
                      : "Только проверенные курсы от Гарварда (CS50), Google и ведущих практиков мировой индустрии."}
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Кнопка закрытия */}
            <AnimatedBrutalButton
              animationType="hop"
              style={styles.infoOkBtn}
              onPress={() => setIsInfoModalOpen(false)}
            >
              <View style={styles.infoOkBtnRow}>
                <Feather name="check-circle" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.infoOkBtnText}>
                  {lang === 'uz' ? "Tushunarli, ko'rishga!" : "Понятно, к просмотру!"}
                </Text>
              </View>
            </AnimatedBrutalButton>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  collectionScreen: {
    flex: 1,
    width: '100%',
    maxWidth: 960,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  brutalIconButton: {
    width: 44,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  collectionHeaderBadge: {
    borderWidth: 2.5,
    borderColor: '#000',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    maxWidth: '62%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectionHeaderTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000',
    textAlign: 'center',
  },
  collectionDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: '#52525B',
    marginBottom: 12,
  },
  mediaNoteBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderWidth: 1.5,
    borderColor: '#0284C7',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  mediaNoteText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0369A1',
    flex: 1,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#000',
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
    paddingVertical: 6,
  },
  mediaFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 4,
    paddingRight: 20,
    gap: 8,
  },
  mediaLangFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 6,
    paddingHorizontal: 4,
    paddingRight: 20,
    gap: 8,
  },
  mediaFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
  },
  mediaFilterPillActive: {
    backgroundColor: '#38BDF8',
    borderColor: '#000000',
  },
  mediaFilterText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000000',
  },
  mediaFilterTextActive: {
    color: '#000000',
    fontWeight: '900',
  },
  mediaLangFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
  },
  mediaLangFilterPillActive: {
    backgroundColor: '#FED7AA',
    borderColor: '#000000',
  },
  mediaLangFilterText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#3F3F46',
  },
  mediaLangFilterTextActive: {
    color: '#000000',
    fontWeight: '900',
  },
  mediaCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.5,
    borderColor: '#000',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  mediaCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  mediaHeaderBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    flex: 1,
    marginRight: 6,
  },
  mediaPlatformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  mediaPlatformText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#000',
  },
  mediaLangBadge: {
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    backgroundColor: '#E0E7FF',
  },
  mediaLangBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000',
  },
  langBadgeUz: { backgroundColor: '#BBF7D0' },
  langBadgeRu: { backgroundColor: '#FED7AA' },
  langBadgeEn: { backgroundColor: '#E0E7FF' },
  langBadgeBilingual: { backgroundColor: '#DDD6FE' },
  mediaDurationBadge: {
    backgroundColor: '#FEF08A',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  mediaDurationText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#000',
  },
  mediaCardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
    letterSpacing: -0.3,
    marginBottom: 6,
    lineHeight: 22,
  },
  mediaCardDesc: {
    fontSize: 12,
    fontWeight: '600',
    color: '#52525B',
    lineHeight: 18,
    marginBottom: 12,
  },
  mediaUrlBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    borderWidth: 1.5,
    borderColor: '#E4E4E7',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
  },
  mediaUrlText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#71717A',
    flex: 1,
  },
  mediaActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  mediaWatchBtn: {
    flex: 1,
    backgroundColor: '#FDE047',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 2.5, height: 2.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  mediaWatchBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaWatchBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#000000',
  },
  mediaCopyBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2.5, height: 2.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  emptyMediaBox: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyMediaTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
    marginBottom: 4,
  },
  emptyMediaSubtitle: {
    fontSize: 13,
    color: '#71717A',
    textAlign: 'center',
  },
  infoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  infoModalOverlayDesktop: {
    padding: 30,
  },
  infoModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2.5,
    borderColor: '#000000',
    padding: 18,
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  infoModalContentDesktop: {
    maxWidth: 530,
    padding: 22,
  },
  infoModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  infoModalTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  infoIconPill: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  infoModalTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#000000',
  },
  infoModalSubHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 1,
  },
  infoCloseBtn: {
    width: 34,
    height: 34,
    backgroundColor: '#F4F4F5',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoModalScrollView: {
    maxHeight: 420,
    marginBottom: 12,
  },
  mascotBannerCard: {
    flexDirection: 'row',
    backgroundColor: '#FEF9C3',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
    gap: 10,
  },
  mascotAvatarBox: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotTextBox: {
    flex: 1,
  },
  mascotBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FDE047',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginBottom: 4,
  },
  mascotBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#000',
  },
  mascotLeadText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 16,
  },
  infoFeatureCard: {
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    padding: 11,
    marginBottom: 10,
    gap: 12,
    alignItems: 'flex-start',
  },
  featureIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1.8,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  featureTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  featureTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 3,
  },
  miniBadge: {
    borderWidth: 1.2,
    borderColor: '#000',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  miniBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#000',
  },
  pillTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 5,
  },
  langPillBadge: {
    borderWidth: 1.2,
    borderColor: '#000',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  langPillText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#000',
  },
  featureText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#4B5563',
    lineHeight: 16.5,
  },
  infoOkBtn: {
    backgroundColor: '#000000',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000000',
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  infoOkBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoOkBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '900',
  },
});
