import { Pressable, StyleSheet, Text } from 'react-native';
import theme from '../styles/theme';

export function PrimaryButton({ title, variant = 'primary', style, ...props }) {
    return (
        <Pressable
            {...props}
            style={({ pressed }) => [
                styles.button,
                styles[variant],
                pressed && styles.pressed,
                style,
            ]}
        >
            <Text style={[styles.text, styles[`${variant}Text`]]}>
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
    active: {
        backgroundColor: '#7288AE',
    },
    inactive: {
        backgroundColor: '#eaf2ff',
    },
    pressed: {
        opacity: 0.9,
    },
    text: {
        fontSize: theme.fontSize.small,
        fontWeight: '700',
    },
    primaryText: {
        color: '#ffffff',
    },
    secondaryText: {
        color: '#1a3b88',
    },
    activeText: {
        color: '#ffffff',
    },
    inactiveText: {
        color: '#777777',
    },
});