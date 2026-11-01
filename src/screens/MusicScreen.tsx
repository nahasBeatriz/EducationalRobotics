import React, { useRef, useState } from 'react';
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
    'Dó': '#d34d4d', 
    'Ré': '#ec940f', 
    'Mi': '#f1ca1c', 
    'Fá': '#2bb132', 
    'Sol': '#2197ce',
    'Lá': '#4b5ecc', 
    'Si': '#d230d8', 
};

export default function MusicScreen({
    musicQueue, onAdd, onRemove, onMoveUp, onMoveDown, onClear, onOpenDrawer,
}: Props) {
    const [selectedNote, setSelectedNote] = useState<NoteName>('Dó');
    const [duration, setDuration] = useState(1);
    const [reorderingId, setReorderingId] = useState<string | null>(null);
    const lastTapRef = useRef<Record<string, number>>({});

    const changeDuration = (delta: number) =>
        setDuration(prev => Math.max(1, Math.min(60, prev + delta)));

    const handlePress = (id: string) => {
        const now = Date.now();
        const last = lastTapRef.current[id] ?? 0;
        if (now - last < 200) {
            onRemove(id);
            if (reorderingId === id) setReorderingId(null);
            delete lastTapRef.current[id];
        } else {
            lastTapRef.current[id] = now;
        }
    };

    const handleLongPress = (id: string) => {
        setReorderingId(prev => (prev === id ? null : id));
    };

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
                    <Text style={s.noteBtnText}>{note}</Text>
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
                disabled={musicQueue.length === 0}>
                <Text style={s.clearBtnText}>Apagar Tudo</Text>
            </TouchableOpacity>

            {/* Fila */}
            <View style={s.queueBox}>
                {musicQueue.length === 0 ? (
                    <View style={s.empty}>
                        <Text style={s.emptyText}>Nenhum tom adicionado ainda</Text>
                    </View>
                ) : (
                    <ScrollView style={s.queueScroll} nestedScrollEnabled showsVerticalScrollIndicator>
                        <View style={s.queueList}>
                        {musicQueue.map((item, index) => {
                            const isReordering = reorderingId === item.id;
                            const color = NOTE_COLORS[item.note];
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => handlePress(item.id)}
                                    onLongPress={() => handleLongPress(item.id)}
                                    delayLongPress={2000}
                                    activeOpacity={0.8}>
                                    <View style={[s.queueItem, isReordering && { borderColor: color, borderWidth: 2 }]}>
                                        <View style={[s.colorBar, { backgroundColor: color }]} />
                                        <View style={s.queueContent}>
                                            <Text style={s.queueNote}>{item.note}</Text>
                                            <Text style={s.queueDuration}>{item.duration}s · {item.frequency}Hz</Text>
                                        </View>
                                        {!isReordering && (
                                            <Text style={s.hint}>2× apaga · 2s move</Text>
                                        )}
                                        {isReordering && (
                                            <View style={s.arrows}>
                                                <TouchableOpacity
                                                    style={[s.arrowBtn, index === 0 && s.disabled]}
                                                    onPress={() => onMoveUp(item.id)}
                                                    disabled={index === 0}>
                                                    <Text style={s.arrowText}>↑</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[s.arrowBtn, index === musicQueue.length - 1 && s.disabled]}
                                                    onPress={() => onMoveDown(item.id)}
                                                    disabled={index === musicQueue.length - 1}>
                                                    <Text style={s.arrowText}>↓</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={s.okBtn} onPress={() => setReorderingId(null)}>
                                                    <Text style={s.okText}>OK</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                        </View>
                    </ScrollView>
                )}
            </View>

            <Text style={s.footerHint}>
                A música será enviada junto com a programação de movimento.
            </Text>

        </ScrollView>
        </SafeAreaView>
    );
}

const s = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#2A0048' },
    container: { padding: 18, gap: 12, paddingBottom: 40, paddingTop: 40 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
    menuBtn: { padding: 6 },
    menuIcon: { fontSize: 22, color: '#ffffff' },
    title: { fontSize: 18, fontWeight: '700', color: '#ffffff' },
    sectionLabel: { fontSize: 13, fontWeight: '600', color: '#ffffff', marginBottom: 2 },
    noteRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    noteBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12 },
    noteBtnActive: { transform: [{ scale: 1.12 }], elevation: 4, shadowColor: '#ffffff', shadowOpacity: 0.3, shadowRadius: 4 },
    noteBtnText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
    durationCard: { backgroundColor: '#560072', borderRadius: 14, padding: 14, gap: 8, alignItems: 'center' },
    durationRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    durationBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#800080', alignItems: 'center', justifyContent: 'center' },
    durationBtnText: { fontSize: 20, color: '#ffffff', fontWeight: '700' },
    durationValue: { fontSize: 18, fontWeight: '700', color: '#ffffff', minWidth: 40, textAlign: 'center' },
    addBtn: { backgroundColor: '#278124', borderRadius: 14, paddingVertical: 13, alignItems: 'center' },
    addBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
    clearBtn: { backgroundColor: '#cc2626', borderRadius: 14, paddingVertical: 11, alignItems: 'center' },
    clearBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
    queueBox: { backgroundColor: '#560072', borderRadius: 14, padding: 12, minHeight: 72, maxHeight: 300 },
    queueScroll: { flexGrow: 0 },
    queueList: { gap: 6 },
    empty: { padding: 16, alignItems: 'center' },
    emptyText: { color: '#ffffff81', fontSize: 13, textAlign: 'center' },
    queueItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#800080',
        borderRadius: 12, overflow: 'hidden', minHeight: 48,
        borderColor: 'transparent', borderWidth: 2 },
    colorBar: { width: 8, alignSelf: 'stretch' },
    queueContent: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12 },
    queueNote: { color: '#ffffff', fontWeight: '700', fontSize: 14, flex: 1 },
    queueDuration: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
    hint: { color: '#ffffff81', fontSize: 10, paddingRight: 10 },
    arrows: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingRight: 8 },
    arrowBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#A90072', justifyContent: 'center', alignItems: 'center' },
    disabled: { opacity: 0.3 },
    arrowText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
    okBtn: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#D50048', borderRadius: 8 },
    okText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
    footerHint: { fontSize: 12, color: '#ffffff81', textAlign: 'center', fontStyle: 'italic' },
});