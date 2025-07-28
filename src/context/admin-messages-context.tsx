
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Message {
    id: number;
    text: string;
    timestamp: string;
    sender: 'You' | 'Admin' | string;
}

interface Conversation {
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
    unread: number;
}

interface AdminMessagesContextType {
    conversations: Conversation[];
    selectedConvo: Conversation | null;
    setSelectedConvo: (convo: Conversation | null) => void;
    sendMessage: (convoId: number, text: string, sender: 'Admin' | 'You') => void;
}

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
    },
];

const AdminMessagesContext = createContext<AdminMessagesContextType | undefined>(undefined);

const getInitialState = () => {
    if (typeof window !== 'undefined') {
        const storedConversations = localStorage.getItem('admin-conversations');
        if (storedConversations) {
            return JSON.parse(storedConversations);
        }
    }
    return initialConversations;
};


export const AdminMessagesProvider = ({ children }: { children: ReactNode }) => {
    const [conversations, setConversations] = useState<Conversation[]>(getInitialState);
    const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('admin-conversations', JSON.stringify(conversations));
        }
    }, [conversations]);

    const sendMessage = (convoId: number, text: string, sender: 'Admin' | 'You') => {
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
                };
                
                if (selectedConvo?.id === convoId) {
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
        setSelectedConvo,
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
