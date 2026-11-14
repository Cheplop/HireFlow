import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import theme from '../../styles/theme';

export default function ProfileHeader({
  profile,
  coverUri,
  avatarUri,
  isEditing,
  onPhotoTarget,
  onMenuPress,
}) {
  return (
    <View>
      <View style={styles.cover}>
        {coverUri ? (
          <Image
            source={{ uri: coverUri }}
            style={styles.coverImage}
            resizeMode="cover"
            pointerEvents="none"
          />
        ) : null}

        {isEditing && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit cover photo"
            style={styles.coverEditSurface}
            onPress={() => onPhotoTarget('cover')}
          />
        )}

        <Pressable
          style={styles.menuButton}
          onPress={onMenuPress}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Open profile menu"
        >
          <Ionicons
            name="menu"
            size={22}
            color={theme.fontColor.dark}
            />
        </Pressable>

        {isEditing && (
          <View style={styles.editBadge} pointerEvents="none">
            <Ionicons
              name="camera"
              size={12}
              color={theme.fontColor.dark}
            />

            <Text style={styles.editBadgeText}>
              Edit cover
            </Text>
          </View>
        )}
      </View>

      <View style={styles.identityRow}>
        <Pressable
          style={styles.avatar}
          onPress={() => isEditing && onPhotoTarget('avatar')}
        >
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatarImage}
            />
          ) : (
            <Ionicons
              name="person"
              size={34}
              color={theme.colors.placeholder}
            />
          )}
        </Pressable>

        <View style={styles.identityText}>
          <Text style={styles.name}>
            {profile.name}
          </Text>

          <Text style={styles.location}>
            {profile.location}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    height: 140,
    marginTop: 2,
    borderRadius: 6,
    backgroundColor: theme.colors.coverBackground,
    overflow: 'hidden',
  },

  coverImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },

  coverEditSurface: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },

menuButton: {
  position: 'absolute',
  top: 10,
  right: 10,
  width: 38,
  height: 38,
  borderRadius: 19,
  backgroundColor: theme.colors.overlayStrong,
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
},

  editBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 18,
    backgroundColor: theme.colors.overlayMedium,
  },

  editBadgeText: {
    color: theme.fontColor.dark,
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semibold,
  },

  identityRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginTop: -34,
    marginLeft: 0,
    marginBottom: 16,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.colors.cardBackground,
    backgroundColor: theme.colors.coverBackground,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
  },

  identityText: {
    paddingBottom: 2,
    transform: [{ translateY: -15 }],
},
  name: {
    color: theme.fontColor.primary,
    fontSize: theme.fontSize.large,
    fontWeight: theme.fontWeight.bold,
  },

  location: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
    marginTop: 2,
  },
});
