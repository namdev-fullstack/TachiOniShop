// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "shopacc-1308d.firebaseapp.com",
  projectId: "shopacc-1308d",
  storageBucket: "shopacc-1308d.firebasestorage.app",
  messagingSenderId: "70860405252",
  appId: "1:70860405252:web:4dc7fa9cb315cfd61f5351"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

