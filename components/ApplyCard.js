
import { StyleSheet, Text, View, Image } from 'react-native';
import theme from '../styles/theme';
import { PrimaryButton } from './PrimaryButton';
import { MapPin } from 'lucide-react-native';

export function ApplyCard({
  cardTitle,
  cardCompany,
  cardLocation,
  cardDescription,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.wrapper}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/Hireflow.png')}
            style={styles.image}
          />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{cardTitle}</Text>
          <Text style={styles.cardCompany}>{cardCompany}</Text>

          <View style={styles.cardLocationContainer}>
            <MapPin
              size={14}
              color={theme.fontColor.secondary}
            />
            <Text style={styles.cardLocation}>
              {cardLocation}
            </Text>
          </View>

          <View style={styles.cardDescriptionContainer}>
            <Text style={styles.cardDescription} numberOfLines={2} ellipsizeMode="tail">
              {cardDescription}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Apply"
          style={styles.primaryButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    alignSelf: 'stretch',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radius.large,
    boxShadow: theme.boxShadow.default,
  },

  wrapper: {
    flexDirection: 'row',
    gap: theme.spacing.medium,
    padding: 10,
    backgroundColor: theme.colors.cardBackground,
  },

  imageContainer: {
    backgroundColor: theme.colors.cardBackground,
    width: 100,
    height: 100,
    borderRadius: 15,
    boxShadow: theme.boxShadow.default,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },

  cardContent: {
    flex: 1,
    alignSelf: 'flex-start',
  },

  cardTitle: {
    fontSize: theme.fontSize.large,
    fontWeight: 'bold',
    color: theme.fontColor.primary,
    marginBottom: 2,
  },

  cardCompany: {
    fontSize: theme.fontSize.medium,
    color: theme.fontColor.primary,
    marginBottom: 10,
  },

  cardLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
    marginBottom: 10,
  },

  cardLocation: {
    flex: 1,
    fontSize: theme.fontSize.small,
    color: theme.fontColor.secondary,
  },

  cardDescription: {
    fontSize: theme.fontSize.small,
    color: theme.fontColor.secondary,
    fontWeight: theme.fontWeight.muted,
  },

  cardDescriptionContainer: {
    width: '100%',
  },

  buttonContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    alignItems: 'flex-end',
  },

  primaryButton: {
    width: 75,
    height: 30,
    paddingVertical: 5,
  },
});
