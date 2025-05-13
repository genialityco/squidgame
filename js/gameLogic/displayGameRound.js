import { gameData, gameTextDisplay } from "../game.js"; // Import shared variables
import {gameRoundContainer, roundTxt, roundShadowTxt,roundNameTxt, roundNameShadowTxt} from "../canvas.js"; // Import shared variables
import { gameSettings } from '../gameSettings.js'; 
/*!!
 * 
 * DISPLAY GAME ROUND - This is the function that runs to display game round
 * 
 */
 export function displayGameRound(round, win){
    gameRoundContainer.alpha = 0;

    if(gameData.roundNum == 6){
        roundTxt.text = roundShadowTxt.text = gameTextDisplay.roundFinal.replace('[NUMBER]', gameData.roundNum);
    }else{
        roundTxt.text = roundShadowTxt.text = gameTextDisplay.round.replace('[NUMBER]', gameData.roundNum);
    }
    roundTxt.color = gameSettings['game'+gameData.roundNum].textColor;
    roundShadowTxt.color = gameSettings['game'+gameData.roundNum].textShadowColor;
    roundNameTxt.color = gameSettings['game'+gameData.roundNum].textColor;
    roundNameShadowTxt.color = gameSettings['game'+gameData.roundNum].textShadowColor;

    if(round){
        roundNameTxt.text = roundNameShadowTxt.text = gameSettings['game'+gameData.roundNum].name;
    }else{
        if(win){
            playSound('soundComplete');
            roundNameTxt.text = roundNameShadowTxt.text = gameTextDisplay.roundComplete;
        }else{
            playSound('soundFail');
            roundNameTxt.text = roundNameShadowTxt.text = gameTextDisplay.roundFail;
        }
    }

    TweenMax.to(gameRoundContainer, .5, {alpha:1.5, overwrite:true, onComplete:function(){
        TweenMax.to(gameRoundContainer, .5, {delay:1, alpha:0, overwrite:true, onComplete:function(){
            
        }});
    }});
}