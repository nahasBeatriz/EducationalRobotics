import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet,
    ScrollView, Modal, SafeAreaView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useEsp32, QueueItem } from '../hooks/useEsp32';

// ── Definição dos comandos ────────────────────────────────────────────────────
const COMMANDS = [
    { command: 'frente',   label: 'Para Frente',      color: '#22D3EE', hasDuration: true  },
    { command: 'tras',     label: 'Para Trás',         color: '#60A5FA', hasDuration: true  },
    { command: 'direita',  label: 'Gira Para Direita', color: '#34D399', hasDuration: true  },
    { command: 'esquerda', label: 'Gira Para Esquerda',color: '#A78BFA', hasDuration: true  },
    { command: 'parar',    label: 'Parar',             color: '#F87171', hasDuration: false },
    ] as const;

const CMD_COLORS: Record<string, string> = Object.fromEntries(
    COMMANDS.map(c => [c.command, c.color])
);

// ── Tela principal ─────────────────────────────────────────────────────────────
export default function HomeScreen() {
    const { loading, error, speed, setSpeed, queue, addToQueue, clearQueue, sendQueue } =
        useEsp32();

    // duração individual por comando (em segundos)
    const [durations, setDurations] = useState<Record<string, number>>(
        Object.fromEntries(COMMANDS.map(c => [c.command, 1]))
    );
    const [showPreview, setShowPreview] = useState(false);

    const changeDuration = (command: string, delta: number) =>
        setDurations(prev => ({
        ...prev,
        [command]: Math.max(1, Math.min(60, (prev[command] ?? 1) + delta)),
        }));

    const handleAdd = (command: string, label: string, hasDuration: boolean) => {
        addToQueue(command, label, hasDuration ? durations[command] : 0);
    };

    return (
        <SafeAreaView style={s.safe}>
        <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled">

            {/* Cabeçalho */}
            <View style={s.header}>
            <View style={s.statusDot} />
            <Text style={s.title}>Robótica Educacional</Text>
            </View>

            {/* Linhas de comandos */}
            {COMMANDS.map(({ command, label, color, hasDuration }) => (
            <View key={command} style={s.row}>
                <TouchableOpacity
                style={[s.cmdBtn, { backgroundColor: color }]}
                onPress={() => handleAdd(command, label, hasDuration)}
                activeOpacity={0.75}
                >
                <Text style={s.cmdBtnText}>{label}</Text>
                </TouchableOpacity>

                {hasDuration && (
                <View style={s.durCtrl}>
                    <TouchableOpacity style={s.durBtn} onPress={() => changeDuration(command, -1)}>
                    <Text style={s.durBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={s.durVal}>{durations[command]}</Text>
                    <TouchableOpacity style={s.durBtn} onPress={() => changeDuration(command, 1)}>
                    <Text style={s.durBtnText}>+</Text>
                    </TouchableOpacity>
                    <Text style={s.durUnit}>s</Text>
                </View>
                )}
            </View>
            ))}

            {/* Slider de velocidade */}
            <View style={s.sliderCard}>
            <Text style={s.sliderLabel}>Velocidade: {speed}</Text>
            <Slider
                style={s.slider}
                minimumValue={0}
                maximumValue={255}
                step={1}
                value={speed}
                onValueChange={setSpeed}
                minimumTrackTintColor="#60A5FA"
                maximumTrackTintColor="#374151"
                thumbTintColor="#60A5FA"
            />
            </View>

            {/* Botões de ação */}
            <View style={s.actionRow}>
            <TouchableOpacity style={[s.actionBtn, { backgroundColor: '#EF4444' }]} onPress={clearQueue}>
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
                style={[s.actionBtn, { backgroundColor: '#22C55E', opacity: (loading || queue.length === 0) ? 0.45 : 1 }]}
                onPress={sendQueue}
                disabled={loading || queue.length === 0}
            >
                <Text style={s.actionText}>{loading ? '...' : 'Enviar'}</Text>
            </TouchableOpacity>
            </View>

            {error ? <Text style={s.error}>{error}</Text> : null}

            {/* Fila de comandos */}
            <View style={s.queueBox}>
            {queue.length === 0 ? (
                <Text style={s.queueEmpty}>Fila vazia — toque num comando acima</Text>
            ) : (
                <View style={s.queueList}>
                {queue.map(item => (
                    <View key={item.id} style={[s.pill, { backgroundColor: CMD_COLORS[item.command] ?? '#6B7280' }]}>
                    <Text style={s.pillText}>{item.label}</Text>
                    {item.duration > 0 && <Text style={s.pillDur}>{item.duration}s</Text>}
                    </View>
                ))}
                </View>
            )}
            </View>

        </ScrollView>

        {/* Modal de prévia */}
        <PreviewModal
            visible={showPreview}
            queue={queue}
            onClose={() => setShowPreview(false)}
        />
        </SafeAreaView>
    );
}

// ── Robô virtual (prévia) ──────────────────────────────────────────────────────
function PreviewModal({
    visible,
    queue,
    onClose,
    }: {
    visible: boolean;
    queue: QueueItem[];
    onClose: () => void;
    }) {
    const [step, setStep] = useState(-1);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Inicia animação quando o modal abre
    useEffect(() => {
        if (!visible) { setStep(-1); return; }
        let idx = 0;

        const advance = (i: number) => {
        if (i >= queue.length) { setStep(queue.length); return; } // fim
        setStep(i);
        const dur = queue[i].duration > 0 ? queue[i].duration * 1000 : 600;
        timerRef.current = setTimeout(() => advance(i + 1), dur);
        };

        // pequeno delay antes de começar
        timerRef.current = setTimeout(() => advance(idx), 300);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [visible]);

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={s.overlay}>
            <View style={s.modalBox}>
            <Text style={s.modalTitle}>Prévia dos Comandos</Text>

            <RobotArena queue={queue} currentStep={step} />

            {/* Pills com highlight */}
            <View style={s.modalQueue}>
                {queue.map((item, i) => (
                <View
                    key={item.id}
                    style={[
                    s.pill,
                    { backgroundColor: CMD_COLORS[item.command] ?? '#6B7280' },
                    i === step ? s.pillActive : s.pillDim,
                    ]}
                >
                    <Text style={s.pillText}>{item.label}</Text>
                    {item.duration > 0 && <Text style={s.pillDur}>{item.duration}s</Text>}
                </View>
                ))}
                {step >= queue.length && step > -1 && (
                <Text style={s.done}>✓ Concluído</Text>
                )}
            </View>

            <TouchableOpacity style={s.closeBtn} onPress={onClose}>
                <Text style={s.closeBtnText}>Fechar</Text>
            </TouchableOpacity>
            </View>
        </View>
        </Modal>
    );
}

// Arena 200×200 com robô top-down
const ARENA = 200;
const R = 26; // tamanho do robô
const STEP_PX = 22; // pixels por segundo de movimento

function RobotArena({ queue, currentStep }: { queue: QueueItem[]; currentStep: number }) {
    // Calcula posição/ângulo até currentStep
    let x = ARENA / 2 - R / 2;
    let y = ARENA / 2 - R / 2;
    let angleDeg = 0;

    for (let i = 0; i <= currentStep && i < queue.length; i++) {
        const { command, duration } = queue[i];
        const d = duration > 0 ? duration : 1;
        if (command === 'frente')   y = Math.max(0, y - STEP_PX * d);
        if (command === 'tras')     y = Math.min(ARENA - R, y + STEP_PX * d);
        if (command === 'direita')  angleDeg += 45 * d;
        if (command === 'esquerda') angleDeg -= 45 * d;
        // 'parar' não muda posição
    }

    const color =
        currentStep >= 0 && currentStep < queue.length
        ? CMD_COLORS[queue[currentStep].command] ?? '#60A5FA'
        : '#60A5FA';

    return (
        <View style={[s.arena, { width: ARENA, height: ARENA }]}>
        <View style={s.gridH} />
        <View style={s.gridV} />
        <View
            style={[
            s.robot,
            { width: R, height: R, left: x, top: y, backgroundColor: color,
                transform: [{ rotate: `${angleDeg}deg` }] },
            ]}
        >
            {/* seta indicando frente */}
            <View style={s.arrow} />
        </View>
        {currentStep >= 0 && currentStep < queue.length && (
            <Text style={s.arenaLabel}>{queue[currentStep].label}</Text>
        )}
        </View>
    );
}

// ── Estilos ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
    safe:       { flex: 1, backgroundColor: '#0F172A' },
    container:  { padding: 18, gap: 10, paddingBottom: 40 },

    header:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    statusDot:  { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4ADE80' },
    title:      { fontSize: 20, fontWeight: '700', color: '#F1F5F9' },

    row:        { flexDirection: 'row', alignItems: 'center', gap: 10 },
    cmdBtn:     { flex: 1, paddingVertical: 13, paddingHorizontal: 14, borderRadius: 14 },
    cmdBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

    durCtrl:    { flexDirection: 'row', alignItems: 'center', gap: 5 },
    durBtn:     { width: 30, height: 30, borderRadius: 15, backgroundColor: '#FF7A00',
                    justifyContent: 'center', alignItems: 'center' },
    durBtnText: { color: '#fff', fontWeight: '800', fontSize: 17, lineHeight: 19 },
    durVal:     { color: '#F1F5F9', fontWeight: '700', fontSize: 15, minWidth: 18, textAlign: 'center' },
    durUnit:    { color: '#94A3B8', fontSize: 13 },

    sliderCard: { backgroundColor: '#1E293B', borderRadius: 14, padding: 14, gap: 4 },
    sliderLabel:{ color: '#CBD5E1', fontSize: 14 },
    slider:     { width: '100%' },

    actionRow:  { flexDirection: 'row', gap: 10 },
    actionBtn:  { flex: 1, paddingVertical: 13, borderRadius: 14, alignItems: 'center' },
    actionText: { color: '#fff', fontWeight: '700', fontSize: 15 },

    error:      { color: '#F87171', fontSize: 13, textAlign: 'center' },

    queueBox:   { backgroundColor: '#1E293B', borderRadius: 14, padding: 14, minHeight: 72 },
    queueEmpty: { color: '#475569', fontSize: 13, textAlign: 'center', marginTop: 8 },
    queueList:  { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },

    pill:       { flexDirection: 'row', alignItems: 'center', gap: 5,
                    paddingHorizontal: 11, paddingVertical: 5, borderRadius: 20 },
    pillText:   { color: '#fff', fontWeight: '600', fontSize: 12 },
    pillDur:    { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '600' },
    pillActive: { transform: [{ scale: 1.1 }] },
    pillDim:    { opacity: 0.4 },

    // Modal
    overlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
    modalBox:   { backgroundColor: '#1E293B', borderRadius: 20, padding: 22, width: '90%',
                    alignItems: 'center', gap: 14 },
    modalTitle: { fontSize: 17, fontWeight: '700', color: '#F1F5F9' },
    modalQueue: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
    done:       { color: '#4ADE80', fontWeight: '700', fontSize: 14, marginTop: 4 },
    closeBtn:   { backgroundColor: '#334155', paddingHorizontal: 28, paddingVertical: 10, borderRadius: 10 },
    closeBtnText:{ color: '#F1F5F9', fontWeight: '600' },

    // Arena do robô
    arena:      { borderRadius: 12, backgroundColor: '#0F172A', overflow: 'hidden', position: 'relative' },
    gridH:      { position: 'absolute', top: '50%', left: 0, right: 0, height: 1, backgroundColor: '#1E293B' },
    gridV:      { position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, backgroundColor: '#1E293B' },
    robot:      { position: 'absolute', borderRadius: 6, justifyContent: 'flex-start',
                    alignItems: 'center', paddingTop: 2 },
    arrow:      { width: 0, height: 0, borderLeftWidth: 5, borderRightWidth: 5, borderBottomWidth: 9,
                    borderLeftColor: 'transparent', borderRightColor: 'transparent',
                    borderBottomColor: 'rgba(255,255,255,0.9)' },
    arenaLabel: { position: 'absolute', bottom: 6, left: 0, right: 0,
                    textAlign: 'center', color: '#475569', fontSize: 10 },
});