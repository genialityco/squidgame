/*!!
 *
 * BRIDGE GAME - This is the function that runs for bridge game
 *
 */
import { roundData, endGame } from "../game.js"; // Import shared variables
import { gameData, players, defaultGameData, defaultData, updatePlayerFrame, findSegment } from "../game.js"; // Import gameData, players, defaultGameData, defaultData
import { stage, canvasW } from "../canvas.js"; // Import stage and canvasW
import { gameSettings } from "../gameSettings.js";
// import {playSound} from "../sound.js"; // Import sound helper

// Move the front player (current turn) forward on the bridge
export function moveFrontPlayer() {
  gameData.interact = false; // Disable interaction during movement
  var getPlayerIndex = roundData.bridgeData.turnArr.indexOf(roundData.bridgeData.playerIndex);
  var player = players[getPlayerIndex];

  // Store last position for reference
  roundData.bridgeData.lastPos = { z: player.z, offset: player.offset };

  // Determine which side to jump to based on mouse position
  var newOffset = 0.2;
  var stageMouseX = stage.mouseX - canvasW / 2;
  if (stageMouseX < 0) {
    newOffset = -newOffset;
  }

  // Calculate new position for the jump
  var posData = { z: player.z + defaultGameData.bridgeSteps * defaultData.segmentLength, offset: newOffset };
  roundData.bridgeData.newPos = { z: posData.z, offset: posData.offset };

  // Animate the player's jump
  animatePlayerJump(player, posData, true, true);

  // Move the camera forward to follow the player
  var newCameraPostion = defaultData.position + defaultGameData.bridgeSteps * defaultData.segmentLength;
  TweenMax.to(defaultData, 1, { position: newCameraPostion, overwrite: true });
}

// Animate a player's jump to a new position on the bridge
function animatePlayerJump(player, posData, con) {
  player.tweenData = { z: player.z, offset: player.offset };
  player.bounceData = { y: 0 };

  // Calculate total bridge length for movement logic
  var totalLength = gameSettings.game5.length * defaultGameData.bridgeSteps * defaultData.segmentLength;
  totalLength += (defaultGameData.bridgeStart - 2) * defaultData.segmentLength;
  // Determine movement speed based on position
  var moveSpeed = player.z > (defaultGameData.bridgeStart - 2) * defaultData.segmentLength ? 1 : 0.5;
  if (player.z > totalLength + defaultData.segmentLength * 2) {
    moveSpeed = 0.5;
  }

  // If running, play run animation and sound
  if (moveSpeed == 1) {
    updatePlayerFrame(player.index, "run");

    // Animate bounce effect
    TweenMax.to(player.bounceData, moveSpeed / 4, { y: 300, ease: Power2.easeOut });
    TweenMax.to(player.bounceData, moveSpeed / 2, { y: 0, ease: Bounce.easeOut, delay: moveSpeed / 4 });

    // Play random glass sound
    var randomFrame = Math.floor(Math.random() * 3);
    playSound("soundGlass" + (randomFrame + 1));
  }

  // Tween player's position and handle segment changes
  TweenMax.to(player.tweenData, moveSpeed, {
    z: posData.z,
    offset: posData.offset,
    overwrite: true,
    onUpdate: function () {
      var oldSegment = findSegment(player.z);

      // Update player position and percent
      player.z = player.tweenData.z + player.bounceData.y;
      player.offset = player.tweenData.offset;
      player.percent = percentRemaining(player.z, defaultData.segmentLength);
      var newSegment = findSegment(player.z);

      // Move player between segments if needed
      if (oldSegment != newSegment) {
        var index = oldSegment.players.indexOf(player);
        oldSegment.players.splice(index, 1);
        newSegment.players.push(player);
      }
    },
    onComplete: function () {
      updatePlayerFrame(player.index, "idle");

      // If this is the main player's jump, check for failure
      if (con) {
        roundData.bridgeData.fail = false;
        var checkSide = posData.offset < 0 ? 0 : 1;
        if (roundData.bridgeData.seqArrIndex < roundData.bridgeData.seqArr.length) {
          // Check if player chose the correct side
          if (roundData.bridgeData.seqArr[roundData.bridgeData.seqArrIndex].side != checkSide) {
            // Player failed, set fail state and animate failure
            roundData.bridgeData.newPos.offset = posData.offset > 0 ? -0.2 : 0.2;

            roundData.bridgeData.fail = true;
            roundData.bridgeData.seqArr[roundData.bridgeData.seqArrIndex].fail = true;
            animatePlayerJumpFail(player);
          }
        }

        // Move to next sequence step
        roundData.bridgeData.seqArrIndex++;
        moveOtherPlayers(true);

        // If failed and last player, end game
        if (roundData.bridgeData.fail) {
          if (roundData.bridgeData.playerIndex >= roundData.bridgeData.turnArr.length - 1) {
            endGame(false, false);
          }
        }
      } else {
        // For non-front players, decrement animation count and check for completion
        roundData.bridgeData.animateCount--;
        if (roundData.bridgeData.animateCount == 0) {
          moveOtherPlayersComplete();
        }
      }
    },
  });
}

