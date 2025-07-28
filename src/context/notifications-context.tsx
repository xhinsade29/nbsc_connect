
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface NotificationItem {
    id: number;
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

const initialNotificationsData: NotificationData = {
    announcements: [
        {
            id: 1,
            uniqueId: 'announcement-1',
            type: 'announcement' as const,
            title: 'New Grade Policy',
            department: 'Academics Office',
            date: '2 hours ago',
            read: false,
            description: 'A new grading policy has been implemented for the current semester. All students are advised to review the updated guidelines in the student handbook available on the portal.',
        },
        {
            id: 2,
            uniqueId: 'announcement-2',
            type: 'announcement' as const,
            title: 'Campus-wide WiFi Upgrade',
            department: 'IT Services',
            date: '1 day ago',
            read: true,
            description: 'The campus WiFi network will be undergoing a scheduled upgrade on October 30th from 2 AM to 5 AM. Expect intermittent connectivity during this period.',
        }
    ],
    inquiries: [
        {
            id: 1,
            uniqueId: 'inquiry-1',
            type: 'inquiry' as const,
            title: 'Re: Question about enrollment',
            department: 'Registrar\'s Office',
            date: '3 hours ago',
            read: false,
            description: 'Your enrollment for the upcoming semester has been confirmed. You can view your schedule and assessment in the student portal.',
        },
        {
            id: 2,
            uniqueId: 'inquiry-2',
            type: 'inquiry'as const,
            title: 'Re: Technical issue with student portal',
            department: 'IT Services',
            date: '2 days ago',
            read: true,
            description: 'The technical issue with the student portal has been resolved. Please clear your browser cache and try logging in again. Let us know if the problem persists.',
        }
    ]
};

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<NotificationData>(initialNotificationsData);

    const markNotificationAsRead = (uniqueId: string) => {
        setNotifications(prev => {
            const updatedAnnouncements = prev.announcements.map(n =>
                n.uniqueId === uniqueId ? { ...n, read: true } : n
            );
            const updatedInquiries = prev.inquiries.map(n =>
                n.uniqueId === uniqueId ? { ...n, read: true } : n
            );
            return {
                announcements: updatedAnnouncements,
                inquiries: updatedInquiries
            };
        });
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
