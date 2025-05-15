import { timeData, players } from "./game.js";
import { questionPool } from "./questionPool.js";

let resolveQuestionModal;
let currentQuestion = null;

/**
 * Muestra un modal con una pregunta aleatoria del pool.
 * @returns {Promise<void>} Promesa que se resuelve al cerrar el modal
 */
export async function showQuestionModal() {
  const randomIndex = Math.floor(Math.random() * questionPool.length);
  currentQuestion = questionPool[randomIndex];

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

  // Resaltar botones según la respuesta
  buttons.forEach((btn) => {
    const i = parseInt(btn.dataset.index);
    btn.disabled = true;

    if (i === correctIndex) {
      btn.style.backgroundColor = "#2ecc71"; // Verde
      btn.style.color = "white";
      btn.style.fontWeight = "bold";
    }

    if (i === selectedIndex && selectedIndex !== correctIndex) {
      btn.style.backgroundColor = "#e74c3c"; // Rojo
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

  if (isCorrect) {
    result.innerText = "✅ ¡Respuesta correcta, ganas 5 segundos!";
  } else {
    result.innerHTML = `❌ Respuesta incorrecta, pierdes 5 segundos.`;
  }

  questionOptions.appendChild(result);

  // Ajustar velocidad y tiempo
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
