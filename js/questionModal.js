import { timeData, gameData, toggleGameTimer, players } from "./game.js";
import { questionPool } from "./questionPool.js"; 

export function showQuestionModal() {
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

  // Pausar juego
  pauseGameForModal();
};

window.closeQuestionModal = function () {
  document.getElementById("questionModal").style.display = "none";
  // Reanuda el juego
  resumeGameAfterModal();
};

function handleAnswer(correct) {
  const modal = document.getElementById("questionModal");
  modal.style.display = "none";

  if (correct) {
	console.log("Es correcta")
    // Dale más velocidad al jugador
    players[0].speed += 300;
    // setTimeout(() => {
    //   players[0].speed -= 300;
    // }, 5000);
  } else {
	console.log("Es incorrecta")
    // Reduce velocidad un poco o no se modifica
    players[0].speed = Math.max(players[0].speed - 200, 400);
    console.log("❌ Respuesta incorrecta, menos velocidad.");
  }

  resumeGameAfterModal();
}

function pauseGameForModal() {
  TweenMax.pauseAll(true, true);
  gameData.paused = true;

  // Guardar tiempo restante
  if (timeData.enable) {
    timeData.savedTime = timeData.timer;
  }

  toggleGameTimer(false);
}

function resumeGameAfterModal() {
  TweenMax.resumeAll(true, true);
  gameData.paused = false;

  if (typeof timeData.savedTime !== "undefined") {
    timeData.countdown = timeData.savedTime;
    timeData.startDate = new Date();
    timeData.oldTimer = -1;
  }

  toggleGameTimer(true);
}