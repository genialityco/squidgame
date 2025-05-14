import { timeData, gameData, toggleGameTimer } from "../game.js";

/**
 *
 * @param {TweenMax.to} TweenTimer this variable is used to control a timer
 * This object has method to stop pause() and resume() the  timer.
 *
 */
export function pauseGameForModal(TweenTimer) {
  //if (TweenTimer) TweenTimer.pause(); // Pausar el temporizador del juego

  // Pausar todo
  TweenMax.pauseAll(true, true);
  gameData.paused = true;

  // Guardar tiempo restante
  if (timeData.enable) {
    timeData.savedTime = timeData.timer;
  }

  toggleGameTimer(false);
}
/**
 *
 * @param {TweenMax.to} TweenTimer this variable is used to control a timer
 * This object has method to stop pause() and resume() the  timer.
 *
 */
export function resumeGameAfterModal(TweenTimer) {
//if (TweenTimer) TweenTimer.resume(); // Reanuda el temporizador del juego
  TweenMax.resumeAll(true, true);
  gameData.paused = false;

  if (typeof timeData.savedTime !== "undefined") {
    timeData.countdown = timeData.savedTime;
    timeData.startDate = new Date();
    timeData.oldTimer = -1;
  }
  toggleGameTimer(true);
  
}
