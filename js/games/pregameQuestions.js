import { questionPool } from "../questionPool.js";
import { timeData, gameData, toggleGameTimer } from "../game.js";
import { gameSettings } from "../gameSettings.js";

let questionIndex = 0;
let correctAnswers = 0;
let onComplete = null;
let selectedQuestions = [];
const QUESTIONS_PER_GAME = 4;

function getLevelFromURL() {
  const params = new URLSearchParams(window.location.search);
  const level = parseInt(params.get("chooseGame"), 10);
  return isNaN(level) ? null : level;
}

function getRandomQuestions(pool, count) {
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function showPreGameQuestions(callback) {
  questionIndex = 0;
  correctAnswers = 0;
  onComplete = callback;

  console.log("Mostrando preguntas");

  const level = getLevelFromURL();
  let pool = questionPool;

  if (level) {
    pool = questionPool.filter((q) => q.level === level);
    if (pool.length < QUESTIONS_PER_GAME) {
      console.warn(
        `No hay suficientes preguntas para el nivel ${level}. Se tomarán aleatorias.`
      );
      pool = questionPool;
    }
  }

  selectedQuestions = getRandomQuestions(pool, QUESTIONS_PER_GAME);

  pauseGameForQuestions();
  renderQuestion();
}

function renderQuestion() {
  const questionModal = document.getElementById("questionModal");
  const questionText = document.getElementById("questionText");
  const questionOptions = document.getElementById("questionOptions");

  if (questionIndex >= selectedQuestions.length) {
    const adjustment =
      (correctAnswers * 5 - (selectedQuestions.length - correctAnswers) * 5) *
      1000;
    timeData.countdown = Math.max(timeData.countdown + adjustment, 0);
    const level = getLevelFromURL();
    if (level) {
      const gameKey = "game" + level;
      if (gameSettings[gameKey]) {
        const baseTimer = gameSettings[gameKey].timer;
        gameSettings[gameKey].adjustedTimer = baseTimer + adjustment;
        console.log(
          `[Timer ajustado] ${gameKey}: ${gameSettings[gameKey].adjustedTimer} ms`
        );
      }
    }

    resumeGameAfterQuestions();
    if (typeof onComplete === "function") onComplete(correctAnswers);
    return;
  }

  const question = selectedQuestions[questionIndex];
  questionText.innerText = question.text;
  questionOptions.innerHTML = "";

  question.options.forEach((option, i) => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.style.margin = "5px";
    btn.style.padding = "10px 20px";
    btn.style.fontSize = "16px";
    btn.style.cursor = "pointer";
    btn.dataset.index = i;
    btn.onclick = () =>
      handleAnswer(i, question.correctIndex, question.options);
    questionOptions.appendChild(btn);
  });

  questionModal.style.display = "flex";
}

function handleAnswer(selectedIndex, correctIndex, options) {
  const questionOptions = document.getElementById("questionOptions");
  const buttons = questionOptions.querySelectorAll("button");

  buttons.forEach((btn, i) => {
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

  const isCorrect = selectedIndex === correctIndex;

  const result = document.createElement("div");
  result.style.fontSize = "20px";
  result.style.fontWeight = "bold";
  result.style.marginTop = "10px";
  result.style.whiteSpace = "pre-wrap";
  result.style.color = isCorrect ? "green" : "red";

  if (isCorrect) {
    result.innerText = "✅ ¡Correcto!";
    correctAnswers++;
  } else {
    result.innerHTML = `❌ Incorrecto.`;
  }

  questionOptions.appendChild(result);

  const continueBtn = document.createElement("button");
  continueBtn.innerText = "Siguiente";
  continueBtn.style.marginTop = "20px";
  continueBtn.style.padding = "10px 20px";
  continueBtn.style.cursor = "pointer";
  continueBtn.onclick = () => {
    questionIndex++;
    renderQuestion();
  };
  questionOptions.appendChild(continueBtn);
}

export function pauseGameForQuestions() {
  toggleGameTimer(false);
  gameData.paused = true;
}

function resumeGameAfterQuestions() {
  document.getElementById("questionModal").style.display = "none";
  toggleGameTimer(true);
  gameData.paused = false;
}
