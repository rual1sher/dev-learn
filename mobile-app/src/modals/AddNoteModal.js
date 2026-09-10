import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Keyboard,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AnimatedIconButton from '../components/common/AnimatedIconButton';
import AnimatedBrutalButton from '../components/common/AnimatedBrutalButton';

export default function AddNoteModal({
  visible,
  onClose,
  collectionsData,
  onSave,
  initialCategory = 'base',
  lang,
  t,
}) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [targetCategory, setTargetCategory] = useState(initialCategory);
  const [newTitle, setNewTitle] = useState('');
  const [newSnippet, setNewSnippet] = useState('');

  const titleInputRef = useRef(null);
  const snippetInputRef = useRef(null);

  const handleSave = () => {
    if (!newTitle.trim() || !newSnippet.trim()) return;
    onSave({
      categoryKey: targetCategory,
      title: newTitle.trim(),
      snippet: newSnippet.trim(),
    });
    setNewTitle('');
    setNewSnippet('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        Keyboard.dismiss();
        onClose();
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={[styles.modalOverlay, isDesktop && styles.modalOverlayDesktop]}>
          <TouchableOpacity 
            style={StyleSheet.absoluteFill} 
            activeOpacity={1} 
            onPress={() => {
              Keyboard.dismiss();
              onClose();
            }} 
          />
          <View style={[styles.modalContent, isDesktop && styles.modalContentDesktop, { maxHeight: '88%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t.newLinkTitle}</Text>
              <AnimatedIconButton
                style={styles.closeModalBtn}
                iconName="x"
                iconSize={20}
                animationType="spin90"
                onPress={() => {
                  Keyboard.dismiss();
                  onClose();
                }}
              />
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={{ paddingBottom: 16 }}
            >
              <Text style={styles.inputLabel}>{t.targetCollection}</Text>
              <View style={styles.categoryPickerRow}>
                {Object.keys(collectionsData).map(key => (
                  <AnimatedBrutalButton
                    key={key}
                    animationType="wiggle"
                    style={[
                      styles.categoryPickerPill,
                      targetCategory === key && { backgroundColor: collectionsData[key].color, borderColor: '#000' }
                    ]}
                    onPress={() => {
                      Keyboard.dismiss();
                      setTargetCategory(key);
                    }}
                  >
                    <Feather
                      name={collectionsData[key].icon || 'folder'}
                      size={12}
                      color="#000"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.categoryPickerText}>
                      {lang === 'uz' && collectionsData[key].extra_uz 
                        ? collectionsData[key].extra_uz 
                        : (collectionsData[key].extra || collectionsData[key].title)}
                    </Text>
                  </AnimatedBrutalButton>
                ))}
              </View>

              <View style={styles.inputHeaderRow}>
                <Text style={[styles.inputLabel, { marginTop: 0, marginBottom: 0 }]}>{t.linkTitleLabel}</Text>
              </View>
              <TextInput
                ref={titleInputRef}
                style={styles.modalInput}
                placeholder={t.linkTitlePlaceholder}
                placeholderTextColor="#A1A1AA"
                value={newTitle}
                onChangeText={setNewTitle}
                returnKeyType="next"
                onSubmitEditing={() => snippetInputRef.current?.focus()}
                blurOnSubmit={false}
              />

              <View style={styles.inputHeaderRow}>
                <Text style={[styles.inputLabel, { marginTop: 0, marginBottom: 0 }]}>{t.linkCodeLabel}</Text>
                <TouchableOpacity 
                  style={styles.dismissInlineBtn}
                  onPress={Keyboard.dismiss}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  activeOpacity={0.7}
                >
                  <Feather name="chevron-down" size={13} color="#000" />
                  <Text style={styles.dismissKeyboardText}>{t.dismissKeyboard}</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                ref={snippetInputRef}
                style={[styles.modalInput, { height: 75, textAlignVertical: 'top' }]}
                placeholder={t.linkCodePlaceholder}
                placeholderTextColor="#A1A1AA"
                value={newSnippet}
                onChangeText={setNewSnippet}
                multiline
              />

              <AnimatedBrutalButton
                animationType="bounce"
                style={styles.modalSaveBtn}
                onPress={handleSave}
              >
                <Text style={styles.modalSaveBtnText}>{t.saveToCollectionBtn}</Text>
              </AnimatedBrutalButton>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalOverlayDesktop: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 3.5,
    borderColor: '#000',
    borderBottomWidth: 0,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 24,
  },
  modalContentDesktop: {
    width: 520,
    maxWidth: '96%',
    borderRadius: 24,
    borderBottomWidth: 3.5,
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 10,
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
    letterSpacing: -0.4,
  },
  closeModalBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#F4F4F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#000',
    marginBottom: 6,
    marginTop: 8,
  },
  inputHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 6,
  },
  dismissInlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#000',
    gap: 4,
  },
  dismissKeyboardText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#000',
  },
  categoryPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  categoryPickerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E4E4E7',
    backgroundColor: '#F4F4F5',
  },
  categoryPickerText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000',
  },
  modalInput: {
    borderWidth: 2.5,
    borderColor: '#000',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    backgroundColor: '#FAFAFA',
    marginBottom: 10,
  },
  modalSaveBtn: {
    backgroundColor: '#FFD02F',
    borderWidth: 2.5,
    borderColor: '#000',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  modalSaveBtnText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#000',
  },
});
