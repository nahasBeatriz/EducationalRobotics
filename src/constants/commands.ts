export type CommandDef = {
    command: string;
    label: string;
    color: string;
};

export const COMMANDS: CommandDef[] = [
    { command: 'frente', label: 'Para Frente', color: '#22D3EE' },
    { command: 'tras', label: 'Para Trás', color: '#60A5FA' },
    { command: 'direita', label: 'Gira Para Direita', color: '#34D399' },
    { command: 'esquerda', label: 'Gira Para Esquerda', color: '#A78BFA' },
    { command: 'parar', label: 'Parar', color: '#F87171' },
];

export const CMD_COLORS: Record<string, string> = Object.fromEntries(
    COMMANDS.map(c => [c.command, c.color])
);