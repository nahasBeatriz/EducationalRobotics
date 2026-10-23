import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const LEDS = [
    { command: 'led_verde', label: 'Led Verde', color: '#2bb132' },
    { command: 'led_azul', label: 'Led Azul', color: '#2197ce' },
    { command: 'led_vermelho', label: 'Led Vermelho', color: '#d34d4d' },
] as const;

const LED_DURATION = 2; 

type Props = {
    onAdd: (command: string, label: string, duration: number) => void;
};

export function LedRow({ onAdd }: Props) {
    return (
        <View style={s.wrapper}>
            <Text style={s.sectionLabel}>Led RGB</Text>
            <View style={s.row}>
                {LEDS.map(led => (
                    <TouchableOpacity
                        key={led.command}
                        style={[s.circle, { backgroundColor: led.color }]}
                        onPress={() => onAdd(led.command, led.label, LED_DURATION)}
                        activeOpacity={0.75}/>
                ))}
            </View>
        </View>
    );
}

const s = StyleSheet.create({
    wrapper: { gap: 6, alignItems: 'flex-start' },
    sectionLabel: { fontSize: 13, fontWeight: '600', color: '#ffffff' },
    row: { flexDirection: 'row', gap: 16, alignSelf: 'stretch', justifyContent: 'center' },
    circle: { width: 48, height: 48, borderRadius: 24 },
});