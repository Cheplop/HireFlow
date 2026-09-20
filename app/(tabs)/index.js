import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const quickStats = [
  { label: 'Applications', value: '12' },
  { label: 'Interviews', value: '3' },
  { label: 'Offers', value: '1' },
];

const actions = [
  'Review jobs',
  'Update resume',
  'Track contacts',
  'Set reminders',
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning</Text>
        <Text style={styles.title}>Your career dashboard</Text>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>Employment app</Text>
        <Text style={styles.heroTitle}>Keep momentum moving.</Text>
        <Text style={styles.heroText}>
          Track your applications, follow up faster, and stay prepared for the next opportunity.
        </Text>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
          <Text style={styles.primaryButtonText}>View pipeline</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        {quickStats.map((item) => (
          <View key={item.label} style={styles.statCard}>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Quick actions</Text>

        {actions.map((action, index) => (
          <TouchableOpacity key={action} style={styles.actionRow} activeOpacity={0.8}>
            <View style={styles.actionIconContainer}>
              <Text style={styles.actionIcon}>{index + 1}</Text>
            </View>
            <Text style={styles.actionText}>{action}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 18,
  },
  greeting: {
    color: '#5f6c7b',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  title: {
    color: '#112033',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  heroCard: {
    backgroundColor: '#112033',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#0d1b2a',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 6,
  },
  heroEyebrow: {
    color: '#9ec5ff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.7,
    marginBottom: 10,
  },
  heroText: {
    color: '#dfeafc',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 22,
  },
  primaryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#7cc5ff',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: '#0d1b2a',
    fontSize: 14,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: 'center',
    shadowColor: '#cbd5e1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 2,
  },
  statValue: {
    color: '#112033',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: '#5f6c7b',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 20,
    marginTop: 22,
    shadowColor: '#dfe7f4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 3,
  },
  sectionTitle: {
    color: '#112033',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#edf2f7',
  },
  actionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#eaf4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionIcon: {
    color: '#184a9e',
    fontWeight: '700',
    fontSize: 12,
  },
  actionText: {
    color: '#1f2d3d',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
});