
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Message {
    id: number;
    text: string;
    timestamp: string;
    sender: 'You' | 'Admin' | string; // 'You' is student, string is department name
}

export interface Conversation {
    id: number;
    slug: string;
    name: string; // Department Name
    studentName: string;
    studentId: string;
    avatar: string;
    dataAiHint: string;
    messages: Message[];
    lastMessage: string;
    timestamp: string;
    unread: number; // Unread for admin
    unreadStudent: number; // Unread for student
}

interface AdminMessagesContextType {
    conversations: Conversation[];
    selectedConvo: Conversation | null;
    setSelectedConvo: (convo: Conversation | null) => void;
    sendMessage: (convoId: number, text: string, sender: 'Admin' | 'You' | string) => void;
}

const SHARED_STORAGE_KEY = 'nbsc-connect-conversations';

const initialConversations: Conversation[] = [
    {
        id: 1,
        slug: 'registrars-office',
        name: 'Registrar\'s Office',
        studentName: 'Maria Clara',
        studentId: 'maria.clara@nbsc.edu.ph',
        avatar: 'https://placehold.co/100x100.png',
        dataAiHint: 'office building',
        messages: [
             { id: 1, text: 'Hi, I would like to request for my transcript of records.', timestamp: '10:25 AM', sender: 'You' },
             { id: 2, text: 'Your documents are ready for pickup.', timestamp: '10:30 AM', sender: 'Registrar\'s Office' },
        ],
        lastMessage: 'Your documents are ready for pickup.',
        timestamp: '10:30 AM',
        unread: 0,
        unreadStudent: 0,
    },
    {
        id: 2,
        slug: 'it-services',
        name: 'IT Services',
        studentName: 'Juan Dela Cruz',
        studentId: 'juan.delacruz@nbsc.edu.ph',
        avatar: 'https://placehold.co/100x100.png',
        dataAiHint: 'server gear',
        messages: [
            { id: 1, text: 'We have resolved the issue with your portal access. Please try logging in again.', timestamp: '9:15 AM', sender: 'IT Services' },
            { id: 2, text: 'Thank you, it\'s working now!', timestamp: '9:18 AM', sender: 'You' },
        ],
        lastMessage: 'Thank you, it\'s working now!',
        timestamp: 'Yesterday',
        unread: 1,
        unreadStudent: 0,
    },
    {
        id: 3,
        slug: 'academics-office',
        name: 'Academics Office',
        studentName: 'Student Name',
        studentId: 'student@nbsc.edu.ph',
        avatar: 'https://placehold.co/100x100.png',
        dataAiHint: 'books graduation',
        messages: [],
        lastMessage: 'No messages yet',
        timestamp: '',
        unread: 0,
        unreadStudent: 0,
    },
     {
        id: 4,
        slug: 'student-affairs',
        name: 'Student Affairs',
        studentName: 'Student Name',
        studentId: 'student@nbsc.edu.ph',
        avatar: 'https://placehold.co/100x100.png',
        dataAiHint: 'students community',
        messages: [],
        lastMessage: 'No messages yet',
        timestamp: '',
        unread: 0,
        unreadStudent: 0,
    },
];

const AdminMessagesContext = createContext<AdminMessagesContextType | undefined>(undefined);

const getInitialState = () => {
    if (typeof window !== 'undefined') {
        const storedConversations = localStorage.getItem(SHARED_STORAGE_KEY);
        if (storedConversations) {
            try {
                const parsed = JSON.parse(storedConversations);
                // Basic validation
                if (Array.isArray(parsed) && parsed.length > 0 && 'studentId' in parsed[0]) {
                    return parsed;
                }
            } catch (e) {
                console.error("Failed to parse conversations from localStorage", e);
            }
        }
        localStorage.setItem(SHARED_STORAGE_KEY, JSON.stringify(initialConversations));
    }
    return initialConversations;
};


export const AdminMessagesProvider = ({ children }: { children: ReactNode }) => {
    const [conversations, setConversations] = useState<Conversation[]>(getInitialState);
    const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);

     useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === SHARED_STORAGE_KEY && e.newValue) {
                try {
                    const newConversations = JSON.parse(e.newValue);
                     setConversations(newConversations);
                } catch(e) {
                    console.error("Error parsing storage update", e);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const currentData = JSON.stringify(conversations);
            if (localStorage.getItem(SHARED_STORAGE_KEY) !== currentData) {
                localStorage.setItem(SHARED_STORAGE_KEY, currentData);
            }
        }
    }, [conversations]);

    const handleSetSelectedConvo = (convo: Conversation | null) => {
        if (convo) {
            const updatedConversations = conversations.map(c => {
                if (c.id === convo.id) {
                    return { ...c, unread: 0 };
                }
                return c;
            });
            setConversations(updatedConversations);
            setSelectedConvo({ ...convo, unread: 0 });
        } else {
            setSelectedConvo(null);
        }
    };


    const sendMessage = (convoId: number, text: string, sender: 'Admin' | 'You' | string) => {
        const updatedConversations = conversations.map(convo => {
            if (convo.id === convoId) {
                const newMessages = [...convo.messages, {
                    id: convo.messages.length + 1,
                    text: text,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    sender: sender,
                }];
                const updatedConvo = { 
                    ...convo, 
                    messages: newMessages, 
                    lastMessage: text,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    // If admin sends, increment student unread count
                    unreadStudent: sender === 'Admin' || sender === convo.name ? convo.unreadStudent + 1 : convo.unreadStudent,
                    // If student sends, increment admin unread count
                    unread: sender === 'You' ? convo.unread + 1 : convo.unread,
                };
                
                if (selectedConvo?.id === convoId) {
                    // if admin is viewing, keep unread at 0 for them
                    updatedConvo.unread = 0;
                    setSelectedConvo(updatedConvo);
                }

                return updatedConvo;
            }
            return convo;
        });
        setConversations(updatedConversations);
    };
    
    const value = {
        conversations,
        selectedConvo,
        setSelectedConvo: handleSetSelectedConvo,
        sendMessage,
    };

    return (
        <AdminMessagesContext.Provider value={value}>
            {children}
        </AdminMessagesContext.Provider>
    );
}

export const useAdminMessages = () => {
    const context = useContext(AdminMessagesContext);
    if (context === undefined) {
        throw new Error('useAdminMessages must be used within a AdminMessagesProvider');
    }
    return context;
};
