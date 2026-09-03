import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';

import { AuthInput } from '@/components/AuthInput';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    Alert.alert('Login', `Email: ${email || 'not provided'}\nPassword: ${password || 'not provided'}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.brand}>HireFlow</Text>
          <Text style={styles.subtitle}>Sign up to get started with flowing jobs!</Text>
        </View>

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
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <PrimaryButton title="Log in" onPress={handleLogin} />

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Don’t have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.registerLink}>Register</Text>
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
    marginBottom: 3,
    alignItems: 'flex-start',
  },
  brand: {
    color: 'black',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    color: '#111827',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    color: '#5f6c7b',
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    padding: 22,
    shadowColor: '#c7d6f3',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6,
    borderRadius: 20,
    backgroundColor: '#ffffff',
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
