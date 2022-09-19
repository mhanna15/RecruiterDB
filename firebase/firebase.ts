// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDjDPJs2iwQZeycvE0vFGS6GNHd_56cM_I",
    authDomain: "reverseio.firebaseapp.com",
    projectId: "reverseio",
    storageBucket: "reverseio.appspot.com",
    messagingSenderId: "835148773451",
    appId: "1:835148773451:web:392bd39856222fee3475ce",
    measurementId: "G-8GTK3WPKVQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
