// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAM3jdJaan9QAHTndVbb2kheXBz2Plr1vE",
  authDomain: "pfpe-7da61.firebaseapp.com",
  projectId: "pfpe-7da61",
  storageBucket: "pfpe-7da61.firebasestorage.app",
  messagingSenderId: "574239393075",
  appId: "1:574239393075:web:7f6ead1ecffbdd8ca76a46",
  measurementId: "G-8753TXL8GS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);