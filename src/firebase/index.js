import { initializeApp } from "firebase/app"; // V9
import {
  getAuth,
  createUserWithEmailAndPassword, // BUILT-IN SIGNUP
  signInWithEmailAndPassword, // BUILT-IN LOGIN
} from "firebase/auth"; // V9

import {
  serverTimestamp,
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  setDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBHNstpI3Fgqbvt3cnocc1uWV2sqaivcgA",
  authDomain: "blood-donation-11050.firebaseapp.com",
  projectId: "blood-donation-11050",
  storageBucket: "blood-donation-11050.appspot.com",
  messagingSenderId: "628916368063",
  appId: "1:628916368063:web:51f7ce4027bdc87e794c0a",
  measurementId: "G-PQ42XXV9Q2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// init auth

const auth = getAuth(app);
const db = getFirestore();

export default app;

export {
  db,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  setDoc,
};
