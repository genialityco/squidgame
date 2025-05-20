/*!!
 *
 * SURVIVAL GAME - This is the function that runs for survival game
 *
 */
import {
  roundData,
  endGame,
  updatePlayerFrame,
  defaultGameData,
  players,
  millisecondsToTimeGame,
  goPage,
} from "../game.js"; // Import shared variables
import { gameSettings } from '../gameSettings.js';
import { itemControl, itemLight } from "../canvas.js"; // Import shared variables
import { gameData, timeData, defaultData } from "../game.js"; // Import shared variables
import { timerTxt } from "../canvas.js"; // Import shared variables
//  import { playSound } from "../sound.js"; // Import sound helper
import { toggleGameTimer, toggleGameInstruction } from "../game.js"; // Import shared functions
import { gameTextDisplay } from "../gameTextDisplay.js";
import { showInstructionModal } from "../helpers/instructions.js";
import { showPreGameQuestions } from "./pregameQuestions.js";
import { hasReachedAttemptLimit } from "../helpers/metrics.js";
//  import { randomBoolean } from "../plugins.js"; // Import utility function
export async function startSurvivalGame() {

   const attemptLimitReached = await hasReachedAttemptLimit(gameData.roundNum);
  
      if (attemptLimitReached) {
      alert("⚠️ Has alcanzado el máximo de 5 intentos en esta ronda, por favor dirijase a la sección de juegos e intente con el siguiente juego.");
      goPage("main"); // O redirige a otra pantalla
      return;
    }

  await showInstructionModal(`⚔️ Survival Game

📚 Antes de jugar, responde preguntas:  
✅ Acertar suma 3 segundos.  
❌ Fallar resta 3 segundos.

🕒 El tiempo total de la ronda comienza en 15 segundos,  
y se ajusta según tus respuestas.

Al iniciar, verás tu rol en la parte superior:

🔪 Atacante: persigue y elimina a tu oponente.  
🏃‍♀️ Superviviente: corre y evita ser atrapado.

¡Reacciona rápido, elige bien tu ruta…  
¿Serás cazador o presa?
`);

  showPreGameQuestions(() => {
    // ✅ Esta parte se ejecuta luego de responder las preguntas
    itemControl.visible = true;
    itemControl.alpha = 1;
    roundData.survivalData.turn = randomBoolean();
    swithTurn();
    beginSurvivalRound(3);
  });
}


function beginSurvivalRound(time) {
  TweenMax.to(roundData.survivalData, time, {
    overwrite: true,
    onComplete: function () {
      gameData.interact = true;

      itemLight.gotoAndStop("green");
      playSound("soundLightOn");
      toggleGameTimer(true);

      if (!roundData.survivalData.instruction) {
        roundData.survivalData.instruction = true;
        toggleGameInstruction(true);
      }

      roundData.survivalData.start = true;
    },
  });
}

export function stopSurvivalRound() {
  gameData.interact = false;

  timerTxt.text = millisecondsToTimeGame(timeData.countdown);
  roundData.survivalData.start = false;
  roundData.survivalData.move = false;

  if (randomBoolean()) {
    updatePlayerFrame(0, "idle");
  } else {
    updatePlayerFrame(0, "front");
  }
  if (randomBoolean()) {
    updatePlayerFrame(1, "idle");
  } else {
    updatePlayerFrame(1, "front");
  }

  toggleGameTimer(false);
  itemLight.gotoAndStop("red");
  playSound("soundLightOff");

  swithTurn();
  beginSurvivalRound(3);
}

export function swithTurn() {
  roundData.survivalData.oppData.speedTime = 0;

  if (roundData.survivalData.turn) {
    roundData.survivalData.turn = false;
  } else {
    roundData.survivalData.turn = true;
  }

  var userTxt = gameTextDisplay.kill;
  var oppTxt = gameTextDisplay.run;
  if (roundData.survivalData.turn) {
    userTxt = gameTextDisplay.run;
    oppTxt = gameTextDisplay.kill;
  }

  $.sprites["healthTypeTxt" + 0].text = $.sprites["healthTypeShadowTxt" + 0].text = userTxt;
  $.sprites["healthTypeTxt" + 1].text = $.sprites["healthTypeShadowTxt" + 1].text = oppTxt;

  $.sprites["healthType" + 0].x = $.sprites["healthType" + 0].oriX + 50;
  $.sprites["healthType" + 0].alpha = 0;
  TweenMax.to($.sprites["healthType" + 0], 0.5, { x: $.sprites["healthType" + 0].oriX, alpha: 1, overwrite: true });

  $.sprites["healthType" + 1].x = $.sprites["healthType" + 1].oriX - 50;
  $.sprites["healthType" + 1].alpha = 0;
  TweenMax.to($.sprites["healthType" + 1], 0.5, { x: $.sprites["healthType" + 1].oriX, alpha: 1, overwrite: true });

  playSound("soundSwitch");
}

