import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CommandDef } from '../constants/commands';

type Props = {
    cmd: CommandDef;
    duration: number;
    onAdd: () => void;
    onChangeDuration: (delta: number) => void;
};

export function CommandRow({ cmd, duration, onAdd, onChangeDuration }: Props) {
    return (
        <View style={s.row}>
        <TouchableOpacity
            style={[s.cmdBtn, { backgroundColor: cmd.color }]}
            onPress={onAdd}
            activeOpacity={0.75}
        >
            <Text style={s.cmdText}>{cmd.label}</Text>
        </TouchableOpacity>

        <View style={s.durCtrl}>
            <TouchableOpacity style={s.durBtn} onPress={() => onChangeDuration(-1)}>
            <Text style={s.durBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={s.durVal}>{duration}</Text>
            <TouchableOpacity style={s.durBtn} onPress={() => onChangeDuration(1)}>
            <Text style={s.durBtnText}>+</Text>
            </TouchableOpacity>
            <Text style={s.durUnit}>s</Text>
        </View>
        </View>
    );
}

const s = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    cmdBtn: { flex: 1, paddingVertical: 13, paddingHorizontal: 14, borderRadius: 14 },
    cmdText: { color: '#080808', fontWeight: '700', fontSize: 14 },
    durCtrl: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    durBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#f17c0e', justifyContent: 'center', alignItems: 'center' },
    durBtnText: { color: '#080808', fontWeight: '800', fontSize: 17, lineHeight: 19 },
    durVal: { color: '#080808', fontWeight: '700', fontSize: 15, minWidth: 18, textAlign: 'center' },
    durUnit: { color: '#080808', fontSize: 13 },
});