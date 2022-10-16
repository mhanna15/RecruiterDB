import { getAnalytics } from "firebase/analytics";
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyC29zroDc5CpzGsFQLd9vxOi6quVd49hl8',
  authDomain: 'recruiterdb-4d8b4.firebaseapp.com',
  projectId: 'recruiterdb-4d8b4',
  storageBucket: 'recruiterdb-4d8b4.appspot.com',
  messagingSenderId: '800609750464',
  appId: '1:800609750464:web:0f09831795cdef1cf8cc25',
  measurementId: 'G-EHWKNK6V1R',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
export const analytics = getAnalytics(app);
export default app;
