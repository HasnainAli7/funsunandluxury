// /firebase/firebase.ts
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC0mi_HY3OTmM1ZoWrTD4lad-aGIvq21ZI",
  authDomain: "funsunandluxury-6bb32.firebaseapp.com",
  projectId: "funsunandluxury-6bb32",
  storageBucket: "funsunandluxury-6bb32.appspot.com",
  messagingSenderId: "301820234190",
  appId: "1:301820234190:web:49574d3fcd2f6dbe49839f",
  measurementId: "G-S93G6QH0LX"
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);

export { db };