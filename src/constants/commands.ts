export type CommandDef = {
    command: string;
    label: string;
    color: string;
};

export const COMMANDS: CommandDef[] = [
    { command: 'frente', label: 'Para Frente', color: '#179eb3' },
    { command: 'tras', label: 'Para Trás', color: '#3477ca' },
    { command: 'direita', label: 'Gira Para Direita', color: '#16a581' },
    { command: 'esquerda', label: 'Gira Para Esquerda', color: '#b98c2a' },
    { command: 'parar', label: 'Parar', color: '#be2855' },
];

export const CMD_COLORS: Record<string, string> = Object.fromEntries(
    COMMANDS.map(c => [c.command, c.color])
);