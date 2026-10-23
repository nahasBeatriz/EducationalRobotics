import { ImageSourcePropType } from 'react-native';

export type CommandDef = {
    command: string;
    label: string;
    color: string;
    image: ImageSourcePropType;
};

export const CMD_COLORS: Record<string, string> = {
    frente:   '#4CAF50',
    tras:     '#F44336',
    esquerda: '#2196F3',
    direita:  '#FF9800',
    parar:    '#9C27B0',
};

export const COMMANDS: CommandDef[] = [
    { command: 'frente', label: 'Frente', color: CMD_COLORS.frente, image: require('../assets/foward.png') },
    { command: 'tras', label: 'Trás', color: CMD_COLORS.tras, image: require('../assets/backward.png') },
    { command: 'esquerda', label: 'Esquerda', color: CMD_COLORS.esquerda, image: require('../assets/left.png') },
    { command: 'direita', label: 'Direita', color: CMD_COLORS.direita, image: require('../assets/right.png') },
    { command: 'parar', label: 'Parar', color: CMD_COLORS.parar, image: require('../assets/stop.png') },
];