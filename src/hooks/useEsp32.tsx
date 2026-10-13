import { useState, useCallback } from 'react';
import { sendSequence } from '../services/esp32Api';
import { QueueItem } from '../types';

export function useEsp32() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastResponse, setLastResponse] = useState<string | null>(null);
    const [speedPct, setSpeedPct] = useState(78); // ~200/255
    const [queue, setQueue] = useState<QueueItem[]>([]);

    const addToQueue = useCallback((command: string, label: string, duration: number) => {
        setQueue(prev => [
        ...prev,
        { id: `${Date.now()}-${Math.random()}`, command, label, duration },
        ]);
    }, []);

    const removeItem = useCallback((id: string) => {
        setQueue(prev => prev.filter(item => item.id !== id));
    }, []);

    const moveItem = useCallback((id: string, direction: 'up' | 'down') => {
        setQueue(prev => {
        const idx = prev.findIndex(item => item.id === id);
        if (idx === -1) return prev;
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= prev.length) return prev;
        const next = [...prev];
        [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
        return next;
        });
    }, []);

    const clearQueue = useCallback(() => setQueue([]), []);

    const sendQueue = useCallback(async () => {
        if (queue.length === 0) return;
        setLoading(true);
        setError(null);
        const speed255 = Math.round(speedPct * 2.55);
        try {
        const res = await sendSequence(
            queue.map(item => ({ command: item.command, duration: item.duration, speed: speed255 }))
        );
        setLastResponse(res);
        setQueue([]);
        } catch (e: any) {
        setError(e.message);
        } finally {
        setLoading(false);
        }
    }, [queue, speedPct]);

    return {
        loading, error, lastResponse,
        speedPct, setSpeedPct,
        queue, addToQueue, removeItem, moveItem, clearQueue, sendQueue,
    };
}