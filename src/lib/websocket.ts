import { writable } from 'svelte/store';

export const ws = writable<WebSocket | null>(null);

export function connectWebsocket() {
    const socket = new WebSocket('ws://localhost:8080/ws');
    socket.binaryType = 'arraybuffer';

    socket.onopen = () => {
        console.log('Global WebSocket connected');
    };

    socket.onerror = (error: Event) => {
        console.error('Global WebSocket error:', error);
    };

    socket.onclose = () => {
        console.log('Global WebSocket closed');
    };

    ws.set(socket);
}