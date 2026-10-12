import { ScrollView, StyleSheet, View, Text, TextInput} from 'react-native';
import theme from '../../styles/theme';
import { ApplyCard } from "@/components/ApplyCard";
import { AuthInput } from '@/components/AuthInput';

import { User } from 'lucide-react-native';

export default function HomeScreen() {
  return (
   <ScrollView contentContainerStyle={styles.container}>

    <View style={styles.headerContainer}>
      <View style = {styles.search}>
        <AuthInput 
        placeholder="Search jobs..."
        icon={<User size={20} />}
        />
      </View>
      <View style = {styles.notification}>
      </View>
    </View>

      <ApplyCard
        cardTitle="UX / UI Designer"
        cardCompany="Google Incorporated"
        cardLocation="San Francisco, CA"
        cardDescription="This is yada yada lorem ipsum dolor sit amet in here and there"
      />

      <ApplyCard
        cardTitle="Software Engineer"
        cardCompany="Microsoft Corporation"
        cardLocation="Seattle, WA"
        cardDescription="We are looking for a talented software engineer to join our team."
      />

      <ApplyCard
        cardTitle="Product Manager"
        cardCompany="Apple Inc."
        cardLocation="Cupertino, CA"
        cardDescription="We are seeking a highly motivated product manager to lead our product development efforts."
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 22,
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.medium,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.medium,
  },

  search: {
    flex: 1,
    borderRadius: theme.radius.large
  },

  notification: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderWidth: 1
  },

  iconContainer: {
    position: "absolute",
    right: 14, // Aligns perfectly with your paddingHorizontal
    zIndex: 2, // Keeps it layer-wise above the input field
  },


 
});
