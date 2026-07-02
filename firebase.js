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

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

let analytics = null;
isSupported().then((supported) => {
    if (supported) {
        analytics = getAnalytics(app);
    }
});

// Make Firebase available to normal non-module scripts.
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseStorage = storage;
window.firebaseAnalytics = analytics;

window.dispatchEvent(new Event("firebase-ready"));
