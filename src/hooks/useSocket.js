// src/hooks/useSocket.js
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (userId, userType) => {
    const [socket, setSocket] = useState(null);
    const [newInternshipAlert, setNewInternshipAlert] = useState(null);

    useEffect(() => {
        if (!userId) return;

        // الاتصال بـ Socket.io
        const newSocket = io('http://localhost:5000', {
            query: { userId, userType },
            transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
            console.log('✅ Connected to socket server');
        });

        // استقبال إشعارات التدريبات الجديدة
        newSocket.on('new_internship_available', (data) => {
            console.log('📢 New internship available:', data);
            setNewInternshipAlert(data);
        });

        // استقبال إشعارات التدريبات المتطابقة مع المهارات
        newSocket.on('new_internship_matched', (data) => {
            console.log('🎯 New internship matching your skills:', data);
            setNewInternshipAlert(data);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [userId, userType]);

    return { socket, newInternshipAlert, setNewInternshipAlert };
};