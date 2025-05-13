import { roundData, players, gameData } from "../game.js"; // Import shared variables
import { updatePlayerFrame } from "../game.js"; // Import player helper
import { moveFrontPlayer } from "../games/BridgeGame.js"; // Import specific game logic

 /*!!
 * 
 * GAME CONTROL - This is the function that runs for game control
 * 
 */
export function toggleGameControl(type, con){
    if(gameData.ended){
        return;
    }

    if(!gameData.interact){
        return;
    }

    toggleGameInstruction(false);

    if(gameData.roundNum == 1){
        if(type == 'mousedown'){
            roundData.lightData.forward = true;
            roundData.lightData.stop = false;
            players[0].sprite.sprite.gotoAndPlay('run');
        }else if(type == 'pressup'){
            roundData.lightData.forward = false;
            roundData.lightData.stop = true;
            players[0].sprite.sprite.gotoAndPlay('idle');
        }
    }else if(gameData.roundNum == 2){
        if(type == 'mousedown'){
            
        }
    }else if(gameData.roundNum == 3){
        if(type == 'click'){
            playerTugAction();
        }
    }else if(gameData.roundNum == 4){
        if(type == 'mousedown'){
            
        }
    }else if(gameData.roundNum == 5){
        if(type == 'click'){
            moveFrontPlayer();
        }
    }else if(gameData.roundNum == 6){
        if(type == 'mousedown'){
            var controlDis = getDistance(stage.mouseX, stage.mouseY, itemControl.x, itemControl.y);
            if(controlDis < 100){
                roundData.survivalData.move = true;
                itemControl.alpha = .5;
            }
        }else if(type == 'pressup'){
            roundData.survivalData.move = false;
            itemControl.alpha = 1;
        }
    }
}
