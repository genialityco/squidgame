import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { app } from "./firebase.js";
import { currentUserId } from "./auth.js";


const db = getFirestore(app);

export async function saveUserMetrics({ round, correctQuestionIds }) {
  if (!currentUserId) {
    console.warn("❌ Usuario no autenticado. No se guardan métricas.");
    return;
  }

  try {
    await addDoc(collection(db, "metrics"), {
      userId: currentUserId,
      round,
      correctQuestionIds,
      timestamp: new Date().toISOString(),
    });
    console.log("✅ Métricas guardadas en Firestore.");
  } catch (error) {
    console.error("❌ Error al guardar métricas:", error);
  }
}

export async function saveAttempt({ round, correctQuestionIds, passed }) {
  if (!currentUserId) {
    console.warn("Usuario no autenticado");
    return;
  }

  const attemptsRef = collection(db, "attempts");

  // Buscar cuántos intentos previos tiene este user en este round
  const q = query(
    attemptsRef,
    where("userId", "==", currentUserId),
    where("round", "==", round)
  );

  const snapshot = await getDocs(q);
  const attemptNumber = snapshot.size + 1;
  
  await addDoc(attemptsRef, {
    userId: currentUserId,
    round,
    attempt: attemptNumber,
    correctQuestionIds,
    result: passed ? "pass" : "fail",
    timestamp: new Date().toISOString(),
  });

  console.log(`✅ Intento ${attemptNumber} guardado para ronda ${round}`);
}

export async function saveSingleAttempt({ round, questionId, correct }) {
  if (!currentUserId) return;

  const attemptsRef = collection(db, "attempts");

  const q = query(
    attemptsRef,
    where("userId", "==", currentUserId),
    where("round", "==", round),
    where("questionId", "==", questionId)
  );

  const snapshot = await getDocs(q);
  const attemptNumber = snapshot.size + 1;

  await addDoc(attemptsRef, {
    userId: currentUserId,
    round,
    questionId,
    correct,
    attempt: attemptNumber,
    timestamp: new Date().toISOString(),
  });

  console.log(`✅ Intento ${attemptNumber} guardado para ronda ${round}`);
}

export async function hasReachedAttemptLimit(round, limit = 100) {
  if (!currentUserId) return true; // Bloquea si no está autenticado

  const attemptsRef = collection(db, "attempts");
  const q = query(
    attemptsRef,
    where("userId", "==", currentUserId),
    where("round", "==", round)
  );

  const snapshot = await getDocs(q);
  console.log(snapshot);
  return snapshot.size >= limit;
}
