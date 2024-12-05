import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAeOZz64mvx6aY1FsIIPpKcDLsMwQC2fnU",
  authDomain: "test-vocacional-cess-b2498.firebaseapp.com",
  projectId: "test-vocacional-cess-b2498",
  storageBucket: "test-vocacional-cess-b2498.firebasestorage.app",
  messagingSenderId: "503294377445",
  appId: "1:503294377445:web:db8e78d3aa395b1bbdc30c",
  measurementId: "G-ZEPG88Z5TL"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };