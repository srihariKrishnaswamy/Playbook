import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "playbook-cfddc.firebaseapp.com",
    projectId: "playbook-cfddc",
    storageBucket: "playbook-cfddc.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: "G-T82YY3NWT4" // Keep this as is unless you want to secure it too
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);