// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBegRGbLJD2hDMYrZk_c3oESGlNIPph5-M",
  authDomain: "uzum-market-clone-d3869.firebaseapp.com",
  projectId: "uzum-market-clone-d3869",
  storageBucket: "uzum-market-clone-d3869.firebasestorage.app",
  messagingSenderId: "1015094276242",
  appId: "1:1015094276242:web:a83f15829e7a2dee8d764b",
  measurementId: "G-J8YP5HD9F9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);