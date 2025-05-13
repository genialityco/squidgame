import { questionPool } from "../questionPool.js";
import { timeData, gameData, toggleGameTimer } from "./game.js";

let questionIndex = 0;
let correctAnswers = 0;
let onComplete = null;

export function showPreGameQuestions(callback) {
  questionIndex = 0;
  correctAnswers = 0;
  onComplete = callback;
  pauseGameForQuestions();
  renderQuestion();
}

function renderQuestion() {
  const questionModal = document.getElementById("questionModal");
  const questionText = document.getElementById("questionText");
  const questionOptions = document.getElementById("questionOptions");

  if (questionIndex >= questionPool.length) {
    const adjustment = (correctAnswers * 5 - (questionPool.length - correctAnswers) * 5) * 1000;
    timeData.countdown = Math.max(timeData.countdown + adjustment, 0);
    resumeGameAfterQuestions();
    if (typeof onComplete === "function") onComplete();
    return;
  }

  const question = questionPool[questionIndex];
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

  questionModal.style.display = "flex";
}

function handleAnswer(isCorrect) {
  const questionOptions = document.getElementById("questionOptions");
  questionOptions.innerHTML = "";

  const result = document.createElement("div");
  result.innerText = isCorrect ? "✅ ¡Correcto!" : "❌ Incorrecto.";
  result.style.fontSize = "20px";
  result.style.fontWeight = "bold";
  result.style.marginTop = "10px";
  result.style.color = isCorrect ? "green" : "red";
  questionOptions.appendChild(result);

  if (isCorrect) correctAnswers++;

  const continueBtn = document.createElement("button");
  continueBtn.innerText = "Siguiente";
  continueBtn.style.marginTop = "20px";
  continueBtn.style.padding = "10px 20px";
  continueBtn.onclick = () => {
    questionIndex++;
    renderQuestion();
  };
  questionOptions.appendChild(continueBtn);
}

function pauseGameForQuestions() {
  toggleGameTimer(false);
  gameData.paused = true;
}

function resumeGameAfterQuestions() {
  document.getElementById("questionModal").style.display = "none";
  toggleGameTimer(false);
  gameData.paused = false;
}
