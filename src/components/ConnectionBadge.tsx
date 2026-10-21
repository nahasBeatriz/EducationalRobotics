import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ConnectionStatus } from '../hooks/useConnection';

const CONFIG: Record<ConnectionStatus, { color: string; label: string }> = {
    checking: { color: '#0061e9', label: 'Verificando...' },
    connected: { color: '#00cf1c', label: 'Conectado' },
    disconnected: { color: '#FF0000', label: 'Desconectado' },
};

export function ConnectionBadge({ status }: { status: ConnectionStatus }) {
    const { color, label } = CONFIG[status];
    return (
        <View style={s.row}>
        <View style={[s.dot, { backgroundColor: color }]} />
        <Text style={[s.label, { color }]}>{label}</Text>
        </View>
    );
}

const s = StyleSheet.create({
    row:   { flexDirection: 'row', alignItems: 'center', gap: 7 },
    dot:   { width: 10, height: 10, borderRadius: 5 },
    label: { fontSize: 15, fontWeight: '600' },
});