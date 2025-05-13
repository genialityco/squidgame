/*!!
 *
 * RED LIGHT GREEN LIGHT GAME - This is the function that runs for red light green light game
 *
 */
// import { randomInt, shuffle, randomChoice } from "../plugins.js"; // Import helper functions

import { decreaseTime } from "../helpers/time.js"; // Import time helper
import { updatePlayerFrame } from "../game.js"; // Import player helper
import { gameSettings, defaultGameData, roundData, players, gameData } from "../game.js"; // Import shared variables
import { itemLight } from "../canvas.js"; // Import shared variables
// import { playSound } from "../sound.js"; // Import sound helper
//import { playSound } from "../sound.js"; // Import sound helper

export function startGreenLightCount() {
  TweenMax.killTweensOf(roundData.lightData);

  itemLight.gotoAndStop("green");
  gameData.doll.gotoAndPlay("close");
  playSound("soundLightOn");

  var activePlayers = [];
  for (var n = 1; n < players.length; n++) {
    if (players[n].status == "") {
      var countTime = roundData.lightData.countTime * 1000;
      players[n].speed = randomInt(defaultGameData.playerSpeed[0], defaultGameData.playerSpeed[1]);
      players[n].moveTime = randomInt(countTime - 500, countTime);
      players[n].sandTime = randomInt(defaultGameData.sandTime[0], defaultGameData.sandTime[1]);
      activePlayers.push(n);
    }
  }

  shuffle(activePlayers);

  var totalPlayerDead = randomInt(gameSettings.game1.dead[0], gameSettings.game1.dead[1]);
  for (var n = 0; n < totalPlayerDead; n++) {
    if (n < activePlayers.length) {
      var playerIndex = activePlayers[n];
      var countTime = roundData.lightData.countTime * 1000;
      players[n].moveTime = randomInt(countTime, countTime + 500);
      players[n].sandTime = randomInt(defaultGameData.sandTime[0], defaultGameData.sandTime[1]);
      players[playerIndex].status = "nextDead";
    }
  }

  roundData.lightData.countTime = decreaseTime(roundData.lightData.countTime, gameSettings.game1.decreaseTime);
  TweenMax.to(roundData.lightData.timeTween, roundData.lightData.countTime, {
    overwrite: true,
    onComplete: function () {
      startRedLightCount();
    },
  });
  roundData.lightData.moveCon = true;
}

export function startRedLightCount() {
  playSound("soundLighOff");

  itemLight.gotoAndStop("red");
  gameData.doll.gotoAndPlay("peek");

  loopPlayerDead();

  roundData.lightData.peekTime = decreaseTime(roundData.lightData.peekTime, gameSettings.game1.decreaseTime);
  TweenMax.to(roundData.lightData.timeTween, roundData.lightData.peekTime, {
    overwrite: true,
    onComplete: function () {
      startGreenLightCount();
    },
  });

  roundData.lightData.moveCon = false;
}

export function loopPlayerDead() {
  var delayNum = Math.random() * randomChoice([0.2, 0.5]);
  TweenMax.to(roundData.lightData, delayNum, {
    overwrite: true,
    onComplete: function () {
      var deadCon = false;
      var nextDeadCount = 0;
      for (var n = 1; n < players.length; n++) {
        if (players[n].status == "nextDead") {
          if (!deadCon) {
            deadCon = true;
            players[n].status = "dead";
            updatePlayerFrame(n, "dead");
          }
          nextDeadCount++;
        }
      }

      if (nextDeadCount > 0) loopPlayerDead();
    },
  });
}
