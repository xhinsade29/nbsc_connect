
import { db } from '@/lib/firebase';
import { collection, doc, onSnapshot, addDoc, serverTimestamp, query, orderBy, updateDoc, writeBatch, getDocs, where } from 'firebase/firestore';
import type { Conversation, Message } from '@/context/admin-messages-context';

// Note: In a real-world app, you'd have more robust error handling and user authentication checks.

export const subscribeToConversations = (callback: (conversations: Conversation[]) => void) => {
  const conversationsCollection = collection(db, 'conversations');
  const q = query(conversationsCollection, orderBy('timestamp', 'desc'));

  return onSnapshot(q, (querySnapshot) => {
    const conversations = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            timestamp: data.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Just now',
            messages: data.messages || [] // Ensure messages is always an array
        } as unknown as Conversation;
    });
    callback(conversations);
  });
};

export const subscribeToMessages = (conversationId: string, callback: (messages: Message[]) => void) => {
  const messagesCollection = collection(db, `conversations/${conversationId}/messages`);
  const q = query(messagesCollection, orderBy('timestamp', 'asc'));

  return onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        text: data.text,
        sender: data.sender,
        timestamp: data.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || ''
      } as unknown as Message;
    });
    callback(messages);
  });
};


export const sendMessageToFirestore = async (conversationId: string, message: { text: string; sender: string }) => {
    const conversationRef = doc(db, 'conversations', conversationId);
    const messagesCollection = collection(db, `conversations/${conversationId}/messages`);
    
    // Add the new message
    await addDoc(messagesCollection, {
        ...message,
        timestamp: serverTimestamp()
    });

    // Update the parent conversation document
    await updateDoc(conversationRef, {
        lastMessage: message.text,
        timestamp: serverTimestamp(),
    });
};

// This function is for demonstration to update unread counts.
// In a real app, this might be handled by cloud functions or more complex client logic.
export const updateUnreadCount = async (conversationId: string, userType: 'student' | 'admin', count: number) => {
    const conversationRef = doc(db, 'conversations', conversationId);
    if (userType === 'student') {
        await updateDoc(conversationRef, { unread: count });
    } else {
        await updateDoc(conversationRef, { unreadStudent: count });
    }
};

export const markAsReadInFirestore = async (conversationId: string, userType: 'student' | 'admin') => {
    const conversationRef = doc(db, 'conversations', conversationId);
    if (userType === 'student') { // student is viewing, so clear student's unread
        await updateDoc(conversationRef, { unreadStudent: 0 });
    } else { // admin is viewing, so clear admin's unread
        await updateDoc(conversationRef, { unread: 0 });
    }
};

const seedMessages = async () => {
    const conversationsCollection = collection(db, 'conversations');
    const snapshot = await getDocs(query(conversationsCollection));

    if (snapshot.empty) {
        const batch = writeBatch(db);
        const conversationsData = [
            { id: 'academics-office', name: 'Academics Office', slug: 'academics-office', studentName: 'Maria Clara', studentId: 'maria.clara@nbsc.edu.ph', avatar: 'https://placehold.co/100x100.png', dataAiHint: 'building book' },
            { id: 'registrars-office', name: 'Registrar\'s Office', slug: 'registrars-office', studentName: 'Juan Dela Cruz', studentId: 'juan.delacruz@nbsc.edu.ph', avatar: 'https://placehold.co/100x100.png', dataAiHint: 'building file' },
        ];
        
        for (const convoData of conversationsData) {
            const convoRef = doc(conversationsCollection, convoData.id);
            batch.set(convoRef, {
                ...convoData,
                lastMessage: 'Hello, I have a question.',
                timestamp: serverTimestamp(),
                unread: 1,
                unreadStudent: 0,
            });

            const messagesRef = collection(convoRef, 'messages');
            batch.set(doc(messagesRef), {
                sender: 'You',
                text: 'Hello, I have a question.',
                timestamp: serverTimestamp(),
            });
        }

        await batch.commit();
        console.log("Seeded initial conversations and messages.");
    }
};

seedMessages();
