
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Conversation as AdminConversation } from './admin-messages-context';
import { subscribeToConversations, subscribeToMessages, sendMessageToFirestore, markAsReadInFirestore, updateUnreadCount } from '@/services/messages';

interface Message {
    id: string;
    text: string;
    timestamp: string;
    sender: 'You' | string;
}

// Use the more detailed conversation type from admin context
interface Conversation extends AdminConversation {
    id: string; // Firestore IDs are strings
    messages: Message[];
}

interface MessagesContextType {
    conversations: Conversation[];
    selectedConvo: Conversation | null;
    setSelectedConvo: (convo: Conversation | null) => void;
    sendMessage: (convoId: string, text: string) => void;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export const MessagesProvider = ({ children }: { children: ReactNode }) => {
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
                
                // Update the main conversations list as well
                setConversations(prevConvos => prevConvos.map(c => 
                    c.id === selectedConvo.id ? { ...c, messages: messages as Message[] } : c
                ));
            });

            return () => unsubscribe();
        }
    }, [selectedConvo?.id]);


    const handleSetSelectedConvo = (convo: Conversation | null) => {
        if (convo) {
            markAsReadInFirestore(convo.id, 'student');
            const updatedConvo = { ...convo, unreadStudent: 0 };
            setSelectedConvo(updatedConvo);
            setConversations(prev => prev.map(c => c.id === convo.id ? updatedConvo : c));

        } else {
            setSelectedConvo(null);
        }
    }

    const handleSendMessage = async (convoId: string, text: string) => {
        await sendMessageToFirestore(convoId, { text, sender: 'You' });
        const currentConvo = conversations.find(c => c.id === convoId);
        if (currentConvo) {
            await updateUnreadCount(convoId, 'admin', currentConvo.unread + 1);
        }
    };
    
    const value = {
        conversations,
        selectedConvo,
        setSelectedConvo: handleSetSelectedConvo,
        sendMessage: handleSendMessage,
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
