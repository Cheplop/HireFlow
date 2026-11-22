import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import theme from '../../styles/theme';

export function ChipGroup({ label, options, value, onChange, icons = {} }) {
    return (
        <View>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.row}>
                {options.map((option) => {
                    const selected = option === value;
                    return (
                        <Pressable
                            key={option}
                            onPress={() => onChange(option)}
                            accessibilityRole="radio"
                            accessibilityState={{ selected }}
                            style={({ pressed }) => [
                                styles.chip,
                                selected && styles.chipSelected,
                                pressed && styles.pressed,
                            ]}
                        >
                            {icons[option] ? (
                                <Ionicons
                                    name={icons[option]}
                                    size={15}
                                    color={selected ? theme.fontColor.dark : theme.fontColor.secondary}
                                />
                            ) : null}
                            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                                {option}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: theme.fontSize.small + 1,
        fontWeight: theme.fontWeight.semibold,
        color: theme.fontColor.primary,
        marginBottom: theme.spacing.small,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.small,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: theme.spacing.medium - 2,
        paddingVertical: theme.spacing.small + 2,
        borderRadius: theme.radius.small,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.mutedBackground,
    },
    chipSelected: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    chipText: {
        fontSize: theme.fontSize.small + 1,
        fontWeight: theme.fontWeight.semibold,
        color: theme.fontColor.secondary,
    },
    chipTextSelected: {
        color: theme.fontColor.dark,
    },
    pressed: {
        opacity: 0.9,
    },
});