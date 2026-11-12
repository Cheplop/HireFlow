import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';

import { AuthInput } from '@/components/AuthInput';
import ApplicationsCard from '@/components/ApplicationsCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { useApplications } from '../contexts/ApplicationsContext';
import { work } from '../data/jobs';
import theme from '../styles/theme';

const statusFilters = ['All', 'Pending', 'Accepted', 'Declined'];

export default function ApplicationScreen() {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const { applications } = useApplications();

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications
      .map((application) => ({
        ...application,
        job: work.find((job) => job.id === application.jobId),
      }))
      .filter(({ job, status }) => {
        if (!job) return false;
        const matchesStatus = selectedStatus === 'All' || status === selectedStatus;
        const matchesSearch = `${job.jobTitle} ${job.jobCompany}`.toLowerCase().includes(query);
        return matchesStatus && matchesSearch;
      });
  }, [applications, search, selectedStatus]);

  return (
    <SafeAreaView style={styles.safeAreaView} edges={['top']}>
      <View style={styles.search}>
        <AuthInput
          placeholder="Search applications..."
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          icon={<Search size={20} color="#abb0b7" />}
        />
      </View>

      {/* Wrapping the horizontal ScrollView prevents it from expanding vertically */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {statusFilters.map((status) => (
            <PrimaryButton
              key={status}
              title={status}
              variant={selectedStatus === status ? 'active' : 'inactive'}
              onPress={() => setSelectedStatus(status)}
              style={styles.filterButton}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredApplications}
        contentContainerStyle={styles.cards}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ApplicationsCard
            cardLogo={item.job.companyLogo}
            cardTitle={item.job.jobTitle}
            cardCompany={item.job.jobCompany}
            status={item.status}
          />
        )}
        keyExtractor={(item) => String(item.jobId)}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {applications.length === 0 ? 'No applications yet' : 'No matching applications'}
            </Text>
            <Text style={styles.emptyText}>
              {applications.length === 0
                ? 'Explore available jobs and submit an application to see it here.'
                : 'Try a different search or status filter.'}
            </Text>
          </View>
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
  search: {
    height: 55,
    paddingHorizontal: 22,
  },
  filterWrapper: {
    marginTop: theme.spacing.small,
  },
  filters: {
    gap: theme.spacing.small,
    paddingHorizontal: 22,
    paddingBottom: theme.spacing.small,
  },
  filterButton: {
    width: 'auto',
    minWidth: 75,
    height: 36,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.large,
    borderColor: theme.colors.border,
  },
  cards: {
    gap: theme.spacing.medium,
    paddingBottom: 130,
    paddingHorizontal: 22,
    paddingTop: theme.spacing.small,
    flexGrow: 0, // Keeps cards anchored at the top when there are few items
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.large,
    paddingTop: 64,
  },
  emptyTitle: {
    color: theme.fontColor.primary,
    fontWeight: '700',
    fontSize: theme.fontSize.large,
    textAlign: 'center',
  },
  emptyText: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
    lineHeight: 19,
    marginTop: theme.spacing.small,
    textAlign: 'center',
  },
});