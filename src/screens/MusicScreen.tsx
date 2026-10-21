import React, { useState } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    ScrollView, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NoteName, MusicStep } from '../types';
import { ALL_NOTES } from '../hooks/useMusic';

type Props = {
    musicQueue: MusicStep[];
    onAdd: (note: NoteName, duration: number) => void;
    onRemove: (id: string) => void;
    onMoveUp: (id: string) => void;
    onMoveDown: (id: string) => void;
    onClear: () => void;
    onOpenDrawer: () => void;
};

const NOTE_COLORS: Record<NoteName, string> = {
    'Dó': '#E57373', 
    'Ré': '#FF9800', 
    'Mi': '#FDD835', 
    'Fá': '#66BB6A', 
    'Sol': '#29B6F6',
    'Lá': '#5C6BC0', 
    'Si': '#AB47BC', 
};

export default function MusicScreen({
    musicQueue, onAdd, onRemove, onMoveUp, onMoveDown, onClear, onOpenDrawer,
}: Props) {
    const [selectedNote, setSelectedNote] = useState<NoteName>('Dó');
    const [duration, setDuration] = useState(1);

    const changeDuration = (delta: number) =>
        setDuration(prev => Math.max(1, Math.min(60, prev + delta)));

    return (
        <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">

            <View style={s.header}>
            <TouchableOpacity onPress={onOpenDrawer} style={s.menuBtn}>
                <Text style={s.menuIcon}>☰</Text>
            </TouchableOpacity>
            <Text style={s.title}>Configurar Música</Text>
            </View>

            <Text style={s.sectionLabel}>Selecionar Tom</Text>

            <View style={s.noteRow}>
                {ALL_NOTES.map(note => (
                    <TouchableOpacity
                    key={note}
                    style={[
                        s.noteBtn,
                        { backgroundColor: NOTE_COLORS[note] },
                        selectedNote === note && s.noteBtnActive,
                    ]}
                    onPress={() => setSelectedNote(note)}>
                    <Text style={[s.noteBtnText, s.noteBtnTextActive]}>
                        {note}
                    </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={s.durationCard}>
            <Text style={s.sectionLabel}>Duração do Tom</Text>
            <View style={s.durationRow}>
                <TouchableOpacity style={s.durationBtn} onPress={() => changeDuration(-1)}>
                <Text style={s.durationBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={s.durationValue}>{duration}s</Text>
                <TouchableOpacity style={s.durationBtn} onPress={() => changeDuration(1)}>
                <Text style={s.durationBtnText}>+</Text>
                </TouchableOpacity>
            </View>
            </View>

            <TouchableOpacity style={s.addBtn} onPress={() => onAdd(selectedNote, duration)}>
            <Text style={s.addBtnText}>＋ Adicionar Tom</Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={[s.clearBtn, musicQueue.length === 0 && { opacity: 0.4 }]}
            onPress={onClear}
            disabled={musicQueue.length === 0}
            >
            <Text style={s.clearBtnText}>Apagar Tudo</Text>
            </TouchableOpacity>

            <View style={s.queueBox}>
            {musicQueue.length === 0 ? (
                <Text style={s.emptyText}>Nenhum tom adicionado ainda</Text>
            ) : (
                <FlatList
                data={musicQueue}
                keyExtractor={item => item.id}
                scrollEnabled={false}
                renderItem={({ item, index }) => (
                    <View style={s.queueItem}>
                    <View style={s.queueItemLeft}>
                        <Text style={s.queueNote}>{item.note}</Text>
                        <Text style={s.queueDuration}>{item.duration}s · {item.frequency}Hz</Text>
                    </View>
                    <View style={s.queueActions}>
                        <TouchableOpacity
                        style={[s.moveBtn, index === 0 && { opacity: 0.3 }]}
                        onPress={() => onMoveUp(item.id)}
                        disabled={index === 0}
                        >
                        <Text style={s.moveBtnText}>↑</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        style={[s.moveBtn, index === musicQueue.length - 1 && { opacity: 0.3 }]}
                        onPress={() => onMoveDown(item.id)}
                        disabled={index === musicQueue.length - 1}
                        >
                        <Text style={s.moveBtnText}>↓</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={s.removeBtn} onPress={() => onRemove(item.id)}>
                        <Text style={s.removeBtnText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                )}
                />
            )}
            </View>

            <Text style={s.hint}>
            A música será enviada junto com a programação de movimento.
            </Text>

        </ScrollView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#E3E3E3' },
    container: { padding: 18, gap: 12, paddingBottom: 40, paddingTop: 40 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
    menuBtn: { padding: 6 },
    menuIcon: { fontSize: 22, color: '#333' },
    title: { fontSize: 18, fontWeight: '700', color: '#111' },
    sectionLabel: { fontSize: 13, fontWeight: '600', color: '#444', marginBottom: 2 },
    noteRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    noteBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12 },
    noteBtnActive: { transform: [{ scale: 1.12 }], elevation: 4, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4 },
    noteBtnText: { fontSize: 15, fontWeight: '700', color: '#000000' },
    noteBtnTextActive: { color: '#000000' },
    durationCard: { backgroundColor: '#BBB9B2', borderRadius: 14, padding: 14, gap: 8, alignItems: 'center' },
    durationRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    durationBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#9A9890', alignItems: 'center', justifyContent: 'center' },
    durationBtnText: { fontSize: 20, color: '#fff', fontWeight: '700' },
    durationValue: { fontSize: 18, fontWeight: '700', color: '#111', minWidth: 40, textAlign: 'center' },
    addBtn: { backgroundColor: '#6e6d69', borderRadius: 14, paddingVertical: 13, alignItems: 'center' },
    addBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    clearBtn: { backgroundColor: '#e02a2a', borderRadius: 14, paddingVertical: 11, alignItems: 'center' },
    clearBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    queueBox: { backgroundColor: '#BBB9B2', borderRadius: 14, padding: 12, minHeight: 72 },
    emptyText: { color: '#666', fontSize: 13, textAlign: 'center', paddingVertical: 16 },
    queueItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#A5A39C' },
    queueItemLeft: { flex: 1 },
    queueNote: { fontSize: 15, fontWeight: '700', color: '#111' },
    queueDuration: { fontSize: 12, color: '#555', marginTop: 1 },
    queueActions: { flexDirection: 'row', gap: 6 },
    moveBtn: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#9A9890', alignItems: 'center', justifyContent: 'center' },
    moveBtnText: { fontSize: 14, color: '#fff', fontWeight: '700' },
    removeBtn: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#c0392b', alignItems: 'center', justifyContent: 'center' },
    removeBtnText: { fontSize: 13, color: '#fff', fontWeight: '700' },
    hint: { fontSize: 12, color: '#666', textAlign: 'center', fontStyle: 'italic' },
});