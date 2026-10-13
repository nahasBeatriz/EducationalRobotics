import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

type Props = {
    label: string;
    onPress: () => void;
    color?: string;
    disabled?: boolean;
    style?: ViewStyle;
    };

    export function ControlButton({ label, onPress, color = '#2196F3', disabled = false, style }: Props) {
    return (
        <TouchableOpacity
            style={[styles.btn, { backgroundColor: disabled ? '#555' : color }, style]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
    }

    const styles = StyleSheet.create({
    btn: {
        width: 200,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    label: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});