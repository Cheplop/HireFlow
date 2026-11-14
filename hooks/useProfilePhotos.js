
import { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { File, Paths } from 'expo-file-system';

import { PHOTO_STORAGE_KEY } from '../data/ProfileScreen.data';

export default function useProfilePhotos() {
  const [avatarUri, setAvatarUri] = useState(null);
  const [coverUri, setCoverUri] = useState(null);
  const [photoTarget, setPhotoTarget] = useState(null);
  const [photosReady, setPhotosReady] = useState(false);

  // Load saved photos
  useEffect(() => {
    let isMounted = true;

    const loadPhotos = async () => {
      try {
        const savedPhotos = await AsyncStorage.getItem(PHOTO_STORAGE_KEY);

        if (!savedPhotos) return;

        const photos = JSON.parse(savedPhotos);

        if (isMounted) {
          setAvatarUri(
            typeof photos.avatarUri === 'string' ? photos.avatarUri : null
          );
          setCoverUri(
            typeof photos.coverUri === 'string' ? photos.coverUri : null
          );
        }
      } catch (error) {
        if (isMounted) {
          Alert.alert(
            'Could not load photos',
            error instanceof Error ? error.message : 'Please try again.'
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

  // Remove an old local photo file
  const deleteOldPhoto = (uri, newUri = null) => {
    if (!uri || uri === newUri || Platform.OS === 'web') return;

    try {
      const file = new File(uri);

      if (file.exists) file.delete();
    } catch (error) {
      console.error('Could not remove old photo.', error);
    }
  };

  // Select or take a photo
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
        const permission =
          await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
          Alert.alert(
            'Camera access needed',
            'Allow camera access in your settings to take a photo.'
          );
          return;
        }

        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (result.canceled) return;

      const asset = result.assets?.[0];

      if (!asset?.uri) {
        throw new Error('The selected photo is unavailable. Please try again.');
      }

      const isAvatar = target === 'avatar';
      const previousUri = isAvatar ? avatarUri : coverUri;

      let uri;
      let copiedFile;

      if (Platform.OS === 'web') {
        if (!asset.base64) {
          throw new Error('The selected photo could not be saved.');
        }

        uri = `data:${asset.mimeType || 'image/jpeg'};base64,${asset.base64}`;
      } else {
        const sourceFile = new File(asset.uri);

        if (!sourceFile.exists) {
          throw new Error('The selected photo is no longer available.');
        }

        copiedFile = new File(
          Paths.document,
          `hireflow-${target}-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}${sourceFile.extension || '.jpg'}`
        );

        await sourceFile.copy(copiedFile);
        uri = copiedFile.uri;
      }

      const nextPhotos = {
        avatarUri: isAvatar ? uri : avatarUri,
        coverUri: isAvatar ? coverUri : uri,
      };

      try {
        await AsyncStorage.setItem(
          PHOTO_STORAGE_KEY,
          JSON.stringify(nextPhotos)
        );
      } catch (error) {
        try {
          if (copiedFile?.exists) copiedFile.delete();
        } catch (cleanupError) {
          console.error('Could not clean up unsaved photo.', cleanupError);
        }

        throw error;
      }

      if (isAvatar) {
        setAvatarUri(uri);
      } else {
        setCoverUri(uri);
      }

      deleteOldPhoto(previousUri, uri);
    } catch (error) {
      Alert.alert(
        'Could not load photo',
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    }
  };

  // Remove a profile photo
  const removePhoto = async (target) => {
    const isAvatar = target === 'avatar';
    const previousUri = isAvatar ? avatarUri : coverUri;

    const nextPhotos = {
      avatarUri: isAvatar ? null : avatarUri,
      coverUri: isAvatar ? coverUri : null,
    };

    try {
      await AsyncStorage.setItem(
        PHOTO_STORAGE_KEY,
        JSON.stringify(nextPhotos)
      );
    } catch (error) {
      Alert.alert(
        'Could not remove photo',
        error instanceof Error ? error.message : 'Please try again.'
      );
      return;
    }

    if (isAvatar) {
      setAvatarUri(null);
    } else {
      setCoverUri(null);
    }

    setPhotoTarget(null);
    deleteOldPhoto(previousUri);
  };

  return {
    avatarUri,
    coverUri,
    photoTarget,
    photosReady,
    setPhotoTarget,
    pickPhoto,
    removePhoto,
  };
}
