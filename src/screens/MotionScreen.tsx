import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { useEsp32 } from '../hooks/useEsp32';
import { useConnection } from '../hooks/useConnection';
import { COMMANDS } from '../constants/commands';
import { ConnectionBadge } from '../components/ConnectionBadge';
import { CommandRow } from '../components/CommandRow';
import { QueueList } from '../components/QueueList';
import { PreviewModal } from '../components/PreviewModal';
import { MusicStep } from '../types';

type Props = {
    musicQueue: MusicStep[];
    onOpenDrawer: () => void;
};

export default function MotionScreen({ musicQueue = [], onOpenDrawer }: Props) {
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

            <View style={s.header}>
                <TouchableOpacity onPress={onOpenDrawer} style={s.menuBtn}>
                    <Text style={s.menuIcon}>☰</Text>
                </TouchableOpacity>
                <Text style={s.title}>Programar Movimento</Text>
                <ConnectionBadge status={connectionStatus} />
            </View>

            {COMMANDS.map(cmd => (
                <CommandRow
                    key={cmd.command}
                    cmd={cmd}
                    duration={durations[cmd.command] ?? 1}
                    onAdd={() => addToQueue(cmd.command, cmd.label, durations[cmd.command] ?? 1)}
                    onChangeDuration={delta => changeDuration(cmd.command, delta)}/>
            ))}

            <View style={s.sliderCard}>
                <Text style={s.sliderLabel}>Velocidade: {speedPct}%</Text>
                <Slider
                    style={s.slider}
                    minimumValue={0}
                    maximumValue={100}
                    step={1}
                    value={speedPct}
                    onValueChange={setSpeedPct}
                    minimumTrackTintColor="#800080"
                    maximumTrackTintColor="#800080"
                    thumbTintColor="#800080"/>
            </View>

            {musicQueue.length > 0 && (
                <View style={s.musicBadge}>
                    <Text style={s.musicBadgeText}>
                        {musicQueue.length} nota{musicQueue.length > 1 ? 's' : ''} configurada{musicQueue.length > 1 ? 's' : ''}
                    </Text>
                </View>
            )}

            <View style={s.actionRow}>
                <TouchableOpacity
                    style={[s.actionBtn, { backgroundColor: '#cc2626' }]}
                    onPress={clearQueue}>
                    <Text style={s.actionText}>Apagar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[s.actionBtn, { backgroundColor: '#e4b21b', opacity: queue.length === 0 ? 0.45 : 1 }]}
                    onPress={() => setShowPreview(true)}
                    disabled={queue.length === 0}>
                    <Text style={s.actionText}>Testar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[s.actionBtn, {
                        backgroundColor: '#278124',
                        opacity: loading || queue.length === 0 ? 0.45 : 1,
                    }]}
                    onPress={() => sendQueue(musicQueue)}
                    disabled={loading || queue.length === 0}>
                    <Text style={s.actionText}>{loading ? '...' : 'Enviar'}</Text>
                </TouchableOpacity>
            </View>

            {error ? <Text style={s.error}>{error}</Text> : null}

            <View style={s.queueBox}>
                <QueueList
                    queue={queue}
                    onRemove={removeItem}
                    onMoveUp={id => moveItem(id, 'up')}
                    onMoveDown={id => moveItem(id, 'down')}/>
            </View>

        </ScrollView>

        <PreviewModal
            visible={showPreview}
            queue={queue}
            onClose={() => setShowPreview(false)}/>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#2A0048' },
    container: { padding: 18, gap: 10, paddingBottom: 40, paddingTop: 40 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
    menuBtn: { padding: 6 },
    menuIcon: { fontSize: 22, color: '#ffffff' },
    title: { flex: 1, fontSize: 18, fontWeight: '700', color: '#ffffff' },
    musicBadge: { backgroundColor: '#C8E6C9', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start' },
    musicBadgeText: { color: '#2E7D32', fontSize: 13, fontWeight: '600' },
    sliderCard: { backgroundColor: '#560072', borderRadius: 14, padding: 14, gap: 4 },
    sliderLabel: { color: '#ffffff', fontSize: 14 },
    slider: { width: '100%' },
    actionRow: { flexDirection: 'row', gap: 10 },
    actionBtn: { flex: 1, paddingVertical: 13, borderRadius: 14, alignItems: 'center' },
    actionText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
    error: { color: '#F87171', fontSize: 13, textAlign: 'center' },
    queueBox: { backgroundColor: '#560072', borderRadius: 14, padding: 12, minHeight: 72, maxHeight: 300 },
});