
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AdminNotificationItem {
    uniqueId: string;
    type: 'registration' | 'inquiry';
    title: string;
    description: string;
    date: string;
    read: boolean;
    ctaLink: string;
    ctaText: string;
}

interface AdminNotificationData {
    registrations: AdminNotificationItem[];
    inquiries: AdminNotificationItem[];
}

interface AdminNotificationsContextType {
    notifications: AdminNotificationData;
    markAsRead: (uniqueId: string) => void;
}

const initialAdminNotifications: AdminNotificationData = {
    registrations: [
        {
            uniqueId: 'reg-1',
            type: 'registration',
            title: 'New Student Registration',
            description: 'Jose Rizal has registered an account.',
            date: '1 hour ago',
            read: false,
            ctaLink: '/admin/users',
            ctaText: 'View Users'
        },
    ],
    inquiries: [
        {
            uniqueId: 'inq-1',
            type: 'inquiry',
            title: 'New AI Inquiry',
            description: 'A new student inquiry requires your review.',
            date: '4 hours ago',
            read: false,
            ctaLink: '/admin/inquiries',
            ctaText: 'Review Inquiry'
        },
        {
            uniqueId: 'inq-2',
            type: 'inquiry',
            title: 'New AI Inquiry',
            description: 'A new student inquiry requires your review.',
            date: '2 days ago',
            read: true,
            ctaLink: '/admin/inquiries',
            ctaText: 'Review Inquiry'
        }
    ]
};

const AdminNotificationsContext = createContext<AdminNotificationsContextType | undefined>(undefined);

export const AdminNotificationsProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<AdminNotificationData>(initialAdminNotifications);

    const markAsRead = (uniqueId: string) => {
        setNotifications(prev => ({
            registrations: prev.registrations.map(n => 
                n.uniqueId === uniqueId ? { ...n, read: true } : n
            ),
            inquiries: prev.inquiries.map(n => 
                n.uniqueId === uniqueId ? { ...n, read: true } : n
            ),
        }));
    };

    const value = {
        notifications,
        markAsRead,
    };

    return (
        <AdminNotificationsContext.Provider value={value}>
            {children}
        </AdminNotificationsContext.Provider>
    );
};

export const useAdminNotifications = () => {
    const context = useContext(AdminNotificationsContext);
    if (context === undefined) {
        throw new Error('useAdminNotifications must be used within an AdminNotificationsProvider');
    }
    return context;
};
