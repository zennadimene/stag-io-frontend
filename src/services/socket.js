// src/services/socket.js
import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = (userId, userType) => {
    if (!userId || !userType) {
        console.log('⚠️ Cannot initialize socket: missing userId or userType');
        return null;
    }

    if (socket && socket.connected) {
        console.log('🔌 Socket already connected');
        return socket;
    }

    socket = io('http://localhost:5000', {
        query: { userId, userType },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });

    socket.on('connect', () => {
        console.log(`✅ Socket connected for ${userType} ID: ${userId}`);
    });

    socket.on('disconnect', () => {
        console.log('🔌 Socket disconnected');
    });

    socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
    });

    return socket;
};

export const getSocket = () => {
    if (!socket || !socket.connected) {
        console.log('⚠️ Socket not connected');
        return null;
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
        console.log('🔌 Socket disconnected manually');
    }
};

export const subscribeToNotifications = (callback) => {
    if (!socket) {
        console.log('⚠️ Cannot subscribe: socket not initialized');
        return;
    }
    socket.on('new-notification', callback);
    socket.on('admin-notification', callback);
};

export const unsubscribeFromNotifications = () => {
    if (!socket) return;
    socket.off('new-notification');
    socket.off('admin-notification');
};