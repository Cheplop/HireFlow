import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import theme from '../../styles/theme';

export function JobFormField({
    label,
    required = false,
    hint,
    icon,
    prefix,
    counter,
    error,
    multiline = false,
    style,
    ...props
}) {
    const [focused, setFocused] = useState(false);

    return (
        <View style={style}>
            <View style={styles.labelRow}>
                <Text style={styles.label}>
                    {label}
                    {required ? <Text style={styles.required}> *</Text> : null}
                </Text>
                {counter ? <Text style={styles.counter}>{counter}</Text> : null}
            </View>

            <View
                style={[
                    styles.field,
                    multiline && styles.fieldMultiline,
                    focused && styles.fieldFocused,
                    error && styles.fieldError,
                ]}
            >
                {icon ? (
                    <Ionicons
                        name={icon}
                        size={18}
                        color={focused ? theme.colors.primary : theme.colors.placeholder}
                        style={[styles.icon, multiline && styles.iconMultiline]}
                    />
                ) : null}

                {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}

                <TextInput
                    {...props}
                    multiline={multiline}
                    onFocus={(e) => {
                        setFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setFocused(false);
                        props.onBlur?.(e);
                    }}
                    placeholderTextColor={theme.colors.placeholder}
                    textAlignVertical={multiline ? 'top' : 'center'}
                    style={[styles.input, multiline && styles.inputMultiline]}
                />
            </View>

            {error ? (
                <View style={styles.messageRow}>
                    <Ionicons name="alert-circle" size={14} color={theme.actions.deletePrimary} />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : hint ? (
                <Text style={styles.hint}>{hint}</Text>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: theme.spacing.small,
    },
    label: {
        fontSize: theme.fontSize.small + 1,
        fontWeight: theme.fontWeight.semibold,
        color: theme.fontColor.primary,
    },
    required: {
        color: theme.actions.deletePrimary,
    },
    counter: {
        fontSize: theme.fontSize.xsmall,
        color: theme.fontColor.secondary,
    },
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.mutedBackground,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.small,
        paddingHorizontal: theme.spacing.medium - 4,
    },
    fieldMultiline: {
        alignItems: 'flex-start',
    },
    fieldFocused: {
        borderColor: theme.colors.primary,
        backgroundColor: theme.colors.cardBackground,
    },
    fieldError: {
        borderColor: theme.actions.deletePrimary,
        backgroundColor: theme.actions.deleteBg,
    },
    icon: {
        marginRight: theme.spacing.small + 2,
    },
    iconMultiline: {
        marginTop: 14,
    },
    prefix: {
        fontSize: theme.fontSize.medium,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.primary,
        marginRight: 6,
    },
    input: {
        flex: 1,
        fontSize: theme.fontSize.medium,
        color: theme.fontColor.primary,
        paddingVertical: 13,
    },
    inputMultiline: {
        minHeight: 104,
        paddingTop: 13,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginTop: 6,
    },
    errorText: {
        fontSize: theme.fontSize.small,
        color: theme.actions.deletePrimary,
    },
    hint: {
        fontSize: theme.fontSize.small,
        color: theme.fontColor.secondary,
        marginTop: 6,
    },
});