import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { app } from "./firebase.js";

const auth = getAuth(app);

const loginModal = document.getElementById("loginModal");
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");
const userEmailDisplay = document.getElementById("userEmailDisplay");
const authStatusMsg = document.getElementById("authStatusMsg");
export let currentUserId = null;


function showLoginModal() {
  loginModal.style.display = "flex";
}
function hideLoginModal() {
  loginModal.style.display = "none";
}
function showUserEmail(email) {
  userEmailDisplay.textContent = email;
  userEmailDisplay.style.display = "block";
}
function hideUserEmail() {
  userEmailDisplay.style.display = "none";
}
function showStatusMsg(msg, timeout = 4000) {
  authStatusMsg.textContent = msg;
  authStatusMsg.style.display = "block";
  if (timeout) setTimeout(() => { authStatusMsg.style.display = "none"; }, timeout);
}
function hideStatusMsg() {
  authStatusMsg.style.display = "none";
}

// Observe auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserId = user.uid;
    hideLoginModal();
    showUserEmail(user.email || "Logged in");
    showStatusMsg("Logged in", 1200);
  } else {
    hideUserEmail();
    showLoginModal();
  }
});

// Login form handler
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginBtn.disabled = true;
    showStatusMsg("Logging in...");
    try {
      await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);
      // onAuthStateChanged will handle UI
    } catch (err) { 
      showStatusMsg("Login failed: " + (err.message || "Invalid credentials"), 3000);
    }
    loginBtn.disabled = false;
  });
}

// Add logout on userEmailDisplay click
if (userEmailDisplay) {
  userEmailDisplay.addEventListener("click", async () => {
    if (confirm("Do you want to log out?")) {
      try {
        await signOut(auth);
        showStatusMsg("Logged out", 1500);
      } catch (err) {
        showStatusMsg("Logout failed: " + (err.message || "Unknown error"), 3000);
      }
    }
  });
}
