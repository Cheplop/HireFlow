import { StyleSheet, Text, View } from 'react-native';
import theme from '../../styles/theme';

export function JobFormSection({ step, title, children }) {
    return (
        <View style={styles.section}>
            <View style={styles.header}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{step}</Text>
                </View>
                <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.body}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        gap: theme.spacing.medium - 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.small + 2,
    },
    badge: {
        width: 24,
        height: 24,
        borderRadius: theme.radius.small,
        backgroundColor: theme.colors.mutedBackground,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        fontSize: theme.fontSize.small,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.primary,
    },
    title: {
        fontSize: theme.fontSize.medium,
        fontWeight: theme.fontWeight.bold,
        color: theme.fontColor.primary,
    },
    body: {
        gap: theme.spacing.medium,
    },
});