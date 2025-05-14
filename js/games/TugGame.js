/*!!
 *
 * TUG OF WAR GAME - This is the function that runs for tug of war game
 *
 */
import { roundData, players, endGame, gameData } from "../game.js"; // Import shared variables
import { gameSettings } from "../gameSettings.js";
import { itemLight } from "../canvas.js"; // Import shared variables
import { showPreGameQuestions } from "./pregameQuestions.js";
import { showInstructionModal } from "../helpers/instructions.js";
//  import {playSoundLoop} from "../sound.js"; // Import sound helper

export async function startTugGame() {
  await showInstructionModal(
    `💪 ¡Desafío Tira y Afloja!

📚 Antes de comenzar, responde unas preguntas.
❌ Cada error te resta 5 segundos del tiempo total.

🎮 Luego, al iniciar el juego:
👉 Presiona rápidamente la pantalla, el mouse o el botón verde en la parte superior.
¡Hazlo sin parar hasta que el equipo rival caiga al vacío! 😱

⏱️ ¡Velocidad, fuerza y concentración!
¿Tienes lo que se necesita para ganar?`
  );

  showPreGameQuestions(() => {
    // Esta lógica solo se ejecuta después de contestar las preguntas
    TweenMax.to(roundData.tugData, 0, {
      overwrite: true,
      onComplete: function () {
        playSoundLoop("soundRope");

        var halfPeople = Math.floor(gameSettings.game3.players / 2);
        for (var n = 0; n < players.length - 1; n++) {
          var player = players[n];
          player.sprite.sprite.gotoAndPlay("pull");

          if (n >= halfPeople) {
            player.sprite.sprite.gotoAndPlay("frontpull");
          }
        }

        playSound("soundLightOn");
        itemLight.gotoAndStop("green");
        loopTugMoveTimer();
      },
    });
  });
}

function loopTugMoveTimer() {
  roundData.tugData.speed = getMaxTugSpeed(
    roundData.tugData.speed,
    randomInt(roundData.tugData.oppSpeed[0], roundData.tugData.oppSpeed[1])
  );
  TweenMax.to(roundData.tugData.moveTween, 0.1, {
    overwrite: true,
    onComplete: function () {
      loopTugMoveTimer();
    },
  });
}

export function playerTugAction() {
  roundData.tugData.speed = getMaxTugSpeed(
    roundData.tugData.speed,
    -randomInt(roundData.tugData.userSpeed[0], roundData.tugData.userSpeed[1])
  );
}

function getMaxTugSpeed(val, speed) {
  var maxVal = 100;
  var result = val + speed;
  result = result > maxVal ? maxVal : result;
  result = result < -maxVal ? -maxVal : result;
  return result;
}

export function endTugGame() {
  if (roundData.followCamera) {
    roundData.followCamera = false;
    gameData.interact = false;
    TweenMax.killTweensOf(roundData.tugData.moveTween);

    var roundWin = true;
    var halfPeople = Math.floor(gameSettings.game3.players / 2);
    for (var n = 0; n < players.length; n++) {
      var player = players[n];

      if (n < halfPeople) {
        if (!player.active) {
          roundWin = false;
        }
      } else {
        if (!player.active) {
          roundWin = true;
        }
      }
    }

    var newSpeed = 1200;
    if (roundWin) {
      endGame(true, false);
      newSpeed = -newSpeed;
    } else {
      endGame(false, false);
    }

    TweenMax.to(roundData.tugData, 1, {
      speed: newSpeed,
      overwrite: true,
      onComplete: function () {
        TweenMax.to(roundData.tugData, 0.5, {
          delay: 1,
          speed: 0,
          overwrite: true,
          onComplete: function () {},
        });
      },
    });
  }
}
