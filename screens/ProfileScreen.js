import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Award,
  Bell,
  Briefcase,
  CalendarDays,
  GraduationCap,
  MapPin,
  Search,
  UserRound,
} from 'lucide-react-native';

import { AuthInput } from '../components/AuthInput';
import theme from '../styles/theme';

const sections = ['Education', 'Job Experience', 'Licenses & Cert', 'About'];

const education = [
  {
    group: 'Tertiary',
    title: 'Harvard University',
    subtitle: 'B.S in Information Technology',
    date: '2016–2020',
  },
  {
    group: 'Secondary',
    title: 'Cagayan de Oro City National High School',
    subtitle: 'High School Diploma',
    date: '2012–2016',
  },
  {
    group: 'Primary',
    title: 'Cagayan de Oro City Central School',
    subtitle: 'Elementary Education',
    date: '2006–2012',
  },
];

const experience = [
  {
    title: 'Senior Web Developer',
    subtitle: 'Amazon Incorporated',
    date: '2021–2025',
    details: ['Quezon City, Philippines / Onsite', 'Full-time'],
    description:
      'Designed and developed responsive web applications, working with product and engineering teams to deliver reliable user experiences.',
  },
  {
    title: 'Web Developer',
    subtitle: 'Amazon Incorporated',
    date: '2018–2021',
    details: ['Cagayan de Oro City / Hybrid', 'Full-time'],
    description:
      'Built and maintained customer-facing web features and collaborated on accessibility and performance improvements.',
  },
];

const certificates = [
  {
    title: 'Senior Web Developer',
    subtitle: 'Amazon Incorporated',
    date: '2021–2025',
  },
  {
    title: 'AWS Certified Developer',
    subtitle: 'Amazon Web Services',
    date: '2023',
  },
  {
    title: 'Professional Web Accessibility',
    subtitle: 'W3C Training',
    date: '2022',
  },
];

