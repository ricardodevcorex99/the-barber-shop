import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyAze6d99BTVCZrKTLzZU7k2VDBQvCOVbRI",
  authDomain: "barber-shop-7b7a1.firebaseapp.com",
  projectId: "barber-shop-7b7a1",
  storageBucket: "barber-shop-7b7a1.firebasestorage.app",
  messagingSenderId: "1012462347255",
  appId: "1:1012462347255:web:8943921ae053b120ff04f2",
  measurementId: "G-F5NVKXM1KB"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
