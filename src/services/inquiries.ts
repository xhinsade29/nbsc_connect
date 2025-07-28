
'use client';

import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc, setDoc, query, orderBy } from 'firebase/firestore';

export type InquiryStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Inquiry {
    id: string; // Firestore document ID
    query: string;
    recommended: string;
    confidence: number;
    status: InquiryStatus;
    createdAt: any;
}

export const subscribeToInquiries = (callback: (inquiries: Inquiry[]) => void) => {
    const inquiriesCollection = collection(db, 'inquiries');
    const q = query(inquiriesCollection, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (querySnapshot) => {
        const inquiries = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Inquiry));
        callback(inquiries);
    });
};

export const updateInquiryStatus = async (id: string, status: InquiryStatus) => {
    const inquiryDoc = doc(db, 'inquiries', id);
    await updateDoc(inquiryDoc, { status });
};

export const reassignInquiry = async (id: string, department: string) => {
    const inquiryDoc = doc(db, 'inquiries', id);
    await updateDoc(inquiryDoc, {
        recommended: department,
        status: 'Approved'
    });
};

// Helper to seed initial data if the collection is empty
export const seedInquiries = async () => {
    const inquiriesCollection = collection(db, 'inquiries');
    const initialInquiries: Omit<Inquiry, 'id'>[] = [
        { query: "I forgot my password, how do I reset it?", recommended: "IT Services", confidence: 0.95, status: 'Pending', createdAt: new Date('2024-07-20T10:00:00Z') },
        { query: "What are the requirements for shifting courses?", recommended: "Academics Office", confidence: 0.88, status: 'Approved', createdAt: new Date('2024-07-19T15:30:00Z') },
        { query: "Is there a penalty for late enrollment?", recommended: "Registrar's Office", confidence: 0.92, status: 'Rejected', createdAt: new Date('2024-07-19T11:00:00Z') },
        { query: "How can I apply for a scholarship?", recommended: "Student Affairs", confidence: 0.85, status: 'Pending', createdAt: new Date('2024-07-20T12:00:00Z') },
    ];

    for (const inquiry of initialInquiries) {
        // Use a consistent ID based on the query for seeding
        const slug = inquiry.query.toLowerCase().replace(/\s+/g, '-').slice(0, 20);
        const inquiryDoc = doc(db, 'inquiries', slug);
        // Using setDoc to ensure we don't create duplicates on multiple runs
        await setDoc(inquiryDoc, inquiry);
    }
};
