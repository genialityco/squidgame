/*!!
 * 
 * TUG OF WAR GAME - This is the function that runs for tug of war game
 * 
 */
 import  {roundData, players,endGame,gameData} from "../game.js"; // Import shared variables
 import { gameSettings } from '../gameSettings.js';
 import {itemLight} from "../canvas.js"; // Import shared variables
//  import {playSoundLoop} from "../sound.js"; // Import sound helper

 export function startTugGame(){
    TweenMax.to(roundData.tugData, 0, {overwrite:true, onComplete:function(){
        playSoundLoop('soundRope');

        var halfPeople = Math.floor(gameSettings.game3.players/2);
        for(var n=0; n<players.length-1; n++){
            var player = players[n];
            player.sprite.sprite.gotoAndPlay('pull');

            if(n >= halfPeople){
                player.sprite.sprite.gotoAndPlay('frontpull');
            }
        }

        playSound('soundLightOn');
        itemLight.gotoAndStop('green');
        loopTugMoveTimer();
    }});
 }

 function loopTugMoveTimer(){
    roundData.tugData.speed = getMaxTugSpeed(roundData.tugData.speed, randomInt(roundData.tugData.oppSpeed[0], roundData.tugData.oppSpeed[1]));
    TweenMax.to(roundData.tugData.moveTween, .1, {overwrite:true, onComplete:function(){
        loopTugMoveTimer();
    }});
}

export function playerTugAction(){
    roundData.tugData.speed = getMaxTugSpeed(roundData.tugData.speed, -randomInt(roundData.tugData.userSpeed[0], roundData.tugData.userSpeed[1]));
}

function getMaxTugSpeed(val, speed){
    var maxVal = 100;
    var result = val + speed;
    result = result > maxVal ? maxVal : result;
    result = result < -maxVal ? -maxVal : result;
    return result;
}

export function endTugGame(){
    if(roundData.followCamera){
        roundData.followCamera = false;
        gameData.interact = false;
        TweenMax.killTweensOf(roundData.tugData.moveTween);

        var roundWin = true;
        var halfPeople = Math.floor(gameSettings.game3.players/2);
        for(var n=0; n<players.length; n++){
            var player = players[n];

            if(n < halfPeople){
                if(!player.active){
                    roundWin = false;
                }
            }else{
                if(!player.active){
                    roundWin = true;
                }
            }
        }

        var newSpeed = 1200;
        if(roundWin){
            endGame(true, false);
            newSpeed = -newSpeed;
        }else{
            endGame(false, false);
        }

        TweenMax.to(roundData.tugData, 1, {speed:newSpeed, overwrite:true, onComplete:function(){
            TweenMax.to(roundData.tugData, .5, {delay:1, speed:0, overwrite:true, onComplete:function(){
                
            }});
        }});
    }
}