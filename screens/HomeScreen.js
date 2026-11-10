import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Search } from 'lucide-react-native';

import { ApplyCard } from '@/components/ApplyCard';
import { AuthInput } from '@/components/AuthInput';
import { PrimaryButton } from '@/components/PrimaryButton';
import { work } from '../data/jobs';
import theme from '../styles/theme';

const employmentTypes = ['All', 'Full-time', 'Part-time', 'Contractual'];

function normalizeType(type) {
  return type.toLowerCase().replace(/[\s-]/g, '');
}

export default function HomeScreen() {
  const [selectedType, setSelectedType] = useState('All');
  const [search, setSearch] = useState('');

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return work.filter((job) => {
      const matchesType =
        selectedType === 'All' ||
        normalizeType(job.jobMode) === normalizeType(selectedType);
      const searchableText = [
        job.jobTitle,
        job.jobCompany,
        job.jobLocation,
        job.jobDescription,
      ].join(' ').toLowerCase();

      return matchesType && (!query || searchableText.includes(query));
    });
  }, [search, selectedType]);

  return (
    <SafeAreaView style={styles.safeAreaView} edges={['top']}>
      <View style={styles.headerContainer}>
        <View style={styles.search}>
          <AuthInput
            placeholder="Search jobs..."
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            icon={<Search size={20} color="#abb0b7" />}
          />
        </View>
        <Pressable
          accessibilityLabel="View application updates"
          accessibilityRole="button"
          onPress={() => router.push('/(tabs)/applications')}
          style={styles.notification}
        >
          <Bell size={20} color={theme.fontColor.primary} />
        </Pressable>
      </View>

      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.worktypeContainer}
        >
          {employmentTypes.map((type) => (
            <PrimaryButton
              key={type}
              title={type}
              variant={selectedType === type ? 'active' : 'inactive'}
              onPress={() => setSelectedType(type)}
              style={styles.filterButton}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredJobs}
        contentContainerStyle={styles.cards}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ApplyCard
            cardLogo={item.companyLogo}
            cardTitle={item.jobTitle}
            cardCompany={item.jobCompany}
            cardLocation={item.jobLocation}
            cardMode={`${item.jobMode} · ${item.jobType}`}
            cardDescription={item.jobDescription}
            onApply={() => router.push(`/jobDetails/${item.id}`)}
          />
        )}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <Text style={styles.emptyState}>No jobs match your search. Try another keyword or filter.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.small,
    width: '100%',
    paddingHorizontal: 22,
  },
  search: {
    flex: 1,
    height: 55,
  },
  notification: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    padding: 0,
    marginTop: 1,
    backgroundColor: theme.colors.cardBackground,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.large,
  },
  filterWrapper: {
    marginTop: theme.spacing.small,
  },
  worktypeContainer: {
    gap: theme.spacing.small,
    paddingHorizontal: 22,
    paddingBottom: theme.spacing.small,
  },
  filterButton: {
    width: 'auto',
    minWidth: 78,
    height: 36,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: theme.radius.large,
    borderColor: theme.colors.border,
  },
  cards: {
    gap: theme.spacing.medium,
    paddingBottom: 130, // Extra padding to clear bottom tab bar and floating action button
    paddingHorizontal: 22,
    paddingTop: theme.spacing.small,
    flexGrow: 0, // Prevents the list from stretching/centering items vertically
  },
  emptyState: {
    color: theme.fontColor.secondary,
    textAlign: 'center',
    padding: theme.spacing.large,
    marginTop: theme.spacing.medium,
  },
});