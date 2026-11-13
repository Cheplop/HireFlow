import { useEffect, useMemo, useState } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { File, Paths } from 'expo-file-system';
import { SafeAreaView } from 'react-native-safe-area-context';

import ProfileContent from '../components/profile/ProfileContent';
import { ProfileEditorModal, ProfilePhotoModal } from '../components/profile/ProfileModals';
import {
  FORMS,
  initialAbout,
  initialCertificates,
  initialEducation,
  initialExperience,
  initialProfile,
  makeId,
  PHOTO_STORAGE_KEY,
  sections,
} from './ProfileScreen.data';
import { styles } from './ProfileScreen.styles';

export default function ProfileScreen() {
  const [activeSection, setActiveSection] = useState('Education');
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const query = search.trim().toLowerCase();

  const [profile, setProfile] = useState(initialProfile);
  const [education, setEducation] = useState(initialEducation);
  const [experience, setExperience] = useState(initialExperience);
  const [certificates, setCertificates] = useState(initialCertificates);
  const [about, setAbout] = useState(initialAbout);

  // Photos: local image URIs (null = show the default placeholder)
  const [avatarUri, setAvatarUri] = useState(null);
  const [coverUri, setCoverUri] = useState(null);
  const [photoTarget, setPhotoTarget] = useState(null); // 'avatar' | 'cover' | null
  const [photosReady, setPhotosReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadPhotos = async () => {
      try {
        const savedPhotos = await AsyncStorage.getItem(PHOTO_STORAGE_KEY);
        if (!savedPhotos) return;

        const photos = JSON.parse(savedPhotos);
        if (isMounted) {
          setAvatarUri(typeof photos.avatarUri === 'string' ? photos.avatarUri : null);
          setCoverUri(typeof photos.coverUri === 'string' ? photos.coverUri : null);
        }
      } catch (loadError) {
        if (isMounted) {
          Alert.alert(
            'Could not load photos',
            loadError instanceof Error ? loadError.message : 'Please try again.'
          );
        }
      } finally {
        if (isMounted) setPhotosReady(true);
      }
    };

    loadPhotos();
    return () => {
      isMounted = false;
    };
  }, []);

  // editor = { type: 'profile' | 'education' | ..., id: string | null }
  const [editor, setEditor] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');

  const filteredEducation = useMemo(
    () => education.filter((item) =>
      `${item.group} ${item.title} ${item.subtitle}`.toLowerCase().includes(query)
    ),
    [education, query]
  );
  const filteredExperience = useMemo(
    () => experience.filter((item) =>
      `${item.title} ${item.subtitle} ${item.description}`.toLowerCase().includes(query)
    ),
    [experience, query]
  );
  const filteredCertificates = useMemo(
    () => certificates.filter((item) =>
      `${item.title} ${item.subtitle}`.toLowerCase().includes(query)
    ),
    [certificates, query]
  );

  const lists = {
    education: [education, setEducation],
    experience: [experience, setExperience],
    certificates: [certificates, setCertificates],
  };

  // ---------- Editor helpers ----------
  const openEditor = (type, item = null) => {
    let values = {};

    if (type === 'profile') {
      values = { ...profile };
    } else if (type === 'about') {
      values = {
        text: about.text,
        skills: about.skills.join(', '),
        availability: about.availability,
      };
    } else if (type === 'experience') {
      values = item
        ? {
            title: item.title,
            subtitle: item.subtitle,
            date: item.date,
            location: item.details?.[0] ?? '',
            type: item.details?.[1] ?? '',
            description: item.description ?? '',
          }
        : {};
    } else if (type === 'education') {
      values = item ? { ...item } : { group: 'Tertiary' };
    } else {
      values = item ? { ...item } : {};
    }

    setForm(values);
    setError('');
    setEditor({ type, id: item?.id ?? null });
  };

  const closeEditor = () => {
    setEditor(null);
    setForm({});
    setError('');
  };

  const saveEditor = () => {
    const config = FORMS[editor.type];
    const missing = config.fields.find((f) => f.required && !form[f.key]?.trim());

    if (missing) {
      setError(`${missing.label} is required.`);
      return;
    }

    const clean = (key) => (form[key] ?? '').trim();

    if (editor.type === 'profile') {
      setProfile({ name: clean('name'), location: clean('location') });
    } else if (editor.type === 'about') {
      setAbout({
        text: clean('text'),
        skills: clean('skills')
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),
        availability: clean('availability'),
      });
    } else {
      const [, setList] = lists[editor.type];
      let record;

      if (editor.type === 'experience') {
        record = {
          title: clean('title'),
          subtitle: clean('subtitle'),
          date: clean('date'),
          details: [clean('location'), clean('type')],
          description: clean('description'),
        };
      } else if (editor.type === 'education') {
        record = {
          group: form.group || 'Other',
          title: clean('title'),
          subtitle: clean('subtitle'),
          date: clean('date'),
        };
      } else {
        record = {
          title: clean('title'),
          subtitle: clean('subtitle'),
          date: clean('date'),
        };
      }

      if (editor.id) {
        setList((prev) => prev.map((entry) => (
          entry.id === editor.id ? { ...entry, ...record } : entry
        )));
      } else {
        setList((prev) => [...prev, { id: makeId(editor.type), ...record }]);
      }
    }

    closeEditor();
  };

  const confirmDelete = (type, item) => {
    Alert.alert(
      'Delete entry',
      `Remove "${item.title}" from your profile?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => lists[type][1]((prev) => prev.filter((entry) => entry.id !== item.id)),
        },
      ]
    );
  };

  const confirmClearAbout = () => {
    Alert.alert(
      'Clear about section',
      'This removes your about text, skills and availability.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => setAbout({ text: '', skills: [], availability: '' }),
        },
      ]
    );
  };

  // ---------- Photo helpers ----------
  const pickPhoto = async (target, source) => {
    setPhotoTarget(null);

    try {
      const options = {
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: target === 'avatar' ? [1, 1] : [3, 1],
        quality: 0.8,
        base64: Platform.OS === 'web',
      };
      let result;

      if (source === 'camera') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert('Camera access needed', 'Allow camera access in your settings to take a photo.');
          return;
        }
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset?.uri) {
        throw new Error('The selected photo is unavailable. Please try another photo.');
      }

      const photoKey = target === 'avatar' ? 'avatarUri' : 'coverUri';
      const previousUri = target === 'avatar' ? avatarUri : coverUri;
      let uri;
      let copiedFile;

      if (Platform.OS === 'web') {
        if (!asset.base64) {
          throw new Error('The selected photo could not be saved. Please try another photo.');
        }
        uri = `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`;
      } else {
        const sourceFile = new File(asset.uri);
        if (!sourceFile.exists) {
          throw new Error('The selected photo is no longer available. Please try again.');
        }
        copiedFile = new File(
          Paths.document,
          `hireflow-${target}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${sourceFile.extension || '.jpg'}`
        );
        await sourceFile.copy(copiedFile);
        uri = copiedFile.uri;
      }

      const nextPhotos = { avatarUri, coverUri, [photoKey]: uri };
      try {
        await AsyncStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(nextPhotos));
      } catch (saveError) {
        try {
          if (copiedFile?.exists) copiedFile.delete();
        } catch (cleanupError) {
          console.error('Could not clean up an unsaved profile photo.', cleanupError);
        }
        throw saveError;
      }

      if (target === 'avatar') setAvatarUri(uri);
      else setCoverUri(uri);

      if (previousUri && previousUri !== uri && Platform.OS !== 'web') {
        try {
          const previousFile = new File(previousUri);
          if (previousFile.exists) previousFile.delete();
        } catch (cleanupError) {
          console.error('Could not remove the previous profile photo.', cleanupError);
        }
      }
    } catch (pickError) {
      Alert.alert(
        'Could not load photo',
        pickError instanceof Error ? pickError.message : 'Something went wrong. Please try again.'
      );
    }
  };

  const removePhoto = async (target) => {
    const photoKey = target === 'avatar' ? 'avatarUri' : 'coverUri';
    const previousUri = target === 'avatar' ? avatarUri : coverUri;
    const nextPhotos = { avatarUri, coverUri, [photoKey]: null };

    try {
      await AsyncStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(nextPhotos));
    } catch (removeError) {
      Alert.alert(
        'Could not remove photo',
        removeError instanceof Error ? removeError.message : 'Please try again.'
      );
      return;
    }

    if (target === 'avatar') setAvatarUri(null);
    else setCoverUri(null);
    setPhotoTarget(null);

    if (previousUri && Platform.OS !== 'web') {
      try {
        const previousFile = new File(previousUri);
        if (previousFile.exists) previousFile.delete();
      } catch (cleanupError) {
        console.error('Could not remove the profile photo file.', cleanupError);
      }
    }
  };

  const hasPhoto = photoTarget === 'avatar' ? !!avatarUri : !!coverUri;

  const editorConfig = editor ? FORMS[editor.type] : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ProfileContent
        profile={profile}
        coverUri={coverUri}
        avatarUri={avatarUri}
        photosReady={photosReady}
        isEditing={isEditing}
        onPhotoTarget={setPhotoTarget}
        onToggleEditing={() => setIsEditing((value) => !value)}
        onEditProfile={() => openEditor('profile')}
        sections={sections}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        filteredEducation={filteredEducation}
        educationEmpty={education.length === 0}
        filteredExperience={filteredExperience}
        experienceEmpty={experience.length === 0}
        filteredCertificates={filteredCertificates}
        certificatesEmpty={certificates.length === 0}
        about={about}
        onAdd={(type) => openEditor(type)}
        onEdit={(type, item) => openEditor(type, item)}
        onDelete={confirmDelete}
        onClearAbout={confirmClearAbout}
      />
      <ProfileEditorModal
        editor={editor}
        config={editorConfig}
        form={form}
        setForm={setForm}
        error={error}
        setError={setError}
        onClose={closeEditor}
        onSave={saveEditor}
      />
      <ProfilePhotoModal
        photoTarget={photoTarget}
        hasPhoto={hasPhoto}
        onPickPhoto={pickPhoto}
        onRemovePhoto={removePhoto}
        onClose={() => setPhotoTarget(null)}
      />
    </SafeAreaView>
  );
}
