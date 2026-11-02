import { View, Text, StyleSheet, Image } from 'react-native';
import theme from '../styles/theme';

export default function ApplicationsCard({ cardLogo, cardTitle, cardCompany }) {
  return (
    <View>
      <View style={styles.cards}>
        <View style={styles.wrapper}>
          <View style={styles.imageContainer}>
            <Image
              source={cardLogo}
              style={styles.image}
            />
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.status}>Status: Accepted</Text>
            <Text style={styles.cardTitle}>{cardTitle}</Text>
            <Text style={styles.cardCompany}>{cardCompany}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
cards: {
    width: "100%",
    height: 85,
    paddingHorizontal: 5,
    paddingTop: 5,
    borderRadius: theme.radius.large,
    flexDirection: 'column',
    alignSelf: 'stretch',
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
    width: 50,
    height: 50,
    borderRadius: 15,
    boxShadow: theme.boxShadow.default,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },

  cardTitle: {
    fontSize: theme.fontSize.medium,
    fontWeight: 'bold',
    color: theme.fontColor.primary,
    marginBottom: 2,
  },

  cardCompany: {
    fontSize: theme.fontSize.medium,
    color: theme.fontColor.primary,
    marginBottom: 10,
  },

  cardContent: {
    flex: 1,
    alignSelf: 'flex-start',
  },

  status: {
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.muted
  }
});