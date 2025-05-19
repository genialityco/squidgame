import { timeData, players } from "./game.js";
import { saveSingleAttempt } from "./helpers/metrics.js";
import { currentUserId } from "../js/helpers/auth.js";
import { questionPool } from "./questionPool.js";
import { gameSettings } from "./gameSettings.js";

let resolveQuestionModal;
let currentQuestion = null;

/**
 * Obtiene el nivel desde la URL (?chooseGame=3)
 */
function getLevelFromURL() {
  const params = new URLSearchParams(window.location.search);
  const level = parseInt(params.get("chooseGame"), 10);
  return isNaN(level) ? null : level;
}

/**
 * Muestra un modal con una pregunta aleatoria del pool (filtrado por nivel si existe).
 * @returns {Promise<void>} Promesa que se resuelve al cerrar el modal
 */
export async function showQuestionModal() {
  const level = getLevelFromURL();

  // Filtra por nivel si existe
  let pool = questionPool;
  if (level) {
    const filtered = questionPool.filter((q) => q.level === level);
    if (filtered.length > 0) {
      pool = filtered;
    } else {
      console.warn(
        `No hay preguntas para el nivel ${level}, usando pool completo.`
      );
    }
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  currentQuestion = pool[randomIndex];

  const questionText = document.getElementById("questionText");
  const questionOptions = document.getElementById("questionOptions");

  questionText.innerText = currentQuestion.text;
  questionOptions.innerHTML = "";

  currentQuestion.options.forEach((option, i) => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.style.margin = "5px";
    btn.style.padding = "10px 20px";
    btn.style.fontSize = "16px";
    btn.style.cursor = "pointer";
    btn.dataset.index = i;
    btn.onclick = () => handleAnswer(i);
    questionOptions.appendChild(btn);
  });

  document.getElementById("questionModal").style.display = "flex";

  return new Promise((resolve) => {
    resolveQuestionModal = resolve;
  });
}

window.closeQuestionModal = function () {
  document.getElementById("questionModal").style.display = "none";
  if (typeof resolveQuestionModal === "function") {
    resolveQuestionModal();
    resolveQuestionModal = undefined;
  }
};

function handleAnswer(selectedIndex) {
  const correctIndex = currentQuestion.correctIndex;
  const isCorrect = selectedIndex === correctIndex;
  const questionOptions = document.getElementById("questionOptions");
  const buttons = questionOptions.querySelectorAll("button");

  // Resaltar botones
  buttons.forEach((btn) => {
    const i = parseInt(btn.dataset.index);
    btn.disabled = true;

    if (i === correctIndex) {
      btn.style.backgroundColor = "#2ecc71";
      btn.style.color = "white";
      btn.style.fontWeight = "bold";
    }

    if (i === selectedIndex && selectedIndex !== correctIndex) {
      btn.style.backgroundColor = "#e74c3c";
      btn.style.color = "white";
    }

    if (i !== correctIndex && i !== selectedIndex) {
      btn.style.opacity = "0.5";
    }
  });

  // Mostrar mensaje
  const result = document.createElement("div");
  result.style.fontSize = "20px";
  result.style.fontWeight = "bold";
  result.style.marginTop = "10px";
  result.style.whiteSpace = "pre-wrap";
  result.style.color = isCorrect ? "green" : "red";

  result.innerText = isCorrect
    ? "✅ ¡Respuesta correcta, ganas 3 segundos!"
    : "❌ Respuesta incorrecta, pierdes 3 segundos.";

  questionOptions.appendChild(result);

  // Ajuste velocidad y tiempo
  if (isCorrect) {
    players[0].speed += 300;
    setTimeout(() => {
      players[0].speed -= 300;
    }, 5000);
    timeData.savedTime += 3000;
  } else {
    players[0].speed = Math.max(players[0].speed - 200, 400);
    timeData.savedTime = Math.max(timeData.savedTime - 3000, 0);
  }

  // Guardar intento individual con métrica
  const level = getLevelFromURL();
  if (level && currentQuestion?.id) {
    saveSingleAttempt({
      round: level,
      questionId: currentQuestion.id,
      correct: isCorrect,
    });
  }

  // Ajustar el timer de la ronda
  const gameKey = "game" + level;
  if (gameSettings[gameKey]) {
    const baseTimer = gameSettings[gameKey].timer;
    gameSettings[gameKey].adjustedTimer = baseTimer + timeData.savedTime;
    console.log(`[Timer ajustado] ${gameKey}: ${gameSettings[gameKey].adjustedTimer} ms`);
  }

  // Botón continuar
  const continueBtn = document.createElement("button");
  continueBtn.innerText = "Continuar";
  continueBtn.style.marginTop = "20px";
  continueBtn.style.padding = "10px 20px";
  continueBtn.style.cursor = "pointer";
  continueBtn.onclick = () => {
    document.getElementById("questionModal").style.display = "none";
    if (typeof resolveQuestionModal === "function") {
      resolveQuestionModal();
      resolveQuestionModal = undefined;
    }
  };
  questionOptions.appendChild(continueBtn);
}

