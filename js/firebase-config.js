/**
 * NOVACREST HOMES LIMITED — Firebase & Firestore Database Configuration
 * Project ID: novacrest-site
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase App Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDPvMGixisE8HnUm2lP4ZtGmWOCYAQO_y4",
  authDomain: "novacrest-site.firebaseapp.com",
  projectId: "novacrest-site",
  storageBucket: "novacrest-site.firebasestorage.app",
  messagingSenderId: "799871648953",
  appId: "1:799871648953:web:9298c0a554dc49bd38c768",
  measurementId: "G-WK0BJV8XZH"
};

// Initialize Firebase & Firestore
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log('[Firestore] Connected successfully to Google Cloud Firestore (novacrest-site)');
} catch (err) {
  console.error('[Firestore Connection Error]', err);
}

export { 
  app, 
  db, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
};
