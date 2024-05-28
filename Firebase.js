import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
console.log(process.env.EXPO_PUBLIC_MAP_API_KEY);
console.log(process.env.process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID);
console.log(process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID);
console.log(process.env.EXPO_PUBLIC_FIREBASE_APP_ID);
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_MAP_API_KEY,
  authDomain: `${process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  databaseURL: `https://${process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID}-default-rtdb.europe-west1.firebasedatabase.app`,
};

const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
