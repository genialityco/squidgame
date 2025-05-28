// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSDCBoO53_QqeIBFF_GSUyR81nUS27jHU",
  authDomain: "calamar2.firebaseapp.com",
  projectId: "calamar2",
  storageBucket: "calamar2.firebasestorage.app",
  messagingSenderId: "259797119644",
  appId: "1:259797119644:web:cb85fd9ebc542b90923359",
  measurementId: "G-ZP7H276P1V",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
