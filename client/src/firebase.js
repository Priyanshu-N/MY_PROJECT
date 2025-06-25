// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-32c00.firebaseapp.com",
  projectId: "mern-estate-32c00",
  storageBucket: "mern-estate-32c00.firebasestorage.app",
  messagingSenderId: "574585392404",
  appId: "1:574585392404:web:819051608f8eca777a8601"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;