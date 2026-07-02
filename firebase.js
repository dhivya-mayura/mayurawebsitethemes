// =====================================
// Firebase Setup - Mayura Online
// =====================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
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

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

isSupported().then((supported) => {
    if (supported) getAnalytics(app);
});

window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseStorage = storage;