function ProfileEntryCard({ item, icon: Icon, showDetails = false }) {
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
          <View key={detail} style={styles.detailRow}>
            {index === 0
              ? <MapPin size={14} color={theme.fontColor.primary} />
              : <Briefcase size={14} color={theme.fontColor.primary} />}
            <Text style={styles.detailText}>{detail}</Text>
          </View>
        ))}
        {showDetails && !!item.description && (
          <Text style={styles.entryDescription} numberOfLines={3}>
            {item.description}
          </Text>
        )}
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const [activeSection, setActiveSection] = useState('Education');
  const [search, setSearch] = useState('');
  const query = search.trim().toLowerCase();

  const filteredEducation = useMemo(
    () => education.filter((item) =>
      `${item.group} ${item.title} ${item.subtitle}`.toLowerCase().includes(query)
    ),
    [query]
  );
  const filteredExperience = useMemo(
    () => experience.filter((item) =>
      `${item.title} ${item.subtitle} ${item.description}`.toLowerCase().includes(query)
    ),
    [query]
  );
  const filteredCertificates = useMemo(
    () => certificates.filter((item) =>
      `${item.title} ${item.subtitle}`.toLowerCase().includes(query)
    ),
    [query]
  );

  return (
    <SafeAreaView style={styles.safeArea}>


      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.cover}>
          <View style={styles.avatar}>
            <UserRound size={36} color={theme.colors.primary} />
          </View>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.name}>Juan Dela Cruz</Text>
          <View style={styles.location}>
            <MapPin size={14} color={theme.fontColor.secondary} />
            <Text style={styles.locationText}>Cagayan de Oro City</Text>
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
                onPress={() => setActiveSection(section)}
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
            {filteredEducation.map((item) => (
              <View key={item.group}>
                <Text style={styles.groupTitle}>{item.group}</Text>
                <ProfileEntryCard item={item} icon={GraduationCap} />
              </View>
            ))}
            {filteredEducation.length === 0 && <EmptyResults />}
          </View>
        )}

        {activeSection === 'Job Experience' && (
          <View style={styles.sectionContent}>
            {filteredExperience.map((item) => (
              <ProfileEntryCard
                key={`${item.title}-${item.date}`}
                item={item}
                icon={Briefcase}
                showDetails
              />
            ))}
            {filteredExperience.length === 0 && <EmptyResults />}
          </View>
        )}

        {activeSection === 'Licenses & Cert' && (
          <View style={styles.sectionContent}>
            {filteredCertificates.map((item) => (
              <ProfileEntryCard
                key={`${item.title}-${item.date}`}
                item={item}
                icon={Award}
              />
            ))}
            {filteredCertificates.length === 0 && <EmptyResults />}
          </View>
        )}

        {activeSection === 'About' && (
          <View style={styles.aboutCard}>
            <Text style={styles.aboutTitle}>About me</Text>
            <Text style={styles.aboutText}>
              A passionate web developer with experience building accessible,
              user-friendly products. I enjoy solving problems and collaborating
              with teams to turn ideas into useful experiences.
            </Text>
            <Text style={styles.aboutTitle}>Skills</Text>
            <View style={styles.skills}>
              {['Web Development', 'JavaScript', 'UI/UX', 'Communication'].map((skill) => (
                <Text key={skill} style={styles.skillChip}>{skill}</Text>
              ))}
            </View>
            <View style={styles.detailRow}>
              <CalendarDays size={15} color={theme.colors.primary} />
              <Text style={styles.detailText}>Available for new opportunities</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function EmptyResults() {
  return <Text style={styles.emptyText}>No profile information matches your search.</Text>;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 22,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.small,
  },
  search: {
    flex: 1,
    height: 55,
  },
  notification: {
    width: 48,
    height: 48,
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.large,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.cardBackground,
  },
  scrollContent: {
    paddingBottom: 105,
  },
  cover: {
    height: 106,
    marginTop: 2,
    borderTopLeftRadius: theme.radius.medium,
    borderTopRightRadius: theme.radius.medium,
    backgroundColor: '#DCE3EF',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  avatar: {
    width: 68,
    height: 68,
    marginBottom: -31,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 34,
    borderWidth: 4,
    borderColor: theme.colors.cardBackground,
    backgroundColor: '#EEF2F8',
  },
  profileInfo: {
    alignItems: 'center',
    paddingTop: 39,
    paddingBottom: theme.spacing.medium,
  },
  name: {
    color: theme.fontColor.primary,
    fontSize: theme.fontSize.large,
    fontWeight: '700',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  locationText: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
  },
  sectionTabs: {
    gap: 6,
    paddingBottom: theme.spacing.medium,
  },
  sectionTab: {
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.large,
    backgroundColor: theme.colors.cardBackground,
  },
  selectedSectionTab: {
    backgroundColor: '#4B5694',
    borderColor: '#4B5694',
  },
  sectionTabText: {
    color: theme.fontColor.secondary,
    fontSize: 11,
    fontWeight: '600',
  },
  selectedSectionTabText: {
    color: '#FFFFFF',
  },
  sectionContent: {
    gap: theme.spacing.small,
  },
  groupTitle: {
    color: theme.fontColor.primary,
    fontSize: theme.fontSize.medium,
    fontWeight: '600',
    marginBottom: 7,
  },
  entryCard: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.small,
    padding: 11,
    borderRadius: theme.radius.medium,
    backgroundColor: theme.colors.cardBackground,
    boxShadow: theme.boxShadow.default,
  },
  entryIcon: {
    width: 34,
    height: 34,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#EEF2F8',
  },
  entryContent: {
    flex: 1,
    minWidth: 0,
  },
  entryTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 6,
  },
  entryTitle: {
    flex: 1,
    color: theme.fontColor.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  entryDate: {
    color: theme.fontColor.secondary,
    fontSize: 9,
  },
  entrySubtitle: {
    color: theme.fontColor.secondary,
    fontSize: 10,
    marginTop: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 7,
  },
  detailText: {
    flex: 1,
    color: theme.fontColor.primary,
    fontSize: 11,
  },
  entryDescription: {
    color: theme.fontColor.secondary,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 8,
  },
  emptyText: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
    paddingVertical: theme.spacing.large,
    textAlign: 'center',
  },
  aboutCard: {
    gap: theme.spacing.small,
    padding: theme.spacing.medium,
    borderRadius: theme.radius.medium,
    backgroundColor: theme.colors.cardBackground,
    boxShadow: theme.boxShadow.default,
  },
  aboutTitle: {
    color: theme.fontColor.primary,
    fontSize: theme.fontSize.medium,
    fontWeight: '700',
    marginTop: 3,
  },
  aboutText: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
    lineHeight: 19,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  skillChip: {
    color: '#4B5694',
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.large,
    backgroundColor: '#EAF2FF',
  },
});
