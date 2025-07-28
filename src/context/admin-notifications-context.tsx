
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { onSnapshot, collection, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Inquiry } from '@/services/inquiries';
import { UserData } from '@/services/users';

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

const AdminNotificationsContext = createContext<AdminNotificationsContextType | undefined>(undefined);

export const AdminNotificationsProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<AdminNotificationData>({ registrations: [], inquiries: [] });

    useEffect(() => {
        // Listen for new user registrations
        const usersQuery = query(collection(db, 'users'), where('status', '==', 'Active'), where('notified', '==', false));
        const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
            const newRegistrations: AdminNotificationItem[] = [];
            snapshot.forEach(doc => {
                const user = doc.data() as UserData;
                newRegistrations.push({
                    uniqueId: `reg-${doc.id}`,
                    type: 'registration',
                    title: 'New Student Registration',
                    description: `${user.name} has registered an account.`,
                    date: new Date().toLocaleDateString(),
                    read: false,
                    ctaLink: '/admin/users',
                    ctaText: 'View Users'
                });
            });
            setNotifications(prev => ({ ...prev, registrations: [...prev.registrations, ...newRegistrations] }));
            
            // Mark as notified to prevent re-triggering
            snapshot.forEach(doc => updateDoc(doc.ref, { notified: true }));
        });

        // Listen for new inquiries
        const inquiriesQuery = query(collection(db, 'inquiries'), where('status', '==', 'Pending'), where('notified', '==', false));
        const unsubscribeInquiries = onSnapshot(inquiriesQuery, (snapshot) => {
             const newInquiries: AdminNotificationItem[] = [];
             snapshot.forEach(doc => {
                 newInquiries.push({
                    uniqueId: `inq-${doc.id}`,
                    type: 'inquiry',
                    title: 'New AI Inquiry',
                    description: 'A new student inquiry requires your review.',
                    date: new Date().toLocaleDateString(),
                    read: false,
                    ctaLink: '/admin/inquiries',
                    ctaText: 'Review Inquiry'
                });
             });
             setNotifications(prev => ({ ...prev, inquiries: [...prev.inquiries, ...newInquiries] }));
             snapshot.forEach(doc => updateDoc(doc.ref, { notified: true }));
        });

        return () => {
            unsubscribeUsers();
            unsubscribeInquiries();
        };
    }, []);

    const markAsRead = async (uniqueId: string) => {
       const [type, id] = uniqueId.split('-');
       const collectionName = type === 'reg' ? 'users' : 'inquiries';
       
       // This logic is simplified. In a real app, you might have a dedicated notifications collection.
       // For now, we'll just update the UI state.
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
