import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWNe8kGbEJubuKGrw5ev23_AVOCbZ-I3A",
  authDomain: "ai-hospital-b34cb.firebaseapp.com",
  projectId: "ai-hospital-b34cb",
  storageBucket: "ai-hospital-b34cb.firebasestorage.app",
  messagingSenderId: "669166153705",
  appId: "1:669166153705:web:76ae758dc6b2a9a9b86578",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
