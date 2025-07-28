
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, query, getDocs, writeBatch, serverTimestamp } from 'firebase/firestore';

export interface UserData {
    id: string; // Firestore document ID
    name: string;
    email: string;
    course: string;
    status: 'Active' | 'Inactive';
    notified?: boolean; // To track if admin has been notified
}

// Subscribe to real-time updates of users
export const subscribeToUsers = (callback: (users: UserData[]) => void) => {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection);

    // Seed data on initial load if collection is empty
    seedUsers();

    return onSnapshot(q, (querySnapshot) => {
        const users = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        } as UserData));
        callback(users);
    });
};

// Add a new user
export const addUser = async (user: Omit<UserData, 'id' | 'status'>) => {
    const usersCollection = collection(db, 'users');
    await addDoc(usersCollection, {
        ...user,
        status: 'Active',
        createdAt: serverTimestamp(),
        notified: false, // For new user notification
    });
};

// Update an existing user
export const updateUser = async (id: string, userData: Partial<Omit<UserData, 'id'>>) => {
    const userDoc = doc(db, 'users', id);
    await updateDoc(userDoc, userData);
};


// Seed initial user data
const seedUsers = async () => {
    const usersCollection = collection(db, 'users');
    const snapshot = await getDocs(query(usersCollection));
    
    if (snapshot.empty) {
        const initialUsers: Omit<UserData, 'id'>[] = [
            { name: 'Juan Dela Cruz', email: 'juan.delacruz@nbsc.edu.ph', course: 'BS in Information Technology', status: 'Active', notified: true },
            { name: 'Maria Clara', email: 'maria.clara@nbsc.edu.ph', course: 'BS in Business Administration', status: 'Active', notified: true },
            { name: 'Jose Rizal', email: 'jose.rizal@nbsc.edu.ph', course: 'BS in Education', status: 'Inactive', notified: true },
        ];

        const batch = writeBatch(db);
        initialUsers.forEach(user => {
            const docRef = doc(usersCollection); 
            batch.set(docRef, user);
        });

        await batch.commit();
        console.log("Seeded initial users.");
    }
};
