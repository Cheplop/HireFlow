import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

import { AuthInput } from '@/components/AuthInput';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    Alert.alert(
      'Register',
      `Name: ${fullName || 'not provided'}\nEmail: ${email || 'not provided'}\nPassword: ${password || 'not provided'}`
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.card}>


      <View style={styles.header}>
        <Text style={styles.brand}>HireFlow</Text>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Sign up to manage your applications with a cleaner workflow.</Text>
      </View>

        <AuthInput label="Full name" placeholder="Jane Doe" value={fullName} onChangeText={setFullName} />
        <AuthInput
          label="Email"
          placeholder="name@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <AuthInput
          label="Password"
          placeholder="Create a password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <PrimaryButton title="Register" onPress={handleRegister} />

        <View style={styles.registerRow}>
            <TouchableOpacity onPress={() => router.replace('/')}>
                <Text>LOGIN</Text>
            </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FBFBFB',
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 36,
  },
  header: {
    marginBottom: 18,
  },
  brand: {
    color: 'black',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  title: {
    color: '#111827',
    fontSize: 30,
    fontWeight: '400',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    color: '#5f6c7b',
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 22,
    shadowColor: '#c7d6f3',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6,
    borderRadius: 20,
    boxShadow:  '0px 3px 8px rgba(0, 0, 0, 0.24)'
  },
    registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  registerText: {
    color: '#667085',
    fontSize: 14,
  },
  registerLink: {
    color: '#1c5ce6',
    fontSize: 14,
    fontWeight: '700',
  },
});
