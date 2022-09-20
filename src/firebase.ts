import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDjDPJs2iwQZeycvE0vFGS6GNHd_56cM_I',
  authDomain: 'reverseio.firebaseapp.com',
  projectId: 'reverseio',
  storageBucket: 'reverseio.appspot.com',
  messagingSenderId: '835148773451',
  appId: '1:835148773451:web:392bd39856222fee3475ce',
  measurementId: 'G-8GTK3WPKVQ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
export default app;
