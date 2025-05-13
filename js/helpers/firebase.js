// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAD6tkYtcVJqBIirwSMePmGiM6TNHu8MZ0",
  authDomain: "game-calamar.firebaseapp.com",
  projectId: "game-calamar",
  storageBucket: "game-calamar.firebasestorage.app",
  messagingSenderId: "557519792859",
  appId: "1:557519792859:web:15a46af616dc4642d0fafe",
  measurementId: "G-N07Q2MH81P",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
