import { Pressable, Text, View } from 'react-native';
import { Briefcase, MapPin, Pencil, Plus, Trash2 } from 'lucide-react-native';

import theme from '../../styles/theme';
import { DANGER, styles } from '../../screens/ProfileScreen.styles';

export function ProfileEntryCard({
  item,
  icon: Icon,
  showDetails = false,
  editing = false,
  onEdit,
  onDelete,
}) {
  return (
    <View style={styles.entryCard}>
      <View style={styles.entryIcon}>
        <Icon size={19} color={theme.colors.primary} />
      </View>
      <View style={styles.entryContent}>
        <View style={styles.entryTitleRow}>
          <Text style={styles.entryTitle} numberOfLines={1}>{item.title}</Text>
          {!!item.date && <Text style={styles.entryDate}>{item.date}</Text>}
        </View>
        <Text style={styles.entrySubtitle}>{item.subtitle}</Text>
        {showDetails && item.details?.map((detail, index) => (
          !!detail && (
            <View key={`${detail}-${index}`} style={styles.detailRow}>
              {index === 0
                ? <MapPin size={14} color={theme.fontColor.primary} />
                : <Briefcase size={14} color={theme.fontColor.primary} />}
              <Text style={styles.detailText}>{detail}</Text>
            </View>
          )
        ))}
        {showDetails && !!item.description && (
          <Text style={styles.entryDescription} numberOfLines={3}>
            {item.description}
          </Text>
        )}
        {editing && (
          <View style={styles.actionRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Edit ${item.title}`}
              onPress={onEdit}
              style={styles.actionButton}
            >
              <Pencil size={13} color={theme.colors.primary} />
              <Text style={styles.actionText}>Edit</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Delete ${item.title}`}
              onPress={onDelete}
              style={[styles.actionButton, styles.deleteButton]}
            >
              <Trash2 size={13} color={DANGER} />
              <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

export function AddButton({ label, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.sectionTab, styles.selectedSectionTab, styles.addButton]}
    >
      <Plus size={14} color="#FFFFFF" />
      <Text style={[styles.sectionTabText, styles.selectedSectionTabText]}>{label}</Text>
    </Pressable>
  );
}

export function EmptyResults({ empty = false }) {
  return (
    <Text style={styles.emptyText}>
      {empty
        ? 'Nothing here yet. Tap Edit profile to add an entry.'
        : 'No profile information matches your search.'}
    </Text>
  );
}
