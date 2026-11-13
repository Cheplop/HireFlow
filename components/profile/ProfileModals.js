import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { X } from 'lucide-react-native';

import { EDUCATION_GROUPS } from '../../screens/ProfileScreen.data';
import { styles } from '../../screens/ProfileScreen.styles';
import theme from '../../styles/theme';

export function ProfileEditorModal({
  editor,
  config,
  form,
  setForm,
  error,
  setError,
  onClose,
  onSave,
}) {
  return (
    <Modal
      visible={!!editor}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalBackdrop}
      >
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editor?.type === 'profile' || editor?.type === 'about'
                ? `Edit ${config?.title}`
                : `${editor?.id ? 'Edit' : 'Add'} ${config?.title}`}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={onClose}
              hitSlop={8}
            >
              <X size={20} color={theme.fontColor.secondary} />
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalBody}
          >
            {config?.hasGroup && (
              <View>
                <Text style={styles.fieldLabel}>Level</Text>
                <View style={styles.skills}>
                  {EDUCATION_GROUPS.map((group) => {
                    const selected = form.group === group;

                    return (
                      <Pressable
                        key={group}
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        onPress={() => setForm((prev) => ({ ...prev, group }))}
                        style={[styles.sectionTab, selected && styles.selectedSectionTab]}
                      >
                        <Text
                          style={[styles.sectionTabText, selected && styles.selectedSectionTabText]}
                        >
                          {group}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            {config?.fields.map((field) => (
              <View key={field.key}>
                <Text style={styles.fieldLabel}>
                  {field.label}{field.required ? ' *' : ''}
                </Text>
                <TextInput
                  value={form[field.key] ?? ''}
                  onChangeText={(text) => {
                    setError('');
                    setForm((prev) => ({ ...prev, [field.key]: text }));
                  }}
                  multiline={!!field.multiline}
                  placeholderTextColor={theme.fontColor.secondary}
                  style={[styles.input, field.multiline && styles.inputMultiline]}
                />
              </View>
            ))}

            {!!error && <Text style={styles.errorText}>{error}</Text>}
          </ScrollView>

          <View style={styles.modalFooter}>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={[styles.sectionTab, styles.footerButton]}
            >
              <Text style={styles.sectionTabText}>Cancel</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onSave}
              style={[styles.sectionTab, styles.selectedSectionTab, styles.footerButton]}
            >
              <Text style={[styles.sectionTabText, styles.selectedSectionTabText]}>
                Save changes
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export function ProfilePhotoModal({
  photoTarget,
  hasPhoto,
  onPickPhoto,
  onRemovePhoto,
  onClose,
}) {
  return (
    <Modal
      visible={!!photoTarget}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={[styles.modalSheet, styles.photoSheet]} onPress={() => {}}>
          <Text style={styles.modalTitle}>
            {photoTarget === 'avatar' ? 'Profile photo' : 'Cover photo'}
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => onPickPhoto(photoTarget, 'library')}
            style={[styles.sectionTab, styles.photoOption]}
          >
            <Text style={styles.sectionTabText}>Choose from library</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => onPickPhoto(photoTarget, 'camera')}
            style={[styles.sectionTab, styles.photoOption]}
          >
            <Text style={styles.sectionTabText}>Take a photo</Text>
          </Pressable>
          {hasPhoto && (
            <Pressable
              accessibilityRole="button"
              onPress={() => onRemovePhoto(photoTarget)}
              style={[styles.sectionTab, styles.photoOption, styles.removeOption]}
            >
              <Text style={[styles.sectionTabText, styles.deleteText]}>Remove photo</Text>
            </Pressable>
          )}
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={[styles.sectionTab, styles.photoOption]}
          >
            <Text style={styles.sectionTabText}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
