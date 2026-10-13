import { useState, useCallback } from 'react';
import { sendSequence } from '../services/esp32Api';

export type QueueItem = {
    id: string;
    command: string;
    label: string;
    duration: number; // segundos (0 para "parar")
};

export function useEsp32() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastResponse, setLastResponse] = useState<string | null>(null);
    const [speed, setSpeed] = useState(200);
    const [queue, setQueue] = useState<QueueItem[]>([]);

    const addToQueue = useCallback((command: string, label: string, duration: number) => {
        setQueue(prev => [
        ...prev,
        { id: `${Date.now()}-${Math.random()}`, command, label, duration },
        ]);
    }, []);

    const clearQueue = useCallback(() => setQueue([]), []);

    const sendQueue = useCallback(async () => {
        if (queue.length === 0) return;
        setLoading(true);
        setError(null);
        try {
        const res = await sendSequence(
            queue.map(item => ({ command: item.command, duration: item.duration, speed }))
        );
        setLastResponse(res);
        setQueue([]);
        } catch (e: any) {
        setError(e.message);
        } finally {
        setLoading(false);
        }
    }, [queue, speed]);

    return { loading, error, lastResponse, speed, setSpeed, queue, addToQueue, clearQueue, sendQueue };
}