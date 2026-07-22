import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjJ6GPj-uyb8mwRVT1pGHlj3H-8D6d9594",
  authDomain: "family-dental-clinic-ff549.firebaseapp.com",
  projectId: "family-dental-clinic-ff549",
  storageBucket: "family-dental-clinic-ff549.firebasestorage.app",
  messagingSenderId: "575082439710",
  appId: "1:575082439710:web:60ef3ded175c00bcc33a0f",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;