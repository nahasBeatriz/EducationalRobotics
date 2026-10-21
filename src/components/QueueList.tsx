import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { QueueItem } from '../types';
import { CMD_COLORS } from '../constants/commands';

type Props = {
    queue: QueueItem[];
    onRemove: (id: string) => void;
    onMoveUp: (id: string) => void;
    onMoveDown: (id: string) => void;
};

export function QueueList({ queue, onRemove, onMoveUp, onMoveDown }: Props) {
    const [reorderingId, setReorderingId] = useState<string | null>(null);
    const lastTapRef = useRef<Record<string, number>>({});

    const handlePress = (id: string) => {
        const now = Date.now();
        const last = lastTapRef.current[id] ?? 0;
        if (now - last < 200) {
        // Duplo toque — apaga
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

    if (queue.length === 0) {
        return (
        <View style={s.empty}>
            <Text style={s.emptyText}>Fila vazia — toque nos comandos acima para adicionar</Text>
        </View>
        );
    }

    return (
        <ScrollView style={s.scroll} nestedScrollEnabled showsVerticalScrollIndicator>
            <View style={s.list}>
            {queue.map((item, index) => {
                const isReordering = reorderingId === item.id;
                const color = CMD_COLORS[item.command] ?? '#6B7280';

                return (
                <TouchableOpacity
                    key={item.id}
                    onPress={() => handlePress(item.id)}
                    onLongPress={() => handleLongPress(item.id)}
                    delayLongPress={3000}
                    activeOpacity={0.8}>
                    <View style={[s.item, isReordering && { borderColor: color, borderWidth: 2 }]}>
                    <View style={[s.colorBar, { backgroundColor: color }]} />

                    <View style={s.content}>
                        <Text style={s.label}>{item.label}</Text>
                        {item.duration > 0 && <Text style={s.dur}>{item.duration}s</Text>}
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
                            style={[s.arrowBtn, index === queue.length - 1 && s.disabled]}
                            onPress={() => onMoveDown(item.id)}
                            disabled={index === queue.length - 1}>
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
    );
}

const s = StyleSheet.create({
    empty: { padding: 16, alignItems: 'center' },
    emptyText: { color: '#ffffff81', fontSize: 13, textAlign: 'center' },
    list: { gap: 6 },
    item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#800080',
            borderRadius: 12, overflow: 'hidden', minHeight: 48,
            borderColor: 'transparent', borderWidth: 2 },
    colorBar: { width: 8, alignSelf: 'stretch' },
    content: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12 },
    label: { color: '#ffffff', fontWeight: '600', fontSize: 14, flex: 1 },
    dur: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
    hint: { color: '#ffffff81', fontSize: 10, paddingRight: 10 },
    arrows: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingRight: 8 },
    arrowBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#A90072',
            justifyContent: 'center', alignItems: 'center' },
    disabled: { opacity: 0.3 },
    arrowText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
    okBtn: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#D50048', borderRadius: 8 },
    okText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
    scroll: { flexGrow: 0 },
});