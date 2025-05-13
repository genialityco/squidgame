/*!!
 * 
 * BRIDGE GAME - This is the function that runs for bridge game
 * 
 */
import  {roundData, gameSettings,endGame} from "../game.js"; // Import shared variables
import { gameData, players, defaultGameData, defaultData,updatePlayerFrame,findSegment } from "../game.js"; // Import gameData, players, defaultGameData, defaultData
import { stage, canvasW } from "../canvas.js"; // Import stage and canvasW

// import {playSound} from "../sound.js"; // Import sound helper
export function moveFrontPlayer(){
    gameData.interact = false;

    var getPlayerIndex = roundData.bridgeData.turnArr.indexOf(roundData.bridgeData.playerIndex);
    var player = players[getPlayerIndex];

    roundData.bridgeData.lastPos = {z:player.z, offset:player.offset};

    var newOffset = .2;
    var stageMouseX = (stage.mouseX - (canvasW/2));
    if(stageMouseX < 0){
        newOffset = -newOffset;
    }

    var posData = {z:player.z + (defaultGameData.bridgeSteps * defaultData.segmentLength), offset:newOffset};
    roundData.bridgeData.newPos = {z:posData.z, offset:posData.offset};

    animatePlayerJump(player, posData, true, true);

    var newCameraPostion = defaultData.position + (defaultGameData.bridgeSteps * defaultData.segmentLength);
    TweenMax.to(defaultData, 1, {position:newCameraPostion, overwrite:true});
}

function animatePlayerJump(player, posData, con){
    player.tweenData = {z:player.z, offset:player.offset};
    player.bounceData = {y:0};
    
    var totalLength = (gameSettings.game5.length * defaultGameData.bridgeSteps) * defaultData.segmentLength;
    totalLength += ((defaultGameData.bridgeStart - 2) * defaultData.segmentLength);
    var moveSpeed = player.z > (defaultGameData.bridgeStart - 2) * defaultData.segmentLength ? 1 : .5;
    if(player.z > totalLength + (defaultData.segmentLength * 2)){
        moveSpeed = .5;
    }
    
    if(moveSpeed == 1){
        updatePlayerFrame(player.index, 'run');

        TweenMax.to(player.bounceData, moveSpeed / 4, {y:300, ease:Power2.easeOut});
        TweenMax.to(player.bounceData, moveSpeed / 2, {y:0, ease:Bounce.easeOut, delay:moveSpeed / 4});

        var randomFrame = Math.floor(Math.random()*3);
        playSound('soundGlass'+(randomFrame+1));
    }

    TweenMax.to(player.tweenData, moveSpeed, {z:posData.z, offset:posData.offset, overwrite:true, onUpdate:function(){
        var oldSegment  = findSegment(player.z);

        player.z = player.tweenData.z + player.bounceData.y;
        player.offset = player.tweenData.offset;
        player.percent = percentRemaining(player.z, defaultData.segmentLength);
        var newSegment  = findSegment(player.z);
        
        if (oldSegment != newSegment) {
            var index = oldSegment.players.indexOf(player);
            oldSegment.players.splice(index, 1);
            newSegment.players.push(player);
        }
    }, onComplete:function(){
        updatePlayerFrame(player.index, 'idle');

        if(con){
            roundData.bridgeData.fail = false;
            var checkSide = posData.offset < 0 ? 0 : 1;
            if(roundData.bridgeData.seqArrIndex < roundData.bridgeData.seqArr.length){
                if(roundData.bridgeData.seqArr[roundData.bridgeData.seqArrIndex].side != checkSide){
                    roundData.bridgeData.newPos.offset = posData.offset > 0 ? -.2 : .2;
                    
                    roundData.bridgeData.fail = true;
                    roundData.bridgeData.seqArr[roundData.bridgeData.seqArrIndex].fail = true;
                    animatePlayerJumpFail(player);
                }
            }

            roundData.bridgeData.seqArrIndex++;
            moveOtherPlayers(true);

            if(roundData.bridgeData.fail){
                if(roundData.bridgeData.playerIndex >= roundData.bridgeData.turnArr.length-1){
                    endGame(false, false);
                }
            }
        }else{
            roundData.bridgeData.animateCount--;
            if(roundData.bridgeData.animateCount == 0){
                moveOtherPlayersComplete();
            }
        }
    }});
}

function animatePlayerJumpFail(player){
    var randomFrame = Math.floor(Math.random()*3);
    playSound('soundScream'+(randomFrame+1));
    playSound('soundGlassBroken');
    TweenMax.to(player.sprite, .5, {alpha:0, overwrite:true, onComplete:function(){
        player.active = false;
    }});
}

function moveOtherPlayers(con){
    gameData.interact = false;

    var firstCount = con;
    var animateCount = 0;
    for(var n=roundData.bridgeData.playerIndex; n<roundData.bridgeData.turnArr.length; n++) {
        var getPlayerIndex = roundData.bridgeData.turnArr.indexOf(n);
        var player = players[getPlayerIndex];

        if(!firstCount){
            roundData.bridgeData.animateCount++;
            animatePlayerJump(player, roundData.bridgeData.lastPos, false);
            roundData.bridgeData.lastPos.z = player.z;
            roundData.bridgeData.lastPos.offset = player.offset;
            animateCount++;
        }

        firstCount = false;
    }

    if(animateCount == 0){
        if(!roundData.bridgeData.fail){
            moveLastStep();
        }
        gameData.interact = true;
    }
}

function moveOtherPlayersComplete(){
    gameData.interact = true;

    if(roundData.bridgeData.fail){
        roundData.bridgeData.fail = false;

        roundData.bridgeData.lastPos.z = roundData.bridgeData.newPos.z;
        roundData.bridgeData.lastPos.offset = roundData.bridgeData.newPos.offset;

        roundData.bridgeData.playerIndex++;
        moveOtherPlayers(false);
    }else{
        moveLastStep();
    }
}

function moveLastStep(){
    if(roundData.bridgeData.seqArrIndex >= roundData.bridgeData.seqArr.length){
        var newOffset = Math.random() * randomChoice([-0.1, 0.1]);
        roundData.bridgeData.newPos = {z:roundData.bridgeData.newPos.z + (defaultGameData.bridgeSteps * defaultData.segmentLength), offset:newOffset};

        roundData.bridgeData.lastPos.z = roundData.bridgeData.newPos.z;
        roundData.bridgeData.lastPos.offset = roundData.bridgeData.newPos.offset;

        moveOtherPlayers(false);
        endGame(true, false);
    }
}