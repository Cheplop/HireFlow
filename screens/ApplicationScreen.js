import { useMemo, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import ApplicationsCard from '@/components/employee/ApplicationsCard';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import SearchRow from '@/components/common/SearchRow';
import { useAuth } from '../contexts/AuthContext';
import { useApplications } from '../contexts/ApplicationsContext';
import { useJobs } from '../contexts/JobsContext';
import theme from '../styles/theme';

const statusFilters = ['All', 'Pending', 'Accepted', 'Declined', 'Completed'];

export default function ApplicationScreen() {
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const { user } = useAuth();
  const { jobs } = useJobs();
  const {
    getApplicationsForEmployee,
    updateEmployeeApplication,
    withdrawApplication,
    saveError,
  } = useApplications();
  const employeeApplications = user?.id ? getApplicationsForEmployee(user.id) : [];

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return employeeApplications
      .map((application) => ({
        ...application,
        job: jobs.find((job) => job.id === application.jobId),
      }))
      .filter(({ job, status }) => {
        if (!job) return false;
        const matchesStatus = selectedStatus === 'All' || status === selectedStatus;
        const matchesSearch = `${job.jobTitle} ${job.jobCompany}`.toLowerCase().includes(query);
        return matchesStatus && matchesSearch;
      });
  }, [employeeApplications, jobs, search, selectedStatus]);

  return (
    <SafeAreaView style={styles.safeAreaView} edges={['top']}>
      <SearchRow
        placeholder="Search applications..."
        value={search}
        onChangeText={setSearch}
        notificationLabel="View jobs"
        onNotificationPress={() => {
          if (router.canGoBack()) {
            Alert.alert('Notifications', 'Notifications are not available yet.');
          } else {
            router.push('/');
          }
        }}
      />

      {/* Status Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
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

      {/* Application List */}
      <FlatList
        data={filteredApplications}
        style={styles.applicationList}
        contentContainerStyle={styles.cards}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={saveError ? <Text style={styles.errorText}>{saveError}</Text> : null}
        renderItem={({ item }) => (
          <ApplicationsCard
            application={item}
            job={item.job}
            onUpdate={(applicationId, coverLetter) =>
              updateEmployeeApplication(applicationId, user.id, { coverLetter })
            }
            onWithdraw={(applicationId) =>
              withdrawApplication(applicationId, user.id)
            }
          />
        )}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>
              {employeeApplications.length === 0 ? 'No applications yet' : 'No matching applications'}
            </Text>
            <Text style={styles.emptyText}>
              {employeeApplications.length === 0
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
    paddingHorizontal: 20,
  },

  filterScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },

  filters: {
    gap: 8,
    paddingBottom: theme.spacing.medium,
  },

  filterButton: {
    width: 'auto',
    minWidth: 84,
    height: 34,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 17,
    borderColor: theme.colors.border,
  },

  applicationList: {
    flex: 1,
  },

  cards: {
    gap: 12,
    paddingBottom: 130,
    paddingHorizontal: 2,
    paddingTop: 2,
    flexGrow: 1,
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

  errorText: {
    color: theme.actions.deletePrimary,
    fontSize: theme.fontSize.small,
    paddingVertical: theme.spacing.small,
  },
});