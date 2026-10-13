import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    ScrollView, SafeAreaView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useEsp32 } from '../hooks/useEsp32';
import { useConnection } from '../hooks/useConnection';
import { COMMANDS } from '../constants/commands';
import { ConnectionBadge } from '../components/ConnectionBadge';
import { CommandRow } from '../components/CommandRow';
import { QueueList } from '../components/QueueList';
import { PreviewModal } from '../components/PreviewModal';

export default function HomeScreen() {
    const {
        loading, error,
        speedPct, setSpeedPct,
        queue, addToQueue, removeItem, moveItem, clearQueue, sendQueue,
    } = useEsp32();

    const connectionStatus = useConnection();

    const [durations, setDurations] = useState<Record<string, number>>(
        Object.fromEntries(COMMANDS.map(c => [c.command, 1]))
    );
    const [showPreview, setShowPreview] = useState(false);

    const changeDuration = (command: string, delta: number) =>
        setDurations(prev => ({
        ...prev,
        [command]: Math.max(1, Math.min(60, (prev[command] ?? 1) + delta)),
        }));

    return (
        <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">

            {/* Status de conexão */}
            <View style={s.header}>
            <ConnectionBadge status={connectionStatus} />
            </View>

            {/* Linhas de comando — todas com temporizador */}
            {COMMANDS.map(cmd => (
            <CommandRow
                key={cmd.command}
                cmd={cmd}
                duration={durations[cmd.command] ?? 1}
                onAdd={() => addToQueue(cmd.command, cmd.label, durations[cmd.command] ?? 1)}
                onChangeDuration={delta => changeDuration(cmd.command, delta)}
            />
            ))}

            {/* Velocidade em % */}
            <View style={s.sliderCard}>
            <Text style={s.sliderLabel}>Velocidade: {speedPct}%</Text>
            <Slider
                style={s.slider}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={speedPct}
                onValueChange={setSpeedPct}
                minimumTrackTintColor="#60A5FA"
                maximumTrackTintColor="#374151"
                thumbTintColor="#60A5FA"
            />
            </View>

            {/* Ações */}
            <View style={s.actionRow}>
            <TouchableOpacity
                style={[s.actionBtn, { backgroundColor: '#EF4444' }]}
                onPress={clearQueue}
            >
                <Text style={s.actionText}>Apagar</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[s.actionBtn, { backgroundColor: '#EAB308', opacity: queue.length === 0 ? 0.45 : 1 }]}
                onPress={() => setShowPreview(true)}
                disabled={queue.length === 0}
            >
                <Text style={s.actionText}>Testar</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[s.actionBtn, {
                backgroundColor: '#22C55E',
                opacity: loading || queue.length === 0 ? 0.45 : 1,
                }]}
                onPress={sendQueue}
                disabled={loading || queue.length === 0}
            >
                <Text style={s.actionText}>{loading ? '...' : 'Enviar'}</Text>
            </TouchableOpacity>
            </View>

            {error ? <Text style={s.error}>{error}</Text> : null}

            {/* Fila */}
            <View style={s.queueBox}>
            <QueueList
                queue={queue}
                onRemove={removeItem}
                onMoveUp={id => moveItem(id, 'up')}
                onMoveDown={id => moveItem(id, 'down')}
            />
            </View>

        </ScrollView>

        <PreviewModal
            visible={showPreview}
            queue={queue}
            onClose={() => setShowPreview(false)}
        />
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#0F172A' },
    container: { padding: 18, gap: 10, paddingBottom: 40 },
    header: { marginBottom: 4 },

    sliderCard: { backgroundColor: '#1E293B', borderRadius: 14, padding: 14, gap: 4 },
    sliderLabel: { color: '#CBD5E1', fontSize: 14 },
    slider: { width: '100%' },

    actionRow: { flexDirection: 'row', gap: 10 },
    actionBtn: { flex: 1, paddingVertical: 13, borderRadius: 14, alignItems: 'center' },
    actionText: { color: '#fff', fontWeight: '700', fontSize: 15 },

    error: { color: '#F87171', fontSize: 13, textAlign: 'center' },
    queueBox: { backgroundColor: '#1E293B', borderRadius: 14, padding: 12, minHeight: 72, maxHeight: 300 },
});