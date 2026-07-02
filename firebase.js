// Firebase v10 (Module)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDudHZ479v5Rs3IYsu1bII7X3jmU3y4s9c",
    authDomain: "mayuraonline.firebaseapp.com",
    projectId: "mayuraonline",
    storageBucket: "mayuraonline.firebasestorage.app",
    messagingSenderId: "318115105826",
    appId: "1:318115105826:web:baf53afdcc1137303e8e7b",
    measurementId: "G-13MC4Y0ZM6"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
