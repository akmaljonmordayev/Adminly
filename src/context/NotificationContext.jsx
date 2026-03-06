import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
        const saved = localStorage.getItem('notifications_enabled');
        return saved !== null ? JSON.parse(saved) : true;
    });
    const [isEmailEnabled, setIsEmailEnabled] = useState(() => {
        const saved = localStorage.getItem('emails_enabled');
        return saved !== null ? JSON.parse(saved) : false;
    });

    const user = JSON.parse(localStorage.getItem('user'));

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const res = await axios.get('http://localhost:5000/notifications');
            // Filter notifications for this specific user or general ones
            const myNotifications = res.data.filter(n => n.userId === user.id || n.userId === 'all');
            setNotifications(myNotifications.reverse());
        } catch (err) {
            console.error('Fetch notifications error:', err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [user?.id]);

    const playNotificationSound = () => {
        if (isSoundEnabled) {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play().catch(e => console.log('Audio play failed:', e));
        }
    };

    const addNotification = async (title, message, type = 'info') => {
        if (!user) return;
        const newNotif = {
            userId: user.id,
            title,
            message,
            type,
            date: new Date().toISOString(),
            read: false
        };

        try {
            const res = await axios.post('http://localhost:5000/notifications', newNotif);
            setNotifications(prev => [res.data, ...prev]);
            playNotificationSound();
        } catch (err) {
            console.error('Add notification error:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            // In a real API we might have a bulk update. 
            // With json-server, we might have to delete each or update each.
            // User said "hammasi ochib ketishi kere" (all should disappear), so let's delete them.
            for (const notif of notifications) {
                await axios.delete(`http://localhost:5000/notifications/${notif.id}`);
            }
            setNotifications([]);
        } catch (err) {
            console.error('Mark all as read error:', err);
        }
    };

    const toggleSound = (val) => {
        setIsSoundEnabled(val);
        localStorage.setItem('notifications_enabled', JSON.stringify(val));
    };

    const toggleEmail = (val) => {
        setIsEmailEnabled(val);
        localStorage.setItem('emails_enabled', JSON.stringify(val));
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            addNotification,
            markAllAsRead,
            isSoundEnabled,
            toggleSound,
            isEmailEnabled,
            toggleEmail,
            playNotificationSound
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
