
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { subscribeToAnnouncements, Announcement } from '@/services/announcements';

export interface NotificationItem {
    uniqueId: string;
    type: 'announcement' | 'inquiry';
    title: string;
    department: string;
    date: string;
    read: boolean;
    description: string;
}

interface NotificationData {
    announcements: NotificationItem[];
    inquiries: NotificationItem[];
}

interface NotificationsContextType {
    notifications: NotificationData;
    markNotificationAsRead: (uniqueId: string) => void;
}

const initialInquiries: NotificationItem[] = [
    {
        uniqueId: 'inquiry-1',
        type: 'inquiry' as const,
        title: 'Re: Question about enrollment',
        department: 'Registrar\'s Office',
        date: '3 hours ago',
        read: false,
        description: 'Your enrollment for the upcoming semester has been confirmed. You can view your schedule and assessment in the student portal.',
    },
    {
        uniqueId: 'inquiry-2',
        type: 'inquiry'as const,
        title: 'Re: Technical issue with student portal',
        department: 'IT Services',
        date: '2 days ago',
        read: true,
        description: 'The technical issue with the student portal has been resolved. Please clear your browser cache and try logging in again. Let us know if the problem persists.',
    }
];

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<NotificationData>({
        announcements: [],
        inquiries: initialInquiries
    });
    const [readStatuses, setReadStatuses] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const unsubscribe = subscribeToAnnouncements((announcements: Announcement[]) => {
            const announcementNotifications = announcements.map(ann => ({
                uniqueId: `announcement-${ann.id}`,
                type: 'announcement' as const,
                title: ann.title,
                department: ann.department,
                date: ann.date,
                read: readStatuses[`announcement-${ann.id}`] || false,
                description: ann.description,
            }));

            setNotifications(prev => ({
                ...prev,
                announcements: announcementNotifications,
            }));
        });

        return () => unsubscribe();
    }, [readStatuses]);

    const markNotificationAsRead = (uniqueId: string) => {
        setReadStatuses(prev => ({...prev, [uniqueId]: true}));
        
        // This is a more robust way to handle UI updates
        setNotifications(prev => ({
            ...prev,
            announcements: prev.announcements.map(n => 
                n.uniqueId === uniqueId ? { ...n, read: true } : n
            ),
            inquiries: prev.inquiries.map(n =>
                n.uniqueId === uniqueId ? { ...n, read: true } : n
            )
        }));
    };

    const value = {
        notifications,
        markNotificationAsRead,
    };

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationsContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }
    return context;
};
