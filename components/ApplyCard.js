
import { StyleSheet, Text, View, Image } from 'react-native';
import theme from '../styles/theme';
import { PrimaryButton } from './PrimaryButton';
import { Briefcase, MapPin } from 'lucide-react-native';

export function ApplyCard({
  cardLogo,
  cardTitle,
  cardCompany,
  cardLocation,
  cardMode,
  cardDescription,
  onApply,
  actionTitle = 'Apply',
}) {
  return (
    <View style={styles.card}>
      <View style={styles.wrapper}>
        <View style={styles.imageContainer}>
          <Image
            source={cardLogo}
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

          <View style={styles.cardLocationContainer}>
            <Briefcase size={14} color={theme.fontColor.secondary} />
            <Text style={styles.cardLocation}>{cardMode}</Text>
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
          title={actionTitle}
          style={styles.primaryButton}
          onPress={onApply}
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
    width: 64,
    height: 64,
    borderRadius: 12,
    boxShadow: theme.boxShadow.default,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
  },

  cardContent: {
    flex: 1,
    alignSelf: 'flex-start',
  },

  cardTitle: {
    fontSize: theme.fontSize.medium,
    fontWeight: 'bold',
    color: theme.fontColor.primary,
    marginBottom: 2,
  },

  cardCompany: {
    fontSize: theme.fontSize.small,
    color: theme.fontColor.primary,
    marginBottom: 5,
  },

  cardLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },

  cardLocation: {
    flex: 1,
    fontSize: theme.fontSize.small,
    color: theme.fontColor.secondary,
  },

  cardDescription: {
    fontSize: 11,
    lineHeight: 15,
    color: theme.fontColor.secondary,
    fontWeight: theme.fontWeight.muted,
  },

  cardDescriptionContainer: {
    width: '100%',
  },

  buttonContainer: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    alignItems: 'flex-end',
  },

  primaryButton: {
    width: 75,
    height: 28,
    paddingVertical: 4,
  },
});
