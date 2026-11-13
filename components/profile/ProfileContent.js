import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import {
  Award,
  Briefcase,
  CalendarDays,
  Camera,
  GraduationCap,
  MapPin,
  Pencil,
  Trash2,
  UserRound,
  X,
} from 'lucide-react-native';

import { AddButton, EmptyResults, ProfileEntryCard } from './ProfileEntryCard';
import { DANGER, styles } from '../../screens/ProfileScreen.styles';
import theme from '../../styles/theme';

export default function ProfileContent({
  profile,
  coverUri,
  avatarUri,
  photosReady,
  isEditing,
  onPhotoTarget,
  onToggleEditing,
  onEditProfile,
  sections,
  activeSection,
  onSelectSection,
  filteredEducation,
  educationEmpty,
  filteredExperience,
  experienceEmpty,
  filteredCertificates,
  certificatesEmpty,
  about,
  onAdd,
  onEdit,
  onDelete,
  onClearAbout,
}) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.cover}>
        {!!coverUri && (
          <View style={styles.coverImageWrap}>
            <Image source={{ uri: coverUri }} style={styles.coverImage} resizeMode="cover" />
          </View>
        )}
        {isEditing && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Change cover photo"
            onPress={() => onPhotoTarget('cover')}
            disabled={!photosReady}
            style={styles.coverEditButton}
          >
            <Camera size={13} color="#FFFFFF" />
            <Text style={styles.coverEditText}>Cover photo</Text>
          </Pressable>
        )}
        <Pressable
          accessibilityRole={isEditing ? 'button' : undefined}
          accessibilityLabel="Change profile photo"
          disabled={!isEditing || !photosReady}
          onPress={() => onPhotoTarget('avatar')}
          style={styles.avatar}
        >
          {avatarUri
            ? <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            : <UserRound size={36} color={theme.colors.primary} />}
          {isEditing && (
            <View style={styles.avatarBadge}>
              <Camera size={11} color="#FFFFFF" />
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.profileInfo}>
        <Text style={styles.name}>{profile.name}</Text>
        {!!profile.location && (
          <View style={styles.location}>
            <MapPin size={14} color={theme.fontColor.secondary} />
            <Text style={styles.locationText}>{profile.location}</Text>
          </View>
        )}
        <View style={styles.profileActions}>
          <Pressable
            accessibilityRole="button"
            onPress={onToggleEditing}
            style={[styles.sectionTab, isEditing && styles.selectedSectionTab, styles.editToggle]}
          >
            {isEditing
              ? <X size={13} color="#FFFFFF" />
              : <Pencil size={13} color={theme.fontColor.secondary} />}
            <Text style={[styles.sectionTabText, isEditing && styles.selectedSectionTabText]}>
              {isEditing ? 'Done' : 'Edit profile'}
            </Text>
          </Pressable>
          {isEditing && (
            <Pressable
              accessibilityRole="button"
              onPress={onEditProfile}
              style={[styles.sectionTab, styles.editToggle]}
            >
              <UserRound size={13} color={theme.fontColor.secondary} />
              <Text style={styles.sectionTabText}>Name & location</Text>
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sectionTabs}
      >
        {sections.map((section) => {
          const selected = activeSection === section;

          return (
            <Pressable
              key={section}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => onSelectSection(section)}
              style={[styles.sectionTab, selected && styles.selectedSectionTab]}
            >
              <Text style={[styles.sectionTabText, selected && styles.selectedSectionTabText]}>
                {section}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {activeSection === 'Education' && (
        <View style={styles.sectionContent}>
          {isEditing && (
            <AddButton label="Add education" onPress={() => onAdd('education')} />
          )}
          {filteredEducation.map((item) => (
            <View key={item.id}>
              <Text style={styles.groupTitle}>{item.group}</Text>
              <ProfileEntryCard
                item={item}
                icon={GraduationCap}
                editing={isEditing}
                onEdit={() => onEdit('education', item)}
                onDelete={() => onDelete('education', item)}
              />
            </View>
          ))}
          {filteredEducation.length === 0 && <EmptyResults empty={educationEmpty} />}
        </View>
      )}

      {activeSection === 'Job Experience' && (
        <View style={styles.sectionContent}>
          {isEditing && (
            <AddButton label="Add job experience" onPress={() => onAdd('experience')} />
          )}
          {filteredExperience.map((item) => (
            <ProfileEntryCard
              key={item.id}
              item={item}
              icon={Briefcase}
              showDetails
              editing={isEditing}
              onEdit={() => onEdit('experience', item)}
              onDelete={() => onDelete('experience', item)}
            />
          ))}
          {filteredExperience.length === 0 && <EmptyResults empty={experienceEmpty} />}
        </View>
      )}

      {activeSection === 'Licenses & Cert' && (
        <View style={styles.sectionContent}>
          {isEditing && (
            <AddButton label="Add license or certificate" onPress={() => onAdd('certificates')} />
          )}
          {filteredCertificates.map((item) => (
            <ProfileEntryCard
              key={item.id}
              item={item}
              icon={Award}
              editing={isEditing}
              onEdit={() => onEdit('certificates', item)}
              onDelete={() => onDelete('certificates', item)}
            />
          ))}
          {filteredCertificates.length === 0 && <EmptyResults empty={certificatesEmpty} />}
        </View>
      )}

      {activeSection === 'About' && (
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>About me</Text>
          {!!about.text
            ? <Text style={styles.aboutText}>{about.text}</Text>
            : <Text style={styles.emptyInline}>Nothing here yet.</Text>}
          <Text style={styles.aboutTitle}>Skills</Text>
          {about.skills.length > 0 ? (
            <View style={styles.skills}>
              {about.skills.map((skill) => (
                <Text key={skill} style={styles.skillChip}>{skill}</Text>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyInline}>No skills added yet.</Text>
          )}
          {!!about.availability && (
            <View style={styles.detailRow}>
              <CalendarDays size={15} color={theme.colors.primary} />
              <Text style={styles.detailText}>{about.availability}</Text>
            </View>
          )}
          {isEditing && (
            <View style={styles.actionRow}>
              <Pressable
                accessibilityRole="button"
                onPress={() => onEdit('about')}
                style={styles.actionButton}
              >
                <Pencil size={13} color={theme.colors.primary} />
                <Text style={styles.actionText}>Edit</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={onClearAbout}
                style={[styles.actionButton, styles.deleteButton]}
              >
                <Trash2 size={13} color={DANGER} />
                <Text style={[styles.actionText, styles.deleteText]}>Clear</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}
