
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Message {
    id: number;
    text: string;
    timestamp: string;
    sender: 'You' | string;
}

interface Conversation {
    id: number;
    slug: string;
    name: string;
    avatar: string;
    dataAiHint: string;
    messages: Message[];
    lastMessage: string;
    timestamp: string;
    unread: number;
}

interface MessagesContextType {
    conversations: Conversation[];
    selectedConvo: Conversation | null;
    setSelectedConvo: (convo: Conversation | null) => void;
    sendMessage: (convoId: number, text: string) => void;
}

const initialConversations: Conversation[] = [
    {
        id: 1,
        slug: 'registrars-office',
        name: 'Registrar\'s Office',
        avatar: 'https://placehold.co/100x100.png',
        dataAiHint: 'office building',
        messages: [
             { id: 1, text: 'Your documents are ready for pickup.', timestamp: '10:30 AM', sender: 'Registrar\'s Office' },
        ],
        lastMessage: 'Your documents are ready for pickup.',
        timestamp: '10:30 AM',
        unread: 0,
    },
    {
        id: 2,
        slug: 'it-services',
        name: 'IT Services',
        avatar: 'https://placehold.co/100x100.png',
        dataAiHint: 'server gear',
        messages: [
            { id: 1, text: 'We have resolved the issue with your portal access. Please try logging in again.', timestamp: '9:15 AM', sender: 'IT Services' },
            { id: 2, text: 'Thank you, it\'s working now!', timestamp: '9:18 AM', sender: 'You' },
        ],
        lastMessage: 'We have resolved the issue with your portal access.',
        timestamp: 'Yesterday',
        unread: 2,
    },
     {
        id: 3,
        slug: 'academics-office',
        name: 'Academics Office',
        avatar: 'https://placehold.co/100x100.png',
        dataAiHint: 'books graduation',
        messages: [],
        lastMessage: 'No messages yet',
        timestamp: '',
        unread: 0,
    },
     {
        id: 4,
        slug: 'student-affairs',
        name: 'Student Affairs',
        avatar: 'https://placehold.co/100x100.png',
        dataAiHint: 'students community',
        messages: [],
        lastMessage: 'No messages yet',
        timestamp: '',
        unread: 0,
    },
];

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

const getInitialState = () => {
    if (typeof window !== 'undefined') {
        const storedConversations = localStorage.getItem('conversations');
        if (storedConversations) {
            return JSON.parse(storedConversations);
        }
    }
    return initialConversations;
};


export const MessagesProvider = ({ children }: { children: ReactNode }) => {
    const [conversations, setConversations] = useState<Conversation[]>(getInitialState);
    const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('conversations', JSON.stringify(conversations));
        }
    }, [conversations]);

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
