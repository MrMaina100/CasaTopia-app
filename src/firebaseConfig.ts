// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "casatopia-f7098.firebaseapp.com",
  projectId: "casatopia-f7098",
  storageBucket: "casatopia-f7098.appspot.com",
  messagingSenderId: "190180946146",
  appId: "1:190180946146:web:24c41cfe0e32620a862ebb",
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Export the Firestore database
export const db = getFirestore();
