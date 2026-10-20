export type QueueItem = {
    id: string;
    command: string;
    label: string;
    duration: number;
};

export type NoteName = 'Dó' | 'Ré' | 'Mi' | 'Fá' | 'Sol' | 'Lá' | 'Si';

export type MusicStep = {
    id: string;
    note: NoteName;
    duration: number; 
    frequency: number; 
};