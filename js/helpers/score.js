import { getFirestore, doc, setDoc, getDoc, onSnapshot, increment } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import { app } from "./firebase.js";

const db = getFirestore(app);
const auth = getAuth(app);

const scoreDisplay = document.getElementById("scoreDisplay");
let unsubscribeScore = null;

function renderScore(score) {
  if (scoreDisplay) {
    scoreDisplay.textContent = "Score: " + (score ?? 0);
    scoreDisplay.style.display = "block";
  }
}

export async function updateScore(points) {
  const user = auth.currentUser;
  if (!user) return;
  const playerRef = doc(db, "players", user.uid);
  await setDoc(playerRef, { email: user.email, nombre: user.email, score: increment(points) }, { merge: true });
}

export async function updateLevel(level) {
    const user = auth.currentUser;
    if (!user) return;
    const playerRef = doc(db, "players", user.uid);
    await setDoc(playerRef, { level: level}, { merge: true });
  }

export async function getCurrentUserLevel() {
  const user = auth.currentUser;
  console.log("docSnap");
  return 0;
  
  if (!user) return 0;
  const playerRef = doc(db, "players", user.uid);
  const docSnap = await getDoc(playerRef);
  console.log("docSnap2" );
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.level ?? 0;
  }
  return 0;
}

// Listen for auth changes and subscribe to score updates
onAuthStateChanged(auth, (user) => {
  if (unsubscribeScore) {
    unsubscribeScore();
    unsubscribeScore = null;
  }
  if (user) {
    const playerRef = doc(db, "players", user.uid);
    unsubscribeScore = onSnapshot(playerRef, (docSnap) => {
      const data = docSnap.exists() ? docSnap.data() : {};
      renderScore(data.score || 0);
    });
  } else {
    renderScore(null);
  }
});

// Add test button to bottom left
(function addTestButton() {
  const btn = document.createElement("button");
  btn.textContent = "test";
  btn.style.position = "fixed";
  btn.style.left = "10px";
  btn.style.bottom = "10px";
  btn.style.zIndex = 12000;
  btn.style.padding = "8px 16px";
  btn.style.borderRadius = "8px";
  btn.style.background = "#28a745";
  btn.style.color = "#fff";
  btn.style.border = "none";
  btn.style.fontWeight = "bold";
  btn.style.cursor = "pointer";
  btn.onclick = () => updateScore(10);
  document.body.appendChild(btn);
})();
