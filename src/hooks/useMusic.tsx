import { useState, useCallback } from 'react';
import { MusicStep, NoteName } from '../types';

export const NOTE_FREQUENCIES: Record<NoteName, number> = {
    'Dó': 262,
    'Ré': 294,
    'Mi': 330,
    'Fá': 349,
    'Sol': 392,
    'Lá': 440,
    'Si': 494,
};

export const ALL_NOTES: NoteName[] = ['Dó', 'Ré', 'Mi', 'Fá', 'Sol', 'Lá', 'Si'];

export function useMusic() {
    const [musicQueue, setMusicQueue] = useState<MusicStep[]>([]);

    const addNote = useCallback((note: NoteName, duration: number) => {
        setMusicQueue(prev => [
            ...prev,
            {
                id: `${Date.now()}-${Math.random()}`,
                note,
                duration,
                frequency: NOTE_FREQUENCIES[note],
            },
        ]);
    }, []);

    const removeNote = useCallback((id: string) => {
        setMusicQueue(prev => prev.filter(item => item.id !== id));
    }, []);

    const moveNote = useCallback((id: string, direction: 'up' | 'down') => {
        setMusicQueue(prev => {
            const idx = prev.findIndex(item => item.id === id);
            if (idx === -1) return prev;
            const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
            if (swapIdx < 0 || swapIdx >= prev.length) return prev;
            const next = [...prev];
            [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
            return next;
        });
    }, []);

    const clearMusic = useCallback(() => setMusicQueue([]), []);

    return { musicQueue, addNote, removeNote, moveNote, clearMusic };
}