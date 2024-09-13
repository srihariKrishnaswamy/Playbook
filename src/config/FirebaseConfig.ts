import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
    apiKey: "AIzaSyBPUvD0eCIlYc30fjFOA1x9AOPhlKUfxwk",
    authDomain: "playbook-cfddc.firebaseapp.com",
    projectId: "playbook-cfddc",
    storageBucket: "playbook-cfddc.appspot.com",
    messagingSenderId: "275280662442",
    appId: "1:275280662442:web:a62419e6bdb05a599d65d3",
    measurementId: "G-T82YY3NWT4"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);