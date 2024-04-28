import { initializeApp } from "firebase/app";
import { getAuth, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAQvh5QYlUc_fprW1zbv_sFn7dLhRO4cvI",
  authDomain: "instagram-4d229.firebaseapp.com",
  projectId: "instagram-4d229",
  storageBucket: "instagram-4d229.appspot.com",
  messagingSenderId: "42574548013",
  appId: "1:42574548013:web:5d1af93955e7e2988dfca4",
};


const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const imgdb = getStorage(app);

export { auth, db, imgdb };
export default app;
