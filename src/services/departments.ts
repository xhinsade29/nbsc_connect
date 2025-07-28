
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query, getDocs, writeBatch } from 'firebase/firestore';

export interface Department {
    id: string; // Firestore document ID
    name: string;
    slug: string;
    icon: string; // Icon name as a string
    email: string;
    phone: string;
    description: string;
}

export const subscribeToDepartments = (callback: (departments: Department[]) => void) => {
    const departmentsCollection = collection(db, 'departments');
    const q = query(departmentsCollection);

    return onSnapshot(q, (querySnapshot) => {
        const departments = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        } as Department));
        callback(departments);
    });
};

export const addDepartment = async (department: Omit<Department, 'id'>) => {
    const departmentsCollection = collection(db, 'departments');
    await addDoc(departmentsCollection, department);
};

export const updateDepartment = async (id: string, department: Partial<Omit<Department, 'id'>>) => {
    const departmentDoc = doc(db, 'departments', id);
    await updateDoc(departmentDoc, department);
};

export const deleteDepartment = async (id: string) => {
    const departmentDoc = doc(db, 'departments', id);
    await deleteDoc(departmentDoc);
};


// Seed initial data
const seedDepartments = async () => {
    const departmentsCollection = collection(db, 'departments');
    const snapshot = await getDocs(query(departmentsCollection));
    
    if (snapshot.empty) {
        const initialDepartments: Omit<Department, 'id'>[] = [
          { name: 'Academics Office', slug: 'academics-office', icon: 'BookOpen', email: 'academics@nbsc.edu.ph', phone: '(012) 345-6789', description: 'Handles all academic programs, curriculum, and faculty management.' },
          { name: 'Registrar\'s Office', slug: 'registrars-office', icon: 'FileSignature', email: 'registrar@nbsc.edu.ph', phone: '(012) 345-6780', description: 'Handles student records, registration, and official documents.' },
          { name: 'IT Services', slug: 'it-services', icon: 'Laptop', email: 'itservices@nbsc.edu.ph', phone: '(012) 345-6781', description: 'Provides technical support and manages campus network systems.' },
          { name: 'Student Affairs', slug: 'student-affairs', icon: 'HeartHandshake', email: 'student.affairs@nbsc.edu.ph', phone: '(012) 345-6782', description: 'Oversees student welfare, activities, and development programs.' },
        ];

        const batch = writeBatch(db);
        initialDepartments.forEach(dept => {
            const docRef = doc(departmentsCollection); 
            batch.set(docRef, dept);
        });

        await batch.commit();
        console.log("Seeded initial departments.");
    }
};

// Seed data on initial load
seedDepartments();
