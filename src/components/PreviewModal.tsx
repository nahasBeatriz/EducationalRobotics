import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Image, StyleSheet } from 'react-native';
import { QueueItem } from '../types';
import { COMMANDS, CMD_COLORS } from '../constants/commands';

const CMD_IMAGE = Object.fromEntries(COMMANDS.map(c => [c.command, c.image]));

type Props = {
    visible: boolean;
    queue: QueueItem[];
    onClose: () => void;
};

export function PreviewModal({ visible, queue, onClose }: Props) {
    const [step, setStep] = useState(-1);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!visible) { setStep(-1); return; }

        const advance = (i: number) => {
            if (i >= queue.length) { setStep(queue.length); return; }
            setStep(i);
            const dur = Math.max(queue[i].duration, 0.6) * 1000;
            timerRef.current = setTimeout(() => advance(i + 1), dur);
        };

        timerRef.current = setTimeout(() => advance(0), 300);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [visible]);

    const current = step >= 0 && step < queue.length ? queue[step] : null;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={s.overlay}>
                <View style={s.box}>
                    <Text style={s.title}>Prévia dos Comandos</Text>

                    {/* Imagem grande do comando atual */}
                    <View style={[s.imgBox, { backgroundColor: current ? CMD_COLORS[current.command] : '#333' }]}>
                        {current ? (
                            <>
                                <Image source={CMD_IMAGE[current.command]} style={s.cmdImage} resizeMode="contain" />
                                <Text style={s.cmdLabel}>{current.label} · {current.duration}s</Text>
                            </>
                        ) : step >= queue.length ? (
                            <Text style={s.done}>Concluído</Text>
                        ) : (
                            <Text style={s.waiting}>Aguardando...</Text>
                        )}
                    </View>

                    <View style={s.pills}>
                        {queue.map((item, i) => (
                            <View
                                key={item.id}
                                style={[
                                    s.pill,
                                    { backgroundColor: CMD_COLORS[item.command] ?? '#6B7280' },
                                    i === step ? s.pillActive : s.pillDim,
                                ]}>
                                <Text style={s.pillText}>{item.label}</Text>
                                {item.duration > 0 && <Text style={s.pillDur}>{item.duration}s</Text>}
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity style={s.closeBtn} onPress={onClose}>
                        <Text style={s.closeBtnText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const s = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
    box: { backgroundColor: '#2A0048', borderRadius: 20, padding: 22, width: '90%', alignItems: 'center', gap: 14 },
    title: { fontSize: 17, fontWeight: '700', color: '#ffffff' },
    imgBox: { width: 180, height: 180, borderRadius: 20, backgroundColor: '#2A0048', justifyContent: 'center', alignItems: 'center', gap: 8 },
    cmdImage: { width: 120, height: 120 },
    cmdLabel: { color: '#fff', fontWeight: '700', fontSize: 15 },
    done: { color: '#4CAF50', fontWeight: '700', fontSize: 18 },
    waiting: { color: '#ffffff', fontSize: 14 },
    pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
    pill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
    pillText: { color: '#ffffff', fontWeight: '600', fontSize: 12 },
    pillDur: { color: '#ffffff', fontSize: 11 },
    pillActive: { transform: [{ scale: 1.15 }] },
    pillDim: { opacity: 0.4 },
    closeBtn: { backgroundColor: '#560072', paddingHorizontal: 28, paddingVertical: 10, borderRadius: 10 },
    closeBtnText: { color: '#ffffff', fontWeight: '600' },
});