import { timeData, gameData, toggleGameTimer, roundData } from "./game.js";
import { questionPool } from "./questionPool.js";

let currentQuestionIndex = 0;
let questionsToAsk = [];
let correctAnswers = 0;

function getLevelFromURL() {
  const params = new URLSearchParams(window.location.search);
  const level = parseInt(params.get("chooseGame"), 10);
  return isNaN(level) ? null : level;
}

export function showCandyQuestionSequence(total = 3) {

  let pool = questionPool;
  if (gameData.roundNum) {
    const filtered = questionPool.filter((q) => q.level === gameData.roundNum);
    if (filtered.length >= total) {
      pool = filtered;
    } else {
      console.warn(
        `No hay suficientes preguntas para el nivel ${level}. Usando pool completo.`
      );
    }
  }

  questionsToAsk = shuffleArray([...pool]).slice(0, total);
  currentQuestionIndex = 0;
  correctAnswers = 0;

  document.getElementById("questionModal").style.display = "flex";
  pauseGameForModal();
  showCurrentQuestion();
}

function showCurrentQuestion() {
  const question = questionsToAsk[currentQuestionIndex];
  const questionText = document.getElementById("questionText");
  const questionOptions = document.getElementById("questionOptions");

  questionText.innerText = `Pregunta ${currentQuestionIndex + 1}:\n${
    question.text
  }`;
  questionOptions.innerHTML = "";

  question.options.forEach((option, i) => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.style.margin = "5px";
    btn.style.padding = "10px 20px";
    btn.style.fontSize = "16px";
    btn.style.cursor = "pointer";
    btn.onclick = () =>
      handleAnswer(i, question.correctIndex, question.options);
    questionOptions.appendChild(btn);
  });
}

function handleAnswer(selectedIndex, correctIndex, options) {
  const questionOptions = document.getElementById("questionOptions");
  questionOptions.innerHTML = "";

  const isCorrect = selectedIndex === correctIndex;

  const result = document.createElement("div");
  result.innerText = isCorrect
    ? "✅ ¡Correcto!"
    : "❌ Respuesta incorrecta, pierdes 3 segundos.";

  result.style.fontSize = "20px";
  result.style.fontWeight = "bold";
  result.style.marginTop = "10px";
  result.style.color = isCorrect ? "green" : "red";
  result.style.whiteSpace = "pre-wrap";
  questionOptions.appendChild(result);

  if (isCorrect) correctAnswers++;

  const nextBtn = document.createElement("button");
  nextBtn.innerText =
    currentQuestionIndex < questionsToAsk.length - 1
      ? "Siguiente"
      : "Finalizar";
  nextBtn.style.marginTop = "20px";
  nextBtn.style.padding = "10px 20px";
  nextBtn.style.cursor = "pointer";
  nextBtn.onclick = () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questionsToAsk.length) {
      showCurrentQuestion();
    } else {
      finishSequence();
    }
  };
  questionOptions.appendChild(nextBtn);
}

function finishSequence() {
  document.getElementById("questionModal").style.display = "none";

  const secondsDelta =
    (correctAnswers - (questionsToAsk.length - correctAnswers)) * 3000;
  timeData.savedTime = Math.max(timeData.savedTime + secondsDelta, 0);
  
  // Guardar el timer ajustado para esta ronda (ej: game2 para Candy Game)
  const level = getLevelFromURL();
  if (level) {
    const gameKey = "game" + level;
    if (gameSettings[gameKey]) {
      const baseTimer = gameSettings[gameKey].timer;
      gameSettings[gameKey].adjustedTimer = baseTimer + timeData.savedTime;
      console.log(
        `[Timer ajustado] ${gameKey}: ${gameSettings[gameKey].adjustedTimer} ms`
      );
    }
  }

  resumeGameAfterModal();
}

function pauseGameForModal() {
  TweenMax.pauseAll(true, true);
  gameData.paused = true;

  if (timeData.enable) {
    timeData.savedTime = timeData.timer;
  }

  toggleGameTimer(false);
  TweenMax.pauseTweensOf(roundData.lightData.timeTween);
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
  TweenMax.resumeTweensOf(roundData.lightData.timeTween);
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}
