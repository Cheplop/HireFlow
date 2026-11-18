import { Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import EntryCard from "./EntryCard";
import ExperienceCard from "./ExperienceCard";
import ProfileHeader from "./ProfileHeader";
import SectionTabs from "./SectionTabs";
import theme from "../../styles/theme";

const GROUP_ORDER = ["Tertiary", "Secondary", "Primary"];

export default function ProfileContent(props) {
  const {
    profile, coverUri, avatarUri, isEditing, onPhotoTarget, onToggleEditing,
    onEditProfile, onMenuPress, sections, activeSection, onSelectSection,
    filteredEducation, educationEmpty, filteredExperience, experienceEmpty,
    filteredCertificates, certificatesEmpty, about, styles, onAdd, onEdit,
    onDelete, onClearAbout,
  } = props;

  const AddButton = ({ type, label }) =>
    isEditing ? (
      <Pressable style={[styles.actionButton, { alignSelf: "flex-start", marginBottom: 12 }]} onPress={() => onAdd(type)}>
        <Ionicons name="add" size={14} color={theme.actions.editPrimary} />
        <Text style={styles.actionText}>{label}</Text>
      </Pressable>
    ) : null;

  const renderEducation = () => {
    if (educationEmpty) return <Text style={styles.emptyText}>No education added yet.</Text>;

    const groups = [
      ...GROUP_ORDER,
      ...new Set(filteredEducation.map((e) => e.group).filter((g) => !GROUP_ORDER.includes(g))),
    ];

    return (
      <>
        <AddButton type="education" label="Add education" />
        {groups.map((group) => {
          const items = filteredEducation.filter((e) => e.group === group);
          if (!items.length) return null;
          return (
            <View key={group} style={localStyles.groupContainer}>
              {/* Muted header with lines extending after each */}
              <View style={localStyles.groupHeaderContainer}>
                <Text style={localStyles.groupTitle}>{group}</Text>
                <View style={localStyles.groupLine} />
              </View>
              <View style={styles.sectionContent}>
                {items.map((item) => (
                  <EntryCard
                    key={item.id}
                    item={item}
                    isEditing={isEditing}
                    onEdit={() => onEdit("education", item)}
                    onDelete={() => onDelete("education", item)}
                  />
                ))}
              </View>
            </View>
          );
        })}
      </>
    );
  };

  const renderExperience = () => (
    <>
      <AddButton type="experience" label="Add experience" />
      {experienceEmpty && <Text style={styles.emptyText}>No experience added yet.</Text>}
      {filteredExperience.map((item) => (
        <ExperienceCard
          key={item.id}
          item={item}
          isEditing={isEditing}
          onEdit={() => onEdit("experience", item)}
          onDelete={() => onDelete("experience", item)}
        />
      ))}
    </>
  );

  const renderCertificates = () => (
    <>
      <AddButton type="certificates" label="Add certificate" />
      {certificatesEmpty && <Text style={styles.emptyText}>No certificates added yet.</Text>}
      {filteredCertificates.map((item) => (
        <EntryCard
          key={item.id}
          item={item}
          isEditing={isEditing}
          onEdit={() => onEdit("certificates", item)}
          onDelete={() => onDelete("certificates", item)}
        />
      ))}
    </>
  );

  const renderAbout = () => (
    <View style={styles.aboutCard}>
      <Text style={styles.aboutTitle}>About me</Text>
      <Text style={styles.aboutText}>{about.text || "Nothing here yet."}</Text>
      <View style={styles.skills}>
        {about.skills.map((s) => (
          <Text key={s} style={styles.skillChip}>{s}</Text>
        ))}
      </View>
      {!!about.availability && <Text style={styles.aboutText}>{about.availability}</Text>}
      {isEditing && (
        <View style={styles.actionRow}>
          <Pressable style={styles.actionButton} onPress={() => onEdit("about")}>
            <Text style={styles.actionText}>Edit</Text>
          </Pressable>
          <Pressable style={[styles.actionButton, styles.deleteButton]} onPress={onClearAbout}>
            <Text style={[styles.actionText, styles.deleteText]}>Clear</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <ProfileHeader
        profile={profile}
        coverUri={coverUri}
        avatarUri={avatarUri}
        isEditing={isEditing}
        onPhotoTarget={onPhotoTarget}
        onMenuPress={onMenuPress}
      />

      <View style={[styles.profileActions, { justifyContent: "flex-start", marginTop: 0, marginBottom: 14 }]}>
        <Pressable style={[styles.actionButton]} onPress={onToggleEditing}>
          <Ionicons
            name={isEditing ? "checkmark" : "create-outline"}
            size={13}
            color={theme.actions.editPrimary}
          />
          <Text style={styles.actionText}>{isEditing ? "Done" : "Edit profile"}</Text>
        </Pressable>
        {isEditing && (
          <Pressable style={styles.actionButton} onPress={onEditProfile}>
            <Text style={styles.actionText}>Name & location</Text>
          </Pressable>
        )}
      </View>

      <SectionTabs sections={sections} active={activeSection} onSelect={onSelectSection} />

      <View style={styles.sectionContent}>
        {activeSection === "Education" && renderEducation()}
        {activeSection === "Job Experience" && renderExperience()}
        {activeSection === "Licenses & Cert" && renderCertificates()}
        {activeSection === "About" && renderAbout()}
      </View>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  groupContainer: {
    marginBottom: theme.spacing.small,
  },
  groupHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.small,
    marginTop: 4,
  },
  groupTitle: {
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semibold,
    color: theme.fontColor.secondary, // Uses "#888888" from your theme
    marginRight: theme.spacing.small,
  },
  groupLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.fontColor.secondary, // Uses "#E5E7EB" from your theme
  },
});