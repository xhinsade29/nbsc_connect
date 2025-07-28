
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { subscribeToConversations, subscribeToMessages, sendMessageToFirestore, markAsReadInFirestore } from '@/services/messages';

export interface Message {
    id: string;
    text: string;
    timestamp: string;
    sender: 'You' | 'Admin' | string; // 'You' is student, string is department name
}

export interface Conversation {
    id: string;
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
    sendMessage: (convoId: string, text: string, sender: 'Admin' | 'You' | string) => void;
}

const AdminMessagesContext = createContext<AdminMessagesContextType | undefined>(undefined);

export const AdminMessagesProvider = ({ children }: { children: ReactNode }) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);

    useEffect(() => {
        const unsubscribe = subscribeToConversations((newConversations) => {
            setConversations(newConversations as Conversation[]);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (selectedConvo) {
            const unsubscribe = subscribeToMessages(selectedConvo.id, (messages) => {
                setSelectedConvo(prevConvo => prevConvo ? { ...prevConvo, messages: messages as Message[] } : null);
            });
            return () => unsubscribe();
        }
    }, [selectedConvo?.id]);


    const handleSetSelectedConvo = (convo: Conversation | null) => {
        if (convo) {
            markAsReadInFirestore(convo.id, 'admin');
            setSelectedConvo({ ...convo, unread: 0 });
        } else {
            setSelectedConvo(null);
        }
    };


    const handleSendMessage = async (convoId: string, text: string, sender: 'Admin' | string) => {
       await sendMessageToFirestore(convoId, { text, sender });
       // Optimistic update for unread count, Firestore will handle the rest
       const convoRef = doc(db, 'conversations', convoId);
       const currentConvo = conversations.find(c => c.id === convoId);
       if (currentConvo) {
           await updateUnreadCount(convoId, 'admin', currentConvo.unreadStudent + 1);
       }
    };
    
    const value = {
        conversations,
        selectedConvo,
        setSelectedConvo: handleSetSelectedConvo,
        sendMessage: handleSendMessage,
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
