import { ImageSourcePropType } from 'react-native';

export type CommandDef = {
    command: string;
    label: string;
    color: string;
    image: ImageSourcePropType;
};

export const CMD_COLORS: Record<string, string> = {
    frente: '#179eb3',
    tras: '#3477ca',
    esquerda: '#16a581',
    direita: '#b98c2a',
    parar: '#be2855',
    led_verde: '#2bb132',   
    led_azul: '#2197ce',   
    led_vermelho: '#d34d4d',
};

export const COMMANDS: CommandDef[] = [
    { command: 'frente', label: 'Frente', color: CMD_COLORS.frente, image: require('../assets/foward.png') },
    { command: 'tras', label: 'Trás', color: CMD_COLORS.tras, image: require('../assets/backward.png') },
    { command: 'esquerda', label: 'Esquerda', color: CMD_COLORS.esquerda, image: require('../assets/left.png') },
    { command: 'direita', label: 'Direita', color: CMD_COLORS.direita, image: require('../assets/right.png') },
    { command: 'parar', label: 'Parar', color: CMD_COLORS.parar, image: require('../assets/stop.png') },
];