import { Pressable, StyleSheet, Text } from 'react-native';

export function PrimaryButton({ title, variant = 'primary', style, ...props }) {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' ? styles.secondary : styles.primary,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, variant === 'secondary' ? styles.secondaryText : styles.primaryText]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primary: {
    backgroundColor: '#7288AE',
  },
  secondary: {
    backgroundColor: '#eaf2ff',
    borderColor: '#c7d6f3',
  },
  pressed: {
    opacity: 0.9,
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#1a3b88',
  },
});
