/**
 * NOVACREST HOMES LIMITED — Resilient Firebase & Firestore Loader
 * Guarantees zero application crash even if CDN is blocked or offline
 */

export const firebaseConfig = {
  apiKey: "AIzaSyDPvMGixisE8HnUm2lP4ZtGmWOCYAQO_y4",
  authDomain: "novacrest-site.firebaseapp.com",
  projectId: "novacrest-site",
  storageBucket: "novacrest-site.firebasestorage.app",
  messagingSenderId: "799871648953",
  appId: "1:799871648953:web:9298c0a554dc49bd38c768",
  measurementId: "G-WK0BJV8XZH"
};

let dbInstance = null;
let firestoreLib = null;

export async function getFirestoreDb() {
  if (dbInstance) return dbInstance;
  try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js");
    firestoreLib = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    
    const app = initializeApp(firebaseConfig);
    dbInstance = firestoreLib.getFirestore(app);
    return dbInstance;
  } catch (err) {
    console.warn('[Firestore] CDN unavailable or offline; using local storage engine.', err);
    return null;
  }
}

export async function saveFirestoreDocument(collectionName, docId, data) {
  try {
    const db = await getFirestoreDb();
    if (db && firestoreLib) {
      await firestoreLib.setDoc(firestoreLib.doc(db, collectionName, docId), data, { merge: true });
      return true;
    }
  } catch (e) {
    console.warn(`[Firestore Save Error in ${collectionName}]`, e);
  }
  return false;
}

export async function fetchFirestoreCollection(collectionName) {
  try {
    const db = await getFirestoreDb();
    if (db && firestoreLib) {
      const snap = await firestoreLib.getDocs(firestoreLib.collection(db, collectionName));
      const items = [];
      snap.forEach(d => items.push(d.data()));
      return items;
    }
  } catch (e) {
    console.warn(`[Firestore Fetch Error in ${collectionName}]`, e);
  }
  return null;
}

export async function deleteFirestoreDocument(collectionName, docId) {
  try {
    const db = await getFirestoreDb();
    if (db && firestoreLib) {
      await firestoreLib.deleteDoc(firestoreLib.doc(db, collectionName, docId));
      return true;
    }
  } catch (e) {
    console.warn(`[Firestore Delete Error in ${collectionName}]`, e);
  }
  return false;
}
