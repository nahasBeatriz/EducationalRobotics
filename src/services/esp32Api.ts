const ESP32_BASE_URL = 'http://192.168.4.1';

export type MotorCommand = 'frente' | 'tras' | 'esquerda' | 'direita' | 'parar';
export type Command = MotorCommand | string;

export type SequenceStep = {
    command: string;
    duration: number; // segundos
    speed: number;
};

export async function sendCommand(command: Command, speed?: number): Promise<string> {
    const speedParam = speed !== undefined ? `&speed=${speed}` : '';
    const response = await fetch(`${ESP32_BASE_URL}/cmd?action=${command}${speedParam}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
    return response.text();
    }

export async function sendSequence(steps: SequenceStep[]): Promise<string> {
    const response = await fetch(`${ESP32_BASE_URL}/sequence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ steps }),
    });
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
    return response.text();
    }

export async function getStatus(): Promise<Record<string, unknown>> {
    const response = await fetch(`${ESP32_BASE_URL}/status`);
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
    return response.json();
    }