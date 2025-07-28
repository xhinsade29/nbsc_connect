
import { db, storage } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export interface Announcement {
    id: string; // Firestore document ID
    title: string;
    category: 'Academics' | 'Event' | 'Announcement';
    department: string;
    date: string;
    description: string;
    image: string; // URL to the image
    imagePath?: string; // Path in Firebase Storage
    dataAiHint: string;
}

export interface AnnouncementData {
    title: string;
    category: 'Academics' | 'Event' | 'Announcement';
    department: string;
    date: string;
    description: string;
    image: string;
    imagePath?: string;
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

export const uploadAnnouncementImage = async (file: File): Promise<{ url: string, path: string }> => {
    const filePath = `announcements/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { url, path: filePath };
};


export const addAnnouncement = async (announcement: Omit<AnnouncementData, 'createdAt' | 'imagePath'>, imageFile?: File) => {
    let imageData = { image: 'https://placehold.co/600x400.png', imagePath: '', dataAiHint: 'school event' };
    if (imageFile) {
        const { url, path } = await uploadAnnouncementImage(imageFile);
        imageData = { image: url, imagePath: path, dataAiHint: 'school event' };
    }

    const announcementsCollection = collection(db, 'announcements');
    await addDoc(announcementsCollection, {
        ...announcement,
        ...imageData,
        createdAt: serverTimestamp(),
    });
};

export const updateAnnouncement = async (id: string, announcement: Partial<AnnouncementData>, imageFile?: File, oldImagePath?: string) => {
    const announcementDoc = doc(db, 'announcements', id);
    let updatedData: Partial<AnnouncementData> = { ...announcement };

    if (imageFile) {
        if (oldImagePath) {
            const oldImageRef = ref(storage, oldImagePath);
            try {
                await deleteObject(oldImageRef);
            } catch (error) {
                console.error("Error deleting old image:", error);
            }
        }
        const { url, path } = await uploadAnnouncementImage(imageFile);
        updatedData.image = url;
        updatedData.imagePath = path;
    }
    
    await updateDoc(announcementDoc, updatedData);
};

export const deleteAnnouncement = async (id: string, imagePath?: string) => {
    const announcementDoc = doc(db, 'announcements', id);
    await deleteDoc(announcementDoc);

    if (imagePath) {
        const imageRef = ref(storage, imagePath);
        try {
            await deleteObject(imageRef);
        } catch (error) {
            console.error("Error deleting image from storage:", error);
        }
    }
};
