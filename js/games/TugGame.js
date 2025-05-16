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
    `💪 Desafío Tira y Afloja

📚 Antes de empezar, responde preguntas:  
✅ Acertar suma 3 segundos.  
❌ Fallar resta 3 segundos.

🎮 Luego, presiona rápidamente el botón verde de la parte superior
(pantalla 📱 o mouse 💻) para tirar la cuerda hacia ti.

🏆 ¡Sé más rápido que el equipo rival hasta que caigan al vacío!
`
  );

  showPreGameQuestions(() => {
    // Esta lógica solo se ejecuta después de contestar las preguntas
    // Reset tugData and start the rope sound
    TweenMax.to(roundData.tugData, 0, {
      overwrite: true,
      onComplete: function () {
        playSoundLoop("soundRope");

        // Calculate half the number of players for team splitting
        var halfPeople = Math.floor(gameSettings.game3.players / 2);
        // Loop through all players except the last one
        for (var n = 0; n < players.length - 1; n++) {
          var player = players[n];
          // Set animation for pulling
          player.sprite.sprite.gotoAndPlay("pull");

          // Players in the second half use a different animation
          if (n >= halfPeople) {
            player.sprite.sprite.gotoAndPlay("frontpull");
          }
        }

        // Turn on the green light and start the tug movement loop
        playSound("soundLightOn");
        itemLight.gotoAndStop("green");
        loopTugMoveTimer();
      },
    });
  });
}

// Continuously updates the tug movement by adjusting the speed
function loopTugMoveTimer() {
  // Increase tug speed by a random value within opponent's speed range
  roundData.tugData.speed = getMaxTugSpeed(
    roundData.tugData.speed,
    randomInt(roundData.tugData.oppSpeed[0], roundData.tugData.oppSpeed[1])
  );
  // Schedule the next update after 0.1 seconds
  TweenMax.to(roundData.tugData.moveTween, 0.1, {
    overwrite: true,
    onComplete: function () {
      loopTugMoveTimer();
    },
  });
}

// Called when the player performs a tug action (e.g., button press)
export function playerTugAction() {
  // Decrease tug speed by a random value within user's speed range (negative to pull back)
  roundData.tugData.speed = getMaxTugSpeed(
    roundData.tugData.speed,
    -randomInt(roundData.tugData.userSpeed[0], roundData.tugData.userSpeed[1])
  );
}

// Ensures the tug speed stays within allowed bounds
function getMaxTugSpeed(val, speed) {
  var maxVal = 100;
  var result = val + speed;
  result = result > maxVal ? maxVal : result;
  result = result < -maxVal ? -maxVal : result;
  return result;
}

// Ends the Tug of War game and determines the winner
export function endTugGame() {
  // Only end if the camera is following (game is active)
  if (roundData.followCamera) {
    roundData.followCamera = false;
    gameData.interact = false;
    // Stop any ongoing tug movement tweens
    TweenMax.killTweensOf(roundData.tugData.moveTween);

    var roundWin = true;
    var halfPeople = Math.floor(gameSettings.game3.players / 2);
    // Check which team has inactive players to determine the winner
    for (var n = 0; n < players.length; n++) {
      var player = players[n];

      if (n < halfPeople) {
        // If any player in the first half is inactive, they lose
        if (!player.active) {
          roundWin = false;
        }
      } else {
        // If any player in the second half is inactive, they lose
        if (!player.active) {
          roundWin = true;
        }
      }
    }

    var newSpeed = 1200;
    if (roundWin) {
      // If player team wins, end game as win and reverse speed
      endGame(true, false);
      newSpeed = -newSpeed;
    } else {
      // Otherwise, end game as loss
      endGame(false, false);
    }

    // Animate the final tug movement to show the result
    TweenMax.to(roundData.tugData, 1, {
      speed: newSpeed,
      overwrite: true,
      onComplete: function () {
        // After a delay, stop the movement
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
