import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { QueueItem } from '../types';
import { CMD_COLORS } from '../constants/commands';

const ARENA = 200;
const R = 26;
const STEP_PX = 20;

type Props = {
    queue: QueueItem[];
    currentStep: number;
};

export function RobotArena({ queue, currentStep }: Props) {
    let x = ARENA / 2 - R / 2;
    let y = ARENA / 2 - R / 2;
    let angleDeg = 0;

    for (let i = 0; i <= currentStep && i < queue.length; i++) {
        const { command, duration } = queue[i];
        const d = Math.max(duration, 1);
        if (command === 'frente') y = Math.max(0, y - STEP_PX * d);
        if (command === 'tras') y = Math.min(ARENA - R, y + STEP_PX * d);
        if (command === 'direita') angleDeg += 45 * d;
        if (command === 'esquerda') angleDeg -= 45 * d;
        // 'parar' não altera posição
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
            {
                width: R, height: R,
                left: x, top: y,
                backgroundColor: color,
                transform: [{ rotate: `${angleDeg}deg` }],
            },
            ]}
        >
            {/* Seta indicando frente */}
            <View style={s.arrow} />
        </View>
        {currentStep >= 0 && currentStep < queue.length && (
            <Text style={s.arenaLabel}>{queue[currentStep].label}</Text>
        )}
        </View>
    );
}

const s = StyleSheet.create({
    arena: { borderRadius: 12, backgroundColor: '#800080', overflow: 'hidden', position: 'relative' },
    gridH: { position: 'absolute', top: '50%', left: 0, right: 0, height: 1, backgroundColor: '#A90072' },
    gridV: { position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, backgroundColor: '#A90072' },
    robot: { position: 'absolute', borderRadius: 6, justifyContent: 'flex-start',
            alignItems: 'center', paddingTop: 2 },
    arrow: { width: 0, height: 0,
            borderLeftWidth: 5, borderRightWidth: 5, borderBottomWidth: 9,
            borderLeftColor: 'transparent', borderRightColor: 'transparent',
            borderBottomColor: 'rgba(255,255,255,0.9)' },
    arenaLabel: { position: 'absolute', bottom: 6, left: 0, right: 0,
            textAlign: 'center', color: '#ffffff', fontSize: 10 },
});