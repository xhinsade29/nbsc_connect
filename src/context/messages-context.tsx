
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Conversation as AdminConversation } from './admin-messages-context';

interface Message {
    id: number;
    text: string;
    timestamp: string;
    sender: 'You' | string;
}

// Use the more detailed conversation type from admin context
interface Conversation extends AdminConversation {}

interface MessagesContextType {
    conversations: Conversation[];
    selectedConvo: Conversation | null;
    setSelectedConvo: (convo: Conversation | null) => void;
    sendMessage: (convoId: number, text: string) => void;
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

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

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
            } catch(e) {
                console.error("Failed to parse conversations from localStorage", e);
            }
        }
        localStorage.setItem(SHARED_STORAGE_KEY, JSON.stringify(initialConversations));
    }
    return initialConversations;
};


export const MessagesProvider = ({ children }: { children: ReactNode }) => {
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
                    return { ...c, unreadStudent: 0 };
                }
                return c;
            });
            setConversations(updatedConversations);
            setSelectedConvo({ ...convo, unreadStudent: 0 });
        } else {
            setSelectedConvo(null);
        }
    }

    const sendMessage = (convoId: number, text: string) => {
        const updatedConversations = conversations.map(convo => {
            if (convo.id === convoId) {
                const newMessages = [...convo.messages, {
                    id: convo.messages.length + 1,
                    text: text,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    sender: 'You',
                }];
                const updatedConvo = { 
                    ...convo, 
                    messages: newMessages, 
                    lastMessage: text,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    unread: convo.unread + 1, // When student sends, increment admin unread
                };
                
                if (selectedConvo?.id === convoId) {
                    updatedConvo.unreadStudent = 0; // if student is viewing, keep their unread at 0
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
        <MessagesContext.Provider value={value}>
            {children}
        </MessagesContext.Provider>
    );
}

export const useMessages = () => {
    const context = useContext(MessagesContext);
    if (context === undefined) {
        throw new Error('useMessages must be used within a MessagesProvider');
    }
    return context;
};
