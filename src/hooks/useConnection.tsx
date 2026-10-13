import { useState, useEffect, useRef } from 'react';
import { getStatus } from '../services/esp32Api';

export type ConnectionStatus = 'checking' | 'connected' | 'disconnected';

export function useConnection(): ConnectionStatus {
    const [status, setStatus] = useState<ConnectionStatus>('checking');
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const check = async () => {
        try {
            await getStatus();
            setStatus('connected');
        } catch {
            setStatus('disconnected');
        }
        };

        check();
        intervalRef.current = setInterval(check, 4000);
        return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return status;
}