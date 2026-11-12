import { View, Text, StyleSheet, Image } from 'react-native';
import theme from '../styles/theme';
import StatusCard from './StatusCard';

export default function ApplicationsCard({ cardLogo, cardTitle, cardCompany, status }) {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={cardLogo} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.cardContent}>
        <View style={{ flexDirection: 'row'}}>
          <Text style={styles.statusLabel}>Application status:  </Text>
          <Text style={styles.statusLabelText}>{status}</Text>
        </View>

        <Text style={styles.cardTitle} numberOfLines={1}>{cardTitle}</Text>
        <Text style={styles.cardCompany}>{cardCompany}</Text>
      </View>

      <View style={styles.statusContainer}>
        <StatusCard status={status} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 100,
    padding: theme.spacing.medium,
    borderRadius: theme.radius.large,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.medium,
    backgroundColor: theme.colors.cardBackground,
    boxShadow: theme.boxShadow.default,
  },
  imageContainer: {
    backgroundColor: theme.colors.cardBackground,
    width: 56,
    height: 56,
    borderRadius: theme.radius.small,
    boxShadow: theme.boxShadow.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 38,
    height: 38,
  },
  cardTitle: {
    fontSize: theme.fontSize.medium,
    fontWeight: 'bold',
    color: theme.fontColor.primary,
  },
  cardCompany: {
    fontSize: theme.fontSize.small,
    color: theme.fontColor.secondary,
    marginTop: 3,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  statusLabel: {
    color: theme.fontColor.secondary,
    fontSize: 11,
    marginBottom: 5,
  },
  statusLabelText: {
    color: theme.fontColor.primary,
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
  },
  statusContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});