// Animate a player's failure (falling off the bridge)
function animatePlayerJumpFail(player) {
  var randomFrame = Math.floor(Math.random() * 3);
  playSound("soundScream" + (randomFrame + 1));
  playSound("soundGlassBroken");
  TweenMax.to(player.sprite, 0.5, {
    alpha: 0,
    overwrite: true,
    onComplete: function () {
      player.active = false; // Deactivate player after falling
    },
  });
}

// Move all other players after the front player has moved
export function moveOtherPlayers(con) {
  gameData.interact = false;

  var firstCount = con;
  var animateCount = 0;
  // Loop through remaining players in turn order
  for (var n = roundData.bridgeData.playerIndex; n < roundData.bridgeData.turnArr.length; n++) {
    var getPlayerIndex = roundData.bridgeData.turnArr.indexOf(n);
    var player = players[getPlayerIndex];

    if (!firstCount) {
      // Animate each player's jump to the last position
      roundData.bridgeData.animateCount++;
      animatePlayerJump(player, roundData.bridgeData.lastPos, false);
      roundData.bridgeData.lastPos.z = player.z;
      roundData.bridgeData.lastPos.offset = player.offset;
      animateCount++;
    }

    firstCount = false;
  }

  // If no animations, move to last step or re-enable interaction
  if (animateCount == 0) {
    if (!roundData.bridgeData.fail) {
      moveLastStep();
    }
    gameData.interact = true;
  }
}

// Called when all other players have finished moving
function moveOtherPlayersComplete() {
  gameData.interact = true;

  if (roundData.bridgeData.fail) {
    roundData.bridgeData.fail = false;

    // Update last position to new position
    roundData.bridgeData.lastPos.z = roundData.bridgeData.newPos.z;
    roundData.bridgeData.lastPos.offset = roundData.bridgeData.newPos.offset;

    // Advance to next player
    roundData.bridgeData.playerIndex++;
    moveOtherPlayers(false);
  } else {
    moveLastStep();
  }
}

// Handle the last step of the bridge sequence
function moveLastStep() {
  if (roundData.bridgeData.seqArrIndex >= roundData.bridgeData.seqArr.length) {
    // If sequence is complete, move to random offset and end game
    var newOffset = Math.random() * randomChoice([-0.1, 0.1]);
    roundData.bridgeData.newPos = {
      z: roundData.bridgeData.newPos.z + defaultGameData.bridgeSteps * defaultData.segmentLength,
      offset: newOffset,
    };

    roundData.bridgeData.lastPos.z = roundData.bridgeData.newPos.z;
    roundData.bridgeData.lastPos.offset = roundData.bridgeData.newPos.offset;

    moveOtherPlayers(false);
    endGame(true, false);
  }
}

/** 
 * Eliminate a specific number of players ("turns") from the Bridge Game.
 * - Increments the playerIndex to skip eliminated players.
 * - Deactivates the corresponding players from the end of the array.
 * - Optionally, could update camera or lastPos to new front player.
 */
export function eliminatePlayers(cantidadAEliminar) {
  roundData.bridgeData.playerIndex += cantidadAEliminar;
  for (let i = 0; i < cantidadAEliminar; i++) {
    players[players.length - 1 - i].active = false;
  }
  const newFrontIndex = roundData.bridgeData.turnArr.indexOf(roundData.bridgeData.playerIndex);
  const newFrontPlayer = players[newFrontIndex];
  if (newFrontPlayer) {
    // Move camera to new player's position
    //defaultData.position = newFrontPlayer.z;
    // Optionally, update lastPos to avoid jump glitches
    //roundData.bridgeData.lastPos = { z: newFrontPlayer.z, offset: newFrontPlayer.offset };
  }
  moveOtherPlayers(false);
}
