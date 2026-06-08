import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBV42EXk91PpBKkctkYBq7_tNHgfEafFbY",
  authDomain: "seobaro.firebaseapp.com",
  projectId: "seobaro",
  storageBucket: "seobaro.firebasestorage.app",
  messagingSenderId: "114998410855",
  appId: "1:114998410855:web:58443e6d68bbbef1f9dec2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
