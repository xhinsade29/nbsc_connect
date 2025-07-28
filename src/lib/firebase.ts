
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: "nbsc-connect",
  appId: "1:543490466374:web:e6383a0cd24964e36b6047",
  storageBucket: "nbsc-connect.appspot.com",
  apiKey: "AIzaSyBNGdNcZkiVLHaRbI2Nb6Qb3T2JTXZXNCs",
  authDomain: "nbsc-connect.firebaseapp.com",
  messagingSenderId: "543490466374"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
