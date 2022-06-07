import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmkO_nkAFqo-YMdPYHSKID8kkLEFLcPsY",
  authDomain: "magazine-cc0c0.firebaseapp.com",
  projectId: "magazine-cc0c0",
  storageBucket: "magazine-cc0c0.appspot.com",
  messagingSenderId: "914391807048",
  appId: "1:914391807048:web:a4b04cde5d0b478196547d",
  measurementId: "G-X74QKD9KYF",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
