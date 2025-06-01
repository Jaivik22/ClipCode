// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOlHbbSmmNS91dGnIVLGlvbnpNpkqS-vg",
  authDomain: "clipcode-a1ccb.firebaseapp.com",
  projectId: "clipcode-a1ccb",
  storageBucket: "clipcode-a1ccb.firebasestorage.app",
  messagingSenderId: "32993325706",
  appId: "1:32993325706:web:402ab91c554c23edb2b373",
  measurementId: "G-0WP60HQN2Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);