export function getOppAway() {
  var targetPlayer = players[0];
  var oppPlayer = players[1];

  var distanceZ = targetPlayer.z - oppPlayer.z;
  var distanceX = targetPlayer.offset - oppPlayer.offset;
  var rangeNumZ = 800;
  var rangeNumX = 0.3;
  var startZ = defaultGameData.survivalStart * defaultData.segmentLength;
  var endZ = (defaultGameData.survivalStart + gameSettings.game6.length) * defaultData.segmentLength;
  var randomX = false;

  if (Math.abs(distanceX) < rangeNumX - 0.1) {
    if (distanceX < 0) {
      roundData.survivalData.oppData.offset = targetPlayer.offset + roundData.survivalData.oppData.speedX;
      if (roundData.survivalData.oppData.offset >= 1) {
        roundData.survivalData.oppData.offset = targetPlayer.offset - roundData.survivalData.oppData.speedX;
      }
    } else if (distanceX > 0) {
      roundData.survivalData.oppData.offset = targetPlayer.offset - roundData.survivalData.oppData.speedX;
      if (roundData.survivalData.oppData.offset <= -1) {
        roundData.survivalData.oppData.offset = targetPlayer.offset + roundData.survivalData.oppData.speedX;
      }
    }
  } else {
    randomX = true;
  }

  if (Math.abs(distanceZ) < rangeNumZ - 50) {
    roundData.survivalData.oppData.time = 0;

    if (distanceZ < 0) {
      roundData.survivalData.oppData.z = targetPlayer.z + rangeNumZ;
      if (roundData.survivalData.oppData.z >= endZ) {
        roundData.survivalData.oppData.z = targetPlayer.z - rangeNumZ;
      }
    } else if (distanceZ > 0) {
      roundData.survivalData.oppData.z = targetPlayer.z - rangeNumZ;
      if (roundData.survivalData.oppData.z <= startZ) {
        roundData.survivalData.oppData.z = targetPlayer.z + rangeNumZ;
      }
    }
  } else {
    //random
    if (roundData.survivalData.oppData.time > 0) {
      roundData.survivalData.oppData.time--;
    } else {
      roundData.survivalData.oppData.time = randomInt(10, 20);
      roundData.survivalData.oppData.z =
        randomInt(defaultGameData.survivalStart, defaultGameData.survivalStart + gameSettings.game6.length) *
        defaultData.segmentLength;

      if (randomX) {
        roundData.survivalData.oppData.offset = Math.random() * randomChoice([-0.8, 0.8]);
      }
    }
  }
}

export function updatePlayerMoveSpeed() {
  if (roundData.survivalData.oppData.speedTime > 0) {
    roundData.survivalData.oppData.speedTime--;
  } else {
    roundData.survivalData.oppData.speedTime = randomInt(30, 50);

    if (roundData.survivalData.turn) {
      //opp kill
      roundData.survivalData.oppData.speedX = 0.3;
      roundData.survivalData.oppData.speedZ = randomInt(
        defaultGameData.survivalSpeed - 300,
        defaultGameData.survivalSpeed + 100
      );
    } else {
      roundData.survivalData.oppData.speedX = 0.3;
      roundData.survivalData.oppData.speedZ = randomInt(
        defaultGameData.survivalSpeed - 900,
        defaultGameData.survivalSpeed - 600
      );
    }
  }
}

export function updatePlayerHealth() {
  if (!roundData.survivalData.start) {
    return;
  }

  var targetPlayer = players[0];
  var oppPlayer = players[1];

  var distanceZ = targetPlayer.z - oppPlayer.z;
  var distanceX = targetPlayer.offset - oppPlayer.offset;
  var healthDec = 15;

  if (Math.abs(distanceZ) < 100) {
    if (roundData.survivalData.healthTime > 0) {
      roundData.survivalData.healthTime--;
    } else {
      roundData.survivalData.healthTime = 20;

      var disNum = 50 * defaultData.scale;
      if (Math.abs(distanceX) <= disNum) {
        if (!roundData.survivalData.turn) {
          roundData.survivalData.oppHealth -= healthDec;
          roundData.survivalData.oppHealth =
            roundData.survivalData.oppHealth < 0 ? 0 : roundData.survivalData.oppHealth;
        } else {
          roundData.survivalData.userHealth -= healthDec;
          roundData.survivalData.userHealth =
            roundData.survivalData.userHealth < 0 ? 0 : roundData.survivalData.userHealth;
        }

        var randomFrame = Math.floor(Math.random() * 3);
        playSound("soundStab" + (randomFrame + 1));
        updatePlayerHealthBar();
      }
    }
  }

  if (roundData.survivalData.userHealth <= 0) {
    targetPlayer.status = "dead";
    updatePlayerFrame(0, "dead");
    toggleGameTimer(false);
    endGame(false, false);
  }

  if (roundData.survivalData.oppHealth <= 0) {
    oppPlayer.status = "dead";
    updatePlayerFrame(1, "dead");
    toggleGameTimer(false);
    endGame(true, false);
  }
}

export function updatePlayerHealthBar() {
  var userBar = (roundData.survivalData.userHealth / 100) * defaultGameData.survivalBarW;
  var oppBar = (roundData.survivalData.oppHealth / 100) * defaultGameData.survivalBarW;

  $.sprites["healthGreen" + 0].graphics
    .clear()
    .beginFill(gameSettings.game6.bar.health)
    .drawRect(0, 0, userBar, defaultGameData.survivalBarH);
  TweenMax.to($.sprites["healthBlood" + 0], 0.5, {
    delay: 0.5,
    overwrite: true,
    onComplete: function () {
      $.sprites["healthBlood" + 0].graphics
        .clear()
        .beginFill(gameSettings.game6.bar.blood)
        .drawRect(0, 0, userBar, defaultGameData.survivalBarH);
    },
  });

  $.sprites["healthGreen" + 1].graphics
    .clear()
    .beginFill(gameSettings.game6.bar.health)
    .drawRect(0, 0, oppBar, defaultGameData.survivalBarH);
  TweenMax.to($.sprites["healthBlood" + 1], 0.5, {
    delay: 0.5,
    overwrite: true,
    onComplete: function () {
      $.sprites["healthBlood" + 1].graphics
        .clear()
        .beginFill(gameSettings.game6.bar.blood)
        .drawRect(0, 0, oppBar, defaultGameData.survivalBarH);
    },
  });
}
