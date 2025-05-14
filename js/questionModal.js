import { timeData, players } from "./game.js";
import { questionPool } from "./questionPool.js";

let resolveQuestionModal; // Variable para almacenar la función de resolución de la promesa del modal

/**
 * @description Función para mostrar un modal con una pregunta aleatoria
 * @returns Promesa que se resuelve cuando se cierra el modal se hace de esta manera para poder desacoplar 
 * el modal de la lógica del juego y poder usarlo en cualquier parte del juego
 */

export async function showQuestionModal() {
  const randomIndex = Math.floor(Math.random() * questionPool.length);
  const question = questionPool[randomIndex];

  const questionText = document.getElementById("questionText");
  const questionOptions = document.getElementById("questionOptions");

  questionText.innerText = question.text;
  questionOptions.innerHTML = "";

  question.options.forEach((option, i) => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.style.margin = "5px";
    btn.style.padding = "10px 20px";
    btn.style.fontSize = "16px";
    btn.onclick = () => handleAnswer(i === question.correctIndex);
    questionOptions.appendChild(btn);
  });

  // Mostrar modal
  document.getElementById("questionModal").style.display = "flex";

  // Await until closeQuestionModal is called
  return new Promise((resolve) => {
    resolveQuestionModal = resolve;
  });
}

window.closeQuestionModal = function () {
  document.getElementById("questionModal").style.display = "none";

  // Resolviendo la promesa
  if (typeof resolveQuestionModal === "function") {
    resolveQuestionModal();
    resolveQuestionModal = undefined;
  }
};

function handleAnswer(correct) {
  const questionOptions = document.getElementById("questionOptions");
  questionOptions.innerHTML = ""; // Oculta las opciones

  // Mostrar resultado visual
  const result = document.createElement("div");
  result.innerText = correct
    ? "✅ ¡Respuesta correcta, ganas 5 segundos!"
    : "❌ Respuesta incorrecta, pierdes 5 segundos.";
  result.style.fontSize = "20px";
  result.style.fontWeight = "bold";
  result.style.marginTop = "10px";
  result.style.color = correct ? "green" : "red";
  questionOptions.appendChild(result);

  // Ajustar velocidad y tiempo
  if (correct) {
    players[0].speed += 300;
    setTimeout(() => {
      players[0].speed -= 300;
    }, 5000);

    // ⏱️ Sumar 5 segundos (5000ms)
    timeData.savedTime += 3000;
  } else {
    players[0].speed = Math.max(players[0].speed - 200, 400);

    // ⏱️ Restar 5 segundos (pero no menos de 0)
    timeData.savedTime = Math.max(timeData.savedTime - 3000, 0);
  }

  // Botón para continuar
  const continueBtn = document.createElement("button");
  continueBtn.innerText = "Continuar";
  continueBtn.style.marginTop = "20px";
  continueBtn.style.padding = "10px 20px";
  continueBtn.onclick = () => {
    document.getElementById("questionModal").style.display = "none";

    // Resolviendo la promesa
    if (typeof resolveQuestionModal === "function") {
      resolveQuestionModal();
      resolveQuestionModal = undefined;
    }
  };
  questionOptions.appendChild(continueBtn);
}
