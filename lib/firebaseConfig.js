import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// config của m
const firebaseConfig = {
  apiKey: "AIzaSyCd8baaOzjML-nCR1lr24y3CqTmXB8VzzI",
  authDomain: "shopacc-1308d.firebaseapp.com",
  projectId: "shopacc-1308d",
  storageBucket: "shopacc-1308d.firebasestorage.app",
  messagingSenderId: "70860405252",
  appId: "1:70860405252:web:4dc7fa9cb315cfd61f5351"
};

// 👉 fix lỗi Next.js init nhiều lần
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;