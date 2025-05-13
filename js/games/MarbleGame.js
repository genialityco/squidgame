/*!!
 * 
 * MARBLE GAME - This is the function that runs for marble game
 * 
 */
 import  {roundData,endGame, toggleGameInstruction} from "../game.js"; // Import shared variables
 import { gameSettings } from '../gameSettings.js';
 // import {playSound} from "../sound.js"; // Import sound helper
import { handButtonContainer, handContainer } from "../canvas.js"; // Import hand containers
import { gameTextDisplay } from "../game.js"; // Import game text display
// import { randomBoolean, randomInt } from "../plugins.js"; // Import random utility functions

export function resetMarbleGame(){
    for(var n = 0; n<3; n++) {
        $.sprites['marbleBall'+n].visible = false;
    }

    $.sprites['hand'+0].sprite.gotoAndStop(1);
    $.sprites['hand'+1].sprite.gotoAndStop(1);

    handButtonContainer.visible = false;
    $.sprites['handWinStatTxt0'].text = '';
    $.sprites['handWinStatTxt1'].text = '';

    updateMarbleStats()
}

export function changeMarbleTurn(){
    for(var n = 0; n<3; n++) {
        $.sprites['marbleBall'+n].visible = false;
    }

    $.sprites['hand'+0].sprite.gotoAndStop(1);
    $.sprites['hand'+1].sprite.gotoAndStop(1);

    var circleRange = 50;
    roundData.marbleData.chooseNum = 0;
    roundData.marbleData.guessNum = 1;
    roundData.marbleData.result = randomBoolean();

    var pathArr = [{x:0, y:0}, {x:-circleRange, y:-circleRange}, {x:-(circleRange * 2), y:0}, {x:-circleRange, y:circleRange}, {x:0, y:0}];

    if(roundData.marbleData.turn == 1){
        if(roundData.marbleData.user == 1){
            roundData.marbleData.result = false;
        }

        roundData.marbleData.chooseNum = 1;
        roundData.marbleData.guessNum = 0;
        pathArr = [{x:0, y:0}, {x:circleRange, y:-circleRange}, {x:circleRange * 2, y:0}, {x:circleRange, y:circleRange}, {x:0, y:0}];
    }else{
        //user
        if(roundData.marbleData.opponent == 1){
            roundData.marbleData.result = false;
        }
    }

    playSound('soundMarbleRoll');
    TweenMax.to($.sprites['handWrap'+roundData.marbleData.guessNum], .5, {bezier:{curviness:1, values:pathArr}, ease:Linear.easeNone, overwrite:true, repeat:1, onComplete:function(){
        changeMarbleTurnComplete();
    }})
}

export function changeMarbleTurnComplete(){
    $.sprites['hand'+roundData.marbleData.chooseNum].sprite.gotoAndStop(0);

    handButtonContainer.visible = false;
    if(roundData.marbleData.turn == 0){
        handButtonContainer.visible = true;
    }else{
        TweenMax.to(handContainer, .5, {overwrite:true, onComplete:function(){
            roundData.marbleData.oppResult = randomBoolean();

            if(roundData.marbleData.user == 1){
                roundData.marbleData.oppResult = false;
            }
            toggleHandStatus(roundData.marbleData.oppResult);
        }});
    }
}

export function toggleHandStatus(con){
    toggleGameInstruction(false);
    showMarbleResult(con);
}

export function showMarbleResult(result){
    handButtonContainer.visible = false;

    var resultTxt = result == true ? gameTextDisplay.even : gameTextDisplay.odd;
    var tweenSpeed = .8;

    if(roundData.marbleData.turn == 1){
        tweenSpeed = 1.3;
        $.sprites['handWinStatTxt'+roundData.marbleData.guessNum].text = resultTxt;
    }

    TweenMax.to(handContainer, tweenSpeed, {overwrite:true, onComplete:function(){
        $.sprites['handWinStatTxt0'].text = '';
        $.sprites['handWinStatTxt1'].text = '';
        $.sprites['hand'+roundData.marbleData.guessNum].sprite.gotoAndStop(2);

        var guessX = roundData.marbleData.guessNum == 1 ? roundData.marbleData.ballX : -roundData.marbleData.ballX;
        var guessY = 0;
        var chooseX = roundData.marbleData.guessNum == 1 ? -roundData.marbleData.ballX : roundData.marbleData.ballX;
        var totalBall = 1;

        if(roundData.marbleData.result){
            totalBall = 2;
        }

        var randomDis = 50;
        for(var n = 0; n<totalBall; n++) {
            $.sprites['marbleBall'+n].visible = true;
            $.sprites['marbleBall'+n].x = guessX + randomInt(-randomDis, randomDis) + (n * 20);
            $.sprites['marbleBall'+n].y = guessY + randomInt(-randomDis, randomDis) + (n * 20);
        }

        TweenMax.to(handContainer, 1, {overwrite:true, onComplete:function(){
            $.sprites['hand'+roundData.marbleData.chooseNum].sprite.gotoAndStop(2);
            
            var randomBall = 0;
            if(totalBall > 1){
                randomBall = Math.floor(Math.random()*2);
            }
            if(roundData.marbleData.result == result){
                $.sprites['marbleBall'+randomBall].visible = true;

                TweenMax.to($.sprites['marbleBall'+randomBall], .5, {x:chooseX, overwrite:true, onComplete:function(){
                    endMarbleTurn(true);
                }})
            }else{
                $.sprites['marbleBall'+2].x = chooseX;
                $.sprites['marbleBall'+2].visible = true;

                TweenMax.to($.sprites['marbleBall'+2], .5, {x:guessX, overwrite:true, onComplete:function(){
                    endMarbleTurn(false);
                }})
            }
        }})
    }})
}

export function endMarbleTurn(win){
    playSound('soundMarbleHit');
    
    if(roundData.marbleData.turn == 0){
        if(win){
            roundData.marbleData.user++;
            roundData.marbleData.opponent--;
        }else{
            roundData.marbleData.user--;
            roundData.marbleData.opponent++;
        }
    }else{
        if(win){
            roundData.marbleData.user--;
            roundData.marbleData.opponent++;
        }else{
            roundData.marbleData.user++;
            roundData.marbleData.opponent--;
        }
    }

    updateMarbleStats();

    TweenMax.to(handContainer, .5, {overwrite:true, onComplete:function(){
        if(roundData.marbleData.turn == 1){
            roundData.marbleData.turn = 0;
        }else{
            roundData.marbleData.turn = 1;
        }

        var finalTotalBall = gameSettings.game4.totalBall * 2;
        if(roundData.marbleData.user >= finalTotalBall){
            endGame(true, false);
        }else if(roundData.marbleData.opponent >= finalTotalBall){
            endGame(false, false);
        }else{
            changeMarbleTurn();
        }
    }})	
}

export function updateMarbleStats(){
    roundData.survivalData.instruction = false;
    playSound('soundMarble');

    $.sprites['handMarbleBallTxt0'].text = 'x' + roundData.marbleData.user;
    $.sprites['handMarbleBallTxt1'].text = 'x' + roundData.marbleData.opponent;	
}
