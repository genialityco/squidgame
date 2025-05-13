import { toggleGameTimer, toggleGameInstruction } from "../game.js"; // Import helpers
import { startGreenLightCount } from "../games/RedLightGame.js"; // Import specific game logic
import { startTugGame } from "../games/TugGame.js"; // Import specific game logic
import { changeMarbleTurn, resetMarbleGame } from "../games/MarbleGame.js"; // Import specific game logic

 /*!!
 * 
 * GAME ROUND BEGIN - This is the function that runs to start game round
 * 
 */
export function startGameRound(){
    gameData.interact = true;

    if(gameData.roundNum == 1){
        loopPlayrMoveTimer();
        startGreenLightCount();
    }else if(gameData.roundNum == 2){
        candyContainer.visible = true;
        candyContainer.alpha = 0;

        TweenMax.to(candyContainer, .5, {alpha:1, overwrite:true, onComplete:function(){
            
        }});
    }else if(gameData.roundNum == 3){
        startTugGame();
    }else if(gameData.roundNum == 4){
        handContainer.visible = true;
        handContainer.alpha = 0;

        $.sprites['handWrap'+0].x -= 200;
        $.sprites['handWrap'+1].x += 200;

        resetMarbleGame();
        TweenMax.to($.sprites['handWrap'+0], .5, {x:0, overwrite:true});
        TweenMax.to($.sprites['handWrap'+1], .5, {x:0, overwrite:true});

        TweenMax.to(handContainer, .5, {alpha:1, overwrite:true, onComplete:function(){
            changeMarbleTurn();
        }});
    }else{
        
    }

    toggleGameTimer(true);
    toggleGameInstruction(true);
}
