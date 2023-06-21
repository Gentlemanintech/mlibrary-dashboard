import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBWOo06K6HCdWh9LnDhFVo8xPxo7gsmxEI",
  authDomain: "recommendation-app-7dfe8.firebaseapp.com",
  projectId: "recommendation-app-7dfe8",
  storageBucket: "recommendation-app-7dfe8.appspot.com",
  messagingSenderId: "607757676938",
  appId: "1:607757676938:web:580d9ec3055220926b9873",
  measurementId: "G-DRSFFW1JH1"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app)