import { View, StyleSheet, Text } from 'react-native';

export default function StatusCard({ status }) {
  const statusStyles = {
    Pending: { backgroundColor: '#FFF2D6', color: '#946200' },
    Accepted: { backgroundColor: '#E5F4E0', color: '#34733B' },
    Declined: { backgroundColor: '#FCE8E6', color: '#B3261E' },
    Completed: { backgroundColor: '#E8EAF6', color: '#4B5694' },
  };
  const colors = statusStyles[status] || statusStyles.Pending;

  return (
    <View style={[styles.badge, { backgroundColor: colors.backgroundColor }]}>
      <Text style={[styles.label, { color: colors.color }]}>{status || 'Pending'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 74,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
  },
});
