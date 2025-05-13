import { roundData, gameData, defaultData,resetPath,resetWorld, toggleGameInstruction,millisecondsToTimeGame,changeGameViewport } from "../game.js"; // Import shared variables
import { gameSettings } from '../gameSettings.js';
import { itemLight, candyContainer, handContainer, healthContainer, itemControl, worldContainer,gameInstructContainer } from "../canvas.js"; // Import shared variables
import {updatePlayerHealthBar} from "../games/SurvivalGame.js"; // Import specific game logic
 /*!
 * 
 * PREPARE GAME ROUND - This is the function that runs to build game round
 * 
 */
export function prepareRound(){
    defaultData.position = 0;
    defaultData.playerX = 0;
    defaultData.speed = 0;

    roundData.totalPlayers = gameSettings['game'+gameData.roundNum].players;

    roundData.playerSet = false;
    roundData.lightData.countTime = gameSettings.game1.countTime;
    roundData.lightData.peekTime = gameSettings.game1.peekTime;
    roundData.lightData.moveCon = false;

    roundData.candyData = {x:0, y:0, checkpoint:[], lastPoint:{x:0, y:0}, draw:false};

    roundData.tugData.speed = 0;
    roundData.tugData.oppSpeed = gameSettings.game3.oppSpeed;
    roundData.tugData.userSpeed = gameSettings.game3.userSpeed;

    roundData.bridgeData.playerIndex = 0;
    roundData.bridgeData.seqArrIndex = 0;
    roundData.bridgeData.seqArr = [];
    roundData.bridgeData.animateCount = 0;
    roundData.bridgeData.lastPos = {x:0, y:0};

    roundData.marbleData.user = gameSettings.game4.totalBall;
    roundData.marbleData.opponent = gameSettings.game4.totalBall;
    roundData.marbleData.result = true;
    roundData.marbleData.oppResult = true;
    roundData.marbleData.turn = 0;
    roundData.marbleData.ballX = 250;

    roundData.survivalData.start = false;
    roundData.survivalData.move = false;
    roundData.survivalData.turn = false;
    roundData.survivalData.userHealth = 100;
    roundData.survivalData.oppHealth = 100;
    roundData.survivalData.oppData = {z:0, offset:0, time:0, boost:0, speedZ:0, speedX:0, speedTime:0};
    roundData.survivalData.healthTime = 0;

    itemLight.visible = false;
    candyContainer.visible = false;
    handContainer.visible = false;
    healthContainer.visible = false;
    itemControl.visible = false;
    worldContainer.y = 0;

    gameInstructContainer.alpha = 0;
    toggleGameInstruction(false);

    if(gameData.roundNum == 0){
        roundData.followCamera = true;
        roundData.players.startZ = 7;
        roundData.players.endZ = 20;
        roundData.players.playerZ = 7;
    }else if(gameData.roundNum == 1){
        roundData.followCamera = true;
        roundData.players.startZ = 11;
        roundData.players.endZ = 25;
        roundData.players.playerZ = 10;

        itemLight.visible = true;
        itemLight.gotoAndStop('red');
        gameData.doll.gotoAndPlay('idle');
    }else if(gameData.roundNum == 2){
        roundData.followCamera = true;
        roundData.players.startZ = 11;
        roundData.players.endZ = 25;
        roundData.players.playerZ = 10;

        chooseRandomCandy();
    }else if(gameData.roundNum == 3){
        worldContainer.y = -100;
        
        roundData.followCamera = false;
        roundData.players.startZ = 8;
        roundData.players.endZ = 10;
        roundData.players.playerZ = 7;

        roundData.turnArr = [];
        var halfPeople = Math.floor(gameSettings.game3.players/2);
        var tugSegment = defaultGameData.tugStart - defaultGameData.tugGap;

        var oppositeCon = false;
        for(var n=0; n<gameSettings.game3.players; n++){
            if(!oppositeCon){
                tugSegment--;
            }else{
                tugSegment++;
            }

            roundData.turnArr.push(tugSegment);
            if(n >= halfPeople-1 && !oppositeCon){
                oppositeCon = true;
                tugSegment = (defaultGameData.tugStart + defaultGameData.tugHole) + defaultGameData.tugGap;
            }
        }

        roundData.totalPlayers += 1;
        roundData.turnArr.push(defaultGameData.tugStart + (defaultGameData.tugHole/2));
        
        roundData.playerSet = true;
        itemLight.visible = true;
        resetPath();
    }else if(gameData.roundNum == 4){
        roundData.followCamera = true;
        roundData.players.startZ = 11;
        roundData.players.endZ = 25;
        roundData.players.playerZ = 10;
        
    }else if(gameData.roundNum == 5){
        worldContainer.y = -100;
        
        roundData.followCamera = false;
        roundData.players.startZ = 8;
        roundData.players.endZ = 10;
        roundData.players.playerZ = 7;

        for(var n=0; n<gameSettings.game5.length; n++){
            roundData.bridgeData.seqArr.push({side:randomInt(0,1), step:false});
        }
        //console.log(roundData.bridgeData.seqArr);

        roundData.turnArr = [];
        var bridgeSegment = defaultGameData.bridgeStart-1;
        for(var n=0; n<gameSettings.game5.players; n++){
            roundData.turnArr.push(bridgeSegment);
            bridgeSegment--;
        }

        roundData.bridgeData.turnArr = [];
        for(var n=gameSettings.game5.players-1; n>=0; n--){
            roundData.bridgeData.turnArr.push(n);
        }
        
        roundData.playerSet = true;
        resetPath();
    }else if(gameData.roundNum == 6){
        roundData.followCamera = false;
        roundData.players.startZ = 7;
        roundData.players.endZ = 20;
        roundData.players.playerZ = 12;

        roundData.totalPlayers = 2;

        roundData.turnArr = [];
        roundData.turnArr.push(18);
        roundData.turnArr.push(18 + (gameSettings.game6.length - 5));

        roundData.playerSet = true;

        $.sprites['healthTypeTxt'+0].text = $.sprites['healthTypeShadowTxt'+0].text = '';
        $.sprites['healthTypeTxt'+1].text = $.sprites['healthTypeShadowTxt'+1].text = '';

        itemLight.visible = true;
        itemLight.gotoAndStop('red');
        updatePlayerHealthBar();

        healthContainer.visible = true;
    }

    timeData.oldTimer = -1;
    timeData.countdown = gameSettings['game'+gameData.roundNum].timer;
    timerTxt.text = millisecondsToTimeGame(timeData.countdown);

    changeGameViewport()
    resetWorld();
    resetPath();
}
