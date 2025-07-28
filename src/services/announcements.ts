
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';

export interface Announcement {
    id: string; // Firestore document ID
    title: string;
    category: 'Academics' | 'Event' | 'Announcement';
    department: string;
    date: string;
    description: string;
    image: string;
    dataAiHint: string;
}

export interface AnnouncementData {
    title: string;
    category: 'Academics' | 'Event' | 'Announcement';
    department: string;
    date: string;
    description: string;
    image: string;
    dataAiHint: string;
    createdAt?: Timestamp;
}


export const subscribeToAnnouncements = (callback: (announcements: Announcement[]) => void) => {
    const announcementsCollection = collection(db, 'announcements');
    const q = query(announcementsCollection, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (querySnapshot) => {
        const announcements = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
            } as Announcement;
        });
        callback(announcements);
    });
};

export const addAnnouncement = async (announcement: Omit<AnnouncementData, 'createdAt'>) => {
    const announcementsCollection = collection(db, 'announcements');
    await addDoc(announcementsCollection, {
        ...announcement,
        createdAt: serverTimestamp(),
    });
};

export const updateAnnouncement = async (id: string, announcement: Partial<AnnouncementData>) => {
    const announcementDoc = doc(db, 'announcements', id);
    await updateDoc(announcementDoc, announcement);
};

export const deleteAnnouncement = async (id: string) => {
    const announcementDoc = doc(db, 'announcements', id);
    await deleteDoc(announcementDoc);
};
