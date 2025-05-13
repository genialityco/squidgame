 /*!!
 * 
 * CANDY GAME - This is the function that runs for candy game
 * 
 */
import  {roundData, gameSettings,toggleGameTimer,endGame} from "../game.js"; // Import shared variables
import {itemCandyBase,itemNeedle,itemPixel,candyDrawing} from "../canvas.js"; // Import shared variables
// import {playSound} from "../sound.js"; // Import sound helper

export function initCandyDrawingPos(x, y){
    roundData.candyData.x = x;
    roundData.candyData.y = y;

    var candyNum = roundData.candyData.candyNum;
    for(var n = 0; n<gameSettings['game2'].candy[candyNum].checkpoint.length; n++) {
        roundData.candyData.checkpoint.push({x:gameSettings['game2'].candy[candyNum].checkpoint[n].x - (itemCandyBase.image.naturalWidth/2), y:gameSettings['game2'].candy[candyNum].checkpoint[n].y - (itemCandyBase.image.naturalHeight/2), done:false});
    }
}

export function checkCandyDrawingPos(x, y){
    var doneCount = 0;
    var distanceNum = 30;
    for(var n = 0; n<roundData.candyData.checkpoint.length; n++) {
        var getTwoDistance = getDistance(x, y, roundData.candyData.checkpoint[n].x, roundData.candyData.checkpoint[n].y);
        if(getTwoDistance < distanceNum){
            roundData.candyData.checkpoint[n].done = true;
        }
    }

    for(var n = 0; n<roundData.candyData.checkpoint.length; n++) {
        if(roundData.candyData.checkpoint[n].done){
            doneCount++;
        }
    }

    if(doneCount >= roundData.candyData.checkpoint.length){
        var getTwoDistance = getDistance(x, y, roundData.candyData.x, roundData.candyData.y);
        if(getTwoDistance < distanceNum){
            toggleGameTimer(false);
            revealCandy();
        }
    }
}

export function chooseRandomCandy(){
    itemPixel.visible = true;
    itemNeedle.visible = true;
    itemCandyBase.visible = true;
    roundData.candyData.candyNum = Math.floor(Math.random() * gameSettings.game2.candy.length);
    
    for(var n = 0; n<gameSettings['game2'].candy.length; n++) {
        $.sprites['candy'+n].alpha = 0;
        $.sprites['candyFinal'+n].alpha = 0;
    }

    $.sprites['candy'+roundData.candyData.candyNum].alpha = 1;
    $.sprites['candyFinal'+roundData.candyData.candyNum].alpha = 0;
}

export function clearCandyDrawing(){
    roundData.candyData.draw = false;
    candyDrawing.graphics.clear();
}

export function revealCandy(){
    itemPixel.visible = false;
    itemNeedle.visible = false;
    clearCandyDrawing();

    TweenMax.to($.sprites['candy'+roundData.candyData.candyNum], .5, {alpha:0, overwrite:true});
    $.sprites['candyFinal'+roundData.candyData.candyNum].alpha = 1;
    itemCandyBase.visible = false;

    playSound('soundCrackFinal');
    endGame(true, false);
}