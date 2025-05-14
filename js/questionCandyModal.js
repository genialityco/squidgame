import { timeData, gameData, toggleGameTimer, roundData } from "./game.js";
import { questionPool } from "./questionPool.js";

let currentQuestionIndex = 0;
let questionsToAsk = [];
let correctAnswers = 0;

export function showCandyQuestionSequence(total = 3) {
  // Elegir preguntas aleatorias sin repetir
  questionsToAsk = shuffleArray([...questionPool]).slice(0, total);
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

  questionText.innerText = `Pregunta ${currentQuestionIndex + 1}:\n${question.text}`;
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
}

function handleAnswer(correct) {
  const questionOptions = document.getElementById("questionOptions");
  questionOptions.innerHTML = "";

  const result = document.createElement("div");
  result.innerText = correct
    ? "✅ ¡Correcto!"
    : "❌ Incorrecto.";
  result.style.fontSize = "20px";
  result.style.fontWeight = "bold";
  result.style.marginTop = "10px";
  result.style.color = correct ? "green" : "red";
  questionOptions.appendChild(result);

  if (correct) correctAnswers++;

  const nextBtn = document.createElement("button");
  nextBtn.innerText =
    currentQuestionIndex < questionsToAsk.length - 1 ? "Siguiente" : "Finalizar";
  nextBtn.style.marginTop = "20px";
  nextBtn.style.padding = "10px 20px";
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

  const secondsDelta = (correctAnswers - (questionsToAsk.length - correctAnswers)) * 3000;
  timeData.savedTime = Math.max(timeData.savedTime + secondsDelta, 0);

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
