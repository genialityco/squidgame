import { viewport } from './main.js'; // Import viewport
import { isTablet } from './helpers/device.js'; // Import isTablet helper

import { levelContainer, numberContainer, moneyContainer, piggyContainer, candyContainer, healthContainer, handContainer, handHandsContainer, handButtonContainer, cacheContainer, gameRoundContainer, gameInstructContainer, canvasContainer, mainContainer, gameContainer, gameStatusContainer, worldContainer, resultContainer, confirmContainer} from './canvas.js';
import { buttonChoose, buttonNumberL, buttonNumberR, buttonLevel, buttonArrowL, buttonArrowR, buttonStart, buttonRestart, buttonFacebook, buttonTwitter, buttonWhatsapp, buttonFullscreen, buttonSoundOn, buttonSoundOff, buttonMusicOn, buttonMusicOff, buttonExit, buttonSettings, buttonConfirm, buttonCancel} from './canvas.js';
import { itemPiggy, itemTimer, itemLight, itemCandyCover, itemCandyBase, itemPixel, itemNeedle, itemControl, itemResult, itemResultP, itemExit, itemExitP, itemCenter} from './canvas.js';
import { numberTxt, levelTxt, roundTxt, roundShadowTxt, roundNameTxt, roundNameShadowTxt, instructionTxt, resultTitleTxt, resultScoreTxt, resultShareTxt, confirmMessageTxt} from './canvas.js';
import { pressMove, guideline, bg, logo,timerTxt, candyDrawing,buttonOdd, buttonEven} from './canvas.js';
import {canvasW,canvasH,stage,resizeCanvas} from './canvas.js';
import {renderBackground,renderSegment,renderSprite} from './renderMisc.js';
// import {randomInt, getIncrease,pad} from './plugins.js'
////////////////////////////////////////////////////////////
// GAMES
////////////////////////////////////////////////////////////
import {startGreenLightCount,startRedLightCount, loopPlayerDead} from './games/RedLightGame.js';
import {chooseRandomCandy,checkCandyDrawingPos,clearCandyDrawing,initCandyDrawingPos} from './games/CandyGame.js';
import {startTugGame, playerTugAction, endTugGame} from './games/TugGame.js';
import {resetMarbleGame,changeMarbleTurn,toggleHandStatus} from './games/MarbleGame.js';
import {startSurvivalGame,updatePlayerHealthBar,updatePlayerHealth,updatePlayerMoveSpeed,getOppAway,stopSurvivalRound} from './games/SurvivalGame.js';
import {moveFrontPlayer} from './games/BridgeGame.js';
/*!
 * 
 * GAME SETTING CUSTOMIZATION START
 * 
 */

export var gameSettings = {
	game0:{
		background:{
			base0: { src:'assets/bg_menu.png'},
			base1: { src:'assets/bg_empty.png'},
			base2: { src:'assets/bg_empty.png'},
			base3: { src:'assets/bg_empty.png'}
		},
		path:{
			width:2000,
			fogDensity:5,
			fog:'#F2F2F2',
			light:{base:'#F2F2F2', path:'#F2F2F2'},
			dark:{base:'#fff', path:'#fff'},
			end:'#B20000'
		},
		instruction:{color:'#000',x:0, y:0},
		players:50,
		levelSelect:true,
		chooseNumbers:true
	},
	game1:{
		name:'RED LIGHT, GREEN LIGHT',
		textColor:'#CC17B2',
		textShadowColor:'#6D2767',
		background:{
			base0: { src:'assets/bg_game1.png'},
			base1: { src:'assets/bg_game1_hill.png'},
			base2: { src:'assets/bg_cloud.png'},
			base3: { src:'assets/bg_game1_grass.png'}
		},
		items:{
			tree: { src:'assets/item_game1_tree.png'},
			doll: { src:'assets/game1_doll.png'}
		},
		path:{
			width:2000,
			fogDensity:5,
			fog:'#C1841C',
			light:{base:'#B5791A', path:'#F4DFA8'},
			dark:{base:'#C1841C', path:'#F7E6BB'},
			end:'#B20000'
		},
		instruction:{color:'#000', x:0, y:0},
		countTime:3,
		peekTime:3,
		decreaseTime:.2,
		players:50,
		length:85,
		dead:[5,15],
		timer:30000
	},
	game2:{
		name:'DALGONA CANDY',
		textColor:'#CC17B2',
		textShadowColor:'#6D2767',
		background:{
			base0: { src:'assets/bg_game1.png'},
			base1: { src:'assets/bg_game2_hill.png'},
			base2:   { src:'assets/bg_cloud.png'},
			base3: { src:'assets/bg_game2_playground.png'}
		},
		path:{
			width:2000,
			fogDensity:5,
			fog:'#C1841C',
			light:{base:'#F4DFA8', path:'#F4DFA8'},
			dark:{base:'#F7E6BB', path:'#F7E6BB'}
		},
		instruction:{color:'#000', x:0, y:33},
		players:20,
		candy:[
				{src:'assets/candy_01.png', finalSrc:'assets/candy_final_01.png', checkpoint:[{x:95,y:340},{x:397,y:340},{x:246,y:85}]},
				{src:'assets/candy_02.png', finalSrc:'assets/candy_final_02.png', checkpoint:[{x:244,y:90},{x:407,y:209},{x:345,y:396},{x:145,y:396},{x:85,y:208}]},
				{src:'assets/candy_03.png', finalSrc:'assets/candy_final_03.png', checkpoint:[{x:243,y:86},{x:125,y:348},{x:369,y:334}]},
				{src:'assets/candy_04.png', finalSrc:'assets/candy_final_04.png', checkpoint:[{x:243,y:64},{x:428,y:228},{x:208,y:416},{x:60,y:224}]}
		],
		drawColor:'#A66B35',
		drawStroke:20,
		timer:30000
	},
	game3:{
		name:'TUG OF WAR',
		textColor:'#CC17B2',
		textShadowColor:'#6D2767',
		background:{
			base0: { src:'assets/bg_game3.png'},
			base1: { src:'assets/bg_empty.png'},
			base2:   { src:'assets/bg_empty.png'},
			base3: { src:'assets/bg_empty.png'}
		},
		items:{
			construct: { src:'assets/item_construct.png'}
		},
		path:{
			width:1000,
			fogDensity:5,
			fog:'#333',
			light:{base:'', path:'#646473', rope:'#D96D00', side:'#FF9921'},
			dark:{base:'', path:'#5F5F6D', rope:'#BB5E00', side:'#303031'}
		},
		instruction:{color:'#fff', x:0, y:5},
		players:20,
		oppSpeed:[10, 20],
		userSpeed:[20, 35],
		timer:30000
	},
	game4:{
		name:'MARBLE GAME',
		textColor:'#CC17B2',
		textShadowColor:'#6D2767',
		background:{
			base0: { src:'assets/bg_game4.png'},
			base1: { src:'assets/bg_game4_hill.png'},
			base2:   { src:'assets/bg_empty.png'},
			base3: { src:'assets/bg_game4_house.png'}
		},
		path:{
			width:2000,
			fogDensity:5,
			fog:'#C1841C',
			light:{base:'#E49F5E', path:'#E49F5E'},
			dark:{base:'#E29752', path:'#E29752'}
		},
		instruction:{color:'#000', x:0, y:0},
		status:{totalColor:'#000', playerColor:'#333', statusColor:'#333'},
		players:20,
		totalBall:3,
		timer:60000
	},
	game5:{
		name:'GLASS BRIDGE',
		textColor:'#CC17B2',
		textShadowColor:'#6D2767',
		background:{
			base0: { src:'assets/bg_game5.png'},
			base1: { src:'assets/bg_game5_light1.png'},
			base2:   { src:'assets/bg_game5_light2.png'},
			base3: { src:'assets/bg_empty.png'}
		},
		items:{
			booth: { src:'assets/item_booth.png'}
		},
		path:{
			width:1000,
			fogDensity:5,
			fog:'#001A24',
			light:{base:'', path:'#00202D', glass:'#ccc', holder:'#2F1700'},
			dark:{base:'', path:'#001D28', glass:'', holder:'#2F1700'}
		},
		instruction:{color:'#fff', x:0, y:5},
		glassAlpha:.3,
		players:10,
		length:15,
		timer:60000
	},
	game6:{
		name:'SURVIVAL GAME',
		textColor:'#CC17B2',
		textShadowColor:'#6D2767',
		background:{
			base0: { src:'assets/bg_game6.png'},
			base1: { src:'assets/bg_game6_hill.png'},
			base2: { src:'assets/bg_empty.png'},
			base3: { src:'assets/bg_game6_tree.png'}
		},
		path:{
			width:2000,
			fogDensity:5,
			fog:'#8C886B',
			light:{base:'#9B977B', path:'#9B977B', line:'#fff'},
			dark:{base:'#8C886B', path:'#8C886B', line:'#F3F3F3'},
			end:'#fff'
		},
		bar:{background:'#fff', empty:'#ccc', health:'#238C00', blood:'#D90000', playerColor:'#333', turnColor:'#fff', turnShadowColor:'#333'},
		instruction:{color:'#000', x:0, y:5},
		length:30,
		timer:15000
	}
}

//player assets
export var players_arr = [
	{ src: 'assets/player.png' }
];

export var guards_arr = [
	{ src: 'assets/guard.png' }
];

//game text desiplay
export var gameTextDisplay = {
	round:'Round [NUMBER]',
	roundFinal:'Final Round',
	game1:'Hold to run',
	game2:'Hold to cut',
	game3:'Tap repeatly to pull',
	game4:'Win all marble balls',
	game5:'Tap left / right to move',
	game6:'Hold controller to move',
	user:'User',
	opponent:'Opponent',
	odd:'ODD',
	even:'EVEN',
	kill:'ATTACK',
	run:'SURVIVE',
	roundFail:'GAME OVER',
	roundComplete:'COMPLETE',
	exitMessage:'Are you sure\nyou want to quit?',
	resultFailTitle:'YOU ARE DEAD',
	resultFailDesc:'GAME OVER',
	resultWinTitle:'YOU WON',
	resultWinDesc:'45.6 BILLION'
}

//result custom score
export var gameCustomScore = {
	status:false,
	text:'[SCORE] BILLION'
};

//Social share, [SCORE] will replace with game score
export var shareEnable = true; //toggle share
export var shareText = 'SHARE YOUR SCORE'; //social share message
export var shareWinTitle = 'I won 45.6 billion on Survival Game.';//social share score title
export var shareWinMessage = 'I won 45.6 billion on Survival Game! Try it now!'; //social share score message
export var shareTitle = 'High score on Survival Game is ROUND [SCORE].';//social share score title
export var shareMessage = 'ROUND [SCORE] is my new high score on Survival Game! Try it now!'; //social share score message
				
/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */
export var dt;
export var defaultData = {width:0,
				height:0,
				scale:0.00145,
				viewport:{landscape:{w:1280, h:840, scale:0.00125}, portrait:{w:768, h:840, scale:0.00205}},
				extraHeight:500,
				centrifugal:.3,
				bgSpeed:0,
				skySpeed:0.001,
				hillSpeed:0.002,
				treeSpeed:0.003,
				bgOffset:0,
				skyOffset:0,
				hillOffset:0,
				treeOffset:0,
				segmentLength:100,
				trackLength:null,
				fieldOfView:100,
				cameraHeight:800,
				cameraDepth:null,
				drawDistance:100,
				playerX:0,
				playerZ:0,
				position:0,
				speed:0,
				maxSpeed:0,
				accel:0,
				breaking:0,
				decel:0,
				offRoadDecel:0,
				offRoadLimit:0,
				turnSpeed:.005,
				lastY:0
				};

export var defaultGameData = {
						playerSpeed:[500,1500],
						sandTime:[5,10],
						ropeWidth:1,
						ropeY:0,
						tugStart:16,
						tugGap:2,
						tugHole:4,
						bridgeStart:16,
						bridgeSteps:4,
						bridgeGlassWidth:30,
						bridgeGlassHoldWidth:7,
						bridgeGlassHoldSpace:3,
						survivalStart:16,
						survivalSpeed:1200,
						survivalSplitPercent:75,
						survivalBarW:150,
						survivalBarH:25,
						survivalBarBorder:3,
}
				
var worldData = {};
var segments = [];
export var players = [];
var background = null;
var sprites = null;
var resolution = null;
var currentLapTime = 0;

export var playerData = {win:false, bestTime:0, score:0};
export var gameData = {paused:true, money:[], roundNum:0, ended:false, totalRound:6};
export var timeData = {enable:false, startDate:null, nowDate:null, timer:0, oldTimer:0};
export var roundData = {players:{}, lightData:{forward:false, stop:false, moveTween:{}, timeTween:{}}, tugData:{moveTween:{}}, candyData:{}, bridgeData:{}, marbleData:{}, survivalData:{}};
export var collisionMethod = ndgmr.checkPixelCollision;

/*!
 * 
 * GAME BUTTONS - This is the function that runs to setup button event
 * 
 */
export function buildGameButton(){
	$(window).focus(function() {
		if(!buttonSoundOn.visible){
			toggleSoundInMute(false);
		}

		if (typeof buttonMusicOn != "undefined") {
			if(!buttonMusicOn.visible){
				toggleMusicInMute(false);
			}
		}
	});
	
	$(window).blur(function() {
		if(!buttonSoundOn.visible){
			toggleSoundInMute(true);
		}

		if (typeof buttonMusicOn != "undefined") {
			if(!buttonMusicOn.visible){
				toggleMusicInMute(true);
			}
		}
	});

	if($.browser.mobile || isTablet()){
		
	}else{
		
	}
	
	buttonStart.cursor = "pointer";
	buttonStart.addEventListener("click", function(evt) {
		playSound('soundClick');
		if(gameSettings.game0.chooseNumbers){
			displayChooseNumber();
		}else{
			goPage('game');
		}
	});

	buttonChoose.cursor = "pointer";
	buttonChoose.addEventListener("click", function(evt) {
		playSound('soundClick');
		goPage('game');
	});
	
	buttonFacebook.cursor = "pointer";
	buttonFacebook.addEventListener("click", function(evt) {
		share('facebook');
	});
	buttonTwitter.cursor = "pointer";
	buttonTwitter.addEventListener("click", function(evt) {
		share('twitter');
	});
	buttonWhatsapp.cursor = "pointer";
	buttonWhatsapp.addEventListener("click", function(evt) {
		share('whatsapp');
	});
	
	buttonSoundOff.cursor = "pointer";
	buttonSoundOff.addEventListener("click", function(evt) {
		toggleSoundMute(true);
	});
	
	buttonSoundOn.cursor = "pointer";
	buttonSoundOn.addEventListener("click", function(evt) {
		toggleSoundMute(false);
	});

	if (typeof buttonMusicOff != "undefined") {
		buttonMusicOff.cursor = "pointer";
		buttonMusicOff.addEventListener("click", function(evt) {
			toggleMusicMute(true);
		});
	}
	
	if (typeof buttonMusicOn != "undefined") {
		buttonMusicOn.cursor = "pointer";
		buttonMusicOn.addEventListener("click", function(evt) {
			toggleMusicMute(false);
		});
	}
	
	buttonFullscreen.cursor = "pointer";
	buttonFullscreen.addEventListener("click", function(evt) {
		toggleFullScreen();
	});
	
	buttonExit.cursor = "pointer";
	buttonExit.addEventListener("click", function(evt) {
		playSound('soundClick');
		toggleConfirm(true);
	});
	
	buttonSettings.cursor = "pointer";
	buttonSettings.addEventListener("click", function(evt) {
		toggleOption();
	});
	
	buttonConfirm.cursor = "pointer";
	buttonConfirm.addEventListener("click", function(evt) {
		playSound('soundClick');
		toggleConfirm(false);
		stopGame(true);
		goPage('main');
	});
	
	buttonCancel.cursor = "pointer";
	buttonCancel.addEventListener("click", function(evt) {
		playSound('soundClick');
		toggleConfirm(false);
	});
	
	buttonRestart.cursor = "pointer";
	buttonRestart.addEventListener("click", function(evt) {
		playSound('soundClick');
		goPage('main');
	});

	pressMove.addEventListener("click", function(evt) {
		toggleGameControl('click', true);
	});

	pressMove.addEventListener("mousedown", function(evt) {
		toggleGameControl('mousedown');
	});

	pressMove.addEventListener("pressup", function(evt) {
		toggleGameControl('pressup');
	});

	itemCandyBase.addEventListener("mousedown", function(event) {
		if(!gameData.interact){
			return;
		}

		toggleGameInstruction(false);

		roundData.candyData.draw = true;
		roundData.candyData.lastPoint = {x:0, y:0};
		roundData.candyData.lastPoint.x = itemNeedle.x = event.stageX - (canvasW/2);
		roundData.candyData.lastPoint.y = itemNeedle.y = event.stageY - (canvasH/2);
		candyDrawing.graphics.ss(gameSettings.game2.drawStroke, "round").s(gameSettings.game2.drawColor);

		initCandyDrawingPos(event.stageX - (canvasW/2), event.stageY - (canvasH/2));
	});

	itemCandyBase.addEventListener("pressmove", function(event){
		if(roundData.candyData.draw){
			candyDrawing.graphics.mt(roundData.candyData.lastPoint.x, roundData.candyData.lastPoint.y);        
			candyDrawing.graphics.lt(event.stageX - (canvasW/2), event.stageY - (canvasH/2));

			checkCandyDrawingPos(event.stageX - (canvasW/2), event.stageY - (canvasH/2));
			itemPixel.x = event.stageX - (canvasW/2);
			itemPixel.y = event.stageY - (canvasH/2);
			
			var mouseDistance = getDistance(roundData.candyData.lastPoint.x, roundData.candyData.lastPoint.y, event.stageX - (canvasW/2), event.stageY - (canvasH/2));
			var intersection1 = ndgmr.checkPixelCollision(itemPixel, $.sprites['candy'+roundData.candyData.candyNum]);
			if(intersection1){
				if(mouseDistance >= 1.5){
					var randomFrame = Math.floor(Math.random()*3);
					playSound('soundCrack'+(randomFrame+1));
				}
			}else{
				playSound('soundCrackError');
				clearCandyDrawing();
			}
			
			roundData.candyData.lastPoint.x = itemNeedle.x = event.stageX - (canvasW/2);
			roundData.candyData.lastPoint.y = itemNeedle.y = event.stageY - (canvasH/2);
		}
	});

	itemCandyBase.addEventListener("pressup", function(event){
		clearCandyDrawing();
	});

	buttonOdd.cursor = "pointer";
	buttonOdd.addEventListener("click", function(evt) {
		if(!gameData.interact){
			return;
		}
		toggleHandStatus(false);
	});

	buttonEven.cursor = "pointer";
	buttonEven.addEventListener("click", function(evt) {
		if(!gameData.interact){
			return;
		}
		toggleHandStatus(true);
	});

	if(gameSettings.game0.levelSelect){
		itemPiggy.addEventListener("click", function(evt) {
			buttonStart.visible = false;
			levelContainer.visible = true;
			logo.visible = true;
			numberContainer.visible = false;
		});
	}

	buttonLevel.cursor = "pointer";
	buttonLevel.addEventListener("click", function(evt) {
		playSound('soundClick');
		goPage('game');
	});

	buttonArrowL.cursor = "pointer";
	buttonArrowL.addEventListener("click", function(evt) {
		playSound('soundClick');
		toggleRound(false);
	});

	buttonArrowR.cursor = "pointer";
	buttonArrowR.addEventListener("click", function(evt) {
		playSound('soundClick');
		toggleRound(true);
	});

	buttonNumberL.cursor = "pointer";
	buttonNumberL.addEventListener("mousedown", function(evt) {
		playSound('soundClick');
		toggleChooseNumber(false);
	});
	buttonNumberL.addEventListener("pressup", function(evt) {
		toggleChooseNumber();
	});

	buttonNumberR.cursor = "pointer";
	buttonNumberR.addEventListener("mousedown", function(evt) {
		playSound('soundClick');
		toggleChooseNumber(true);
	});
	buttonNumberR.addEventListener("pressup", function(evt) {
		toggleChooseNumber();
	});

	loopPiggyMoney();
}

function appendFocusFrame(){
	$('#mainHolder').prepend('<div id="focus" style="position:absolute; width:100%; height:100%; z-index:1000;"></div');
	$('#focus').click(function(){
		$('#focus').remove();
	});	
}

function toggleRound(con){
	if(con){
		gameData.roundSelect++;
		gameData.roundSelect = gameData.roundSelect >= gameData.totalRound ? gameData.totalRound : gameData.roundSelect;
	}else{
		gameData.roundSelect--;
		gameData.roundSelect = gameData.roundSelect < 1 ? 1 : gameData.roundSelect;
	}

	if(gameData.roundSelect == 6){
		levelTxt.text = gameTextDisplay.roundFinal.replace('[NUMBER]', gameData.roundSelect);
	}else{
		levelTxt.text = gameTextDisplay.round.replace('[NUMBER]', gameData.roundSelect);
	}
}

/*!
 * 
 * DISPLAY PAGES - This is the function that runs to display pages
 * 
 */
export var curPage=''
export function goPage(page){
	curPage=page;
	
	levelContainer.visible = false;
	numberContainer.visible = false;
	mainContainer.visible = false;
	gameContainer.visible = false;
	resultContainer.visible = false;
	piggyContainer.visible = false;
	
	var targetContainer = null;
	switch(page){
		case 'main':
			targetContainer = mainContainer;
			roundData.playerNumber = randomPlayerNumber();
			logo.visible = true;
			buttonStart.visible = true;
			piggyContainer.visible = true;
			gameData.roundNum = 0;
			gameData.roundSelect = 0;
			toggleRound(true);
			prepareRound();
			resetWorld();
			playMusicLoop('musicGame');
		break;
		
		case 'game':
			targetContainer = gameContainer;
			gameData.roundNum = gameData.roundSelect;

			stopMusicLoop('musicGame');
			startGame();
		break;
		
		case 'result':
			targetContainer = resultContainer;
			stopGame(true);
			
			if(playerData.win){
				playSound('soundWin');
				resultTitleTxt.text = gameTextDisplay.resultWinTitle;
				resultScoreTxt.text = gameTextDisplay.resultWinDesc;
			}else{
				resultTitleTxt.text = gameTextDisplay.resultFailTitle;
				resultScoreTxt.text = gameTextDisplay.resultFailDesc;
			}

			if(gameCustomScore.status){
				resultScoreTxt.text = gameCustomScore.text.replace('[SCORE]', playerData.score);
				saveGame(playerData.score);
			}else{
				saveGame(gameData.roundNum);
			}
		break;
	}
	
	if(targetContainer != null){
		targetContainer.visible = true;
		targetContainer.alpha = 0;
		TweenMax.to(targetContainer, .5, {alpha:1, overwrite:true});
	}
	
	resizeCanvas();
}

export function toggleConfirm(con){
	confirmContainer.visible = con;
	
	if(con){
		TweenMax.pauseAll(true, true);
		gameData.paused = true;
	}else{
		TweenMax.resumeAll(true, true);
		if(curPage == 'game'){
			gameData.paused = false;
		}
	}
}

function loopPiggyMoney(){
	gameData.money = [];

	for(var n=0; n<10; n++){
		var moneyIndex = Math.floor(Math.random()*4);

		var newMoney = $.money['itemMoney'+(moneyIndex+1)].clone();
		newMoney.x = randomInt(-25,10);
		newMoney.y = newMoney.oriY = -400;
		newMoney.maxY = -100;
		newMoney.speed = randomInt(5,15);
		newMoney.rotateSpeed = randomInt(-15,15);

		moneyContainer.addChild(newMoney);
		gameData.money.push(newMoney);
	}
}

export function displayChooseNumber(){
	logo.visible = false;
	buttonStart.visible = false;
	numberContainer.visible = true;

	chooseNumberData.number = randomInt(1, 999);
	numberTxt.text = pad(chooseNumberData.number, 3);
}

var chooseNumberData = {interval:null, number:0, timer:0, max:100, mix:1, bet:0};
export function toggleChooseNumber(con){
	if(con){
		roundData.bet = 1;
	}else if(!con){
		roundData.bet = -(1);
	}else{
		roundData.bet = 0;	
	}
	
	if(con != undefined){
		chooseNumberData.timer = chooseNumberData.max;
		loopChooseNumber();
	}else{
		clearInterval(chooseNumberData.interval);	
		chooseNumberData.interval = null;
	}
}

function loopChooseNumber(){
	clearInterval(chooseNumberData.interval);
	chooseNumberData.interval = setInterval(loopChooseNumber, chooseNumberData.timer);
	chooseNumberData.timer-=10;
	chooseNumberData.timer=chooseNumberData.timer<chooseNumberData.min?chooseNumberData.max:chooseNumberData.timer;
	
	updateChooseNumber();
}

function updateChooseNumber(){
	chooseNumberData.number += roundData.bet;
	chooseNumberData.number = chooseNumberData.number <= 1 ? 1 : chooseNumberData.number;
	chooseNumberData.number = chooseNumberData.number >= 999 ? 999 : chooseNumberData.number;
	
	roundData.playerNumber = pad(chooseNumberData.number, 3);
	numberTxt.text = roundData.playerNumber;
}

/*!
 * 
 * START GAME - This is the function that runs to start play game
 * 
 */

export function startGame(){
	playerData.win = false;
	gameData.paused = false;
	gameData.ended = false;
	gameData.interact = false;
	
	prepareRound();
	displayGameRound(true);
	startPanCamera();
}

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

export function changeGameViewport(){
	if(viewport.isLandscape){
		//landscape
		if(gameData.roundNum == 0){
			roundData.camera = 750;
		}else if(gameData.roundNum == 1){
			roundData.camera = 550;
		}else if(gameData.roundNum == 2){
			roundData.camera = 550;
			roundData.players.playerZ = 10;
		}else if(gameData.roundNum == 3){
			roundData.camera = 550;
		}else if(gameData.roundNum == 4){
			roundData.camera = 550;
			roundData.players.playerZ = 10;
		}else if(gameData.roundNum == 5){
			roundData.camera = 550;
		}else if(gameData.roundNum == 6){
			roundData.camera = 750;
		}
	}else{
		//portrait
		if(gameData.roundNum == 0){
			roundData.camera = 700;
		}else if(gameData.roundNum == 1){
			roundData.camera = 700;
		}else if(gameData.roundNum == 2){
			roundData.camera = 700;
			roundData.players.playerZ = 6;
		}else if(gameData.roundNum == 3){
			roundData.camera = 700;
		}else if(gameData.roundNum == 4){
			roundData.camera = 700;
			roundData.players.playerZ = 6;
		}else if(gameData.roundNum == 5){
			roundData.camera = 700;
		}else if(gameData.roundNum == 6){
			roundData.camera = 700;
		}
	}

	defaultData.cameraHeight = roundData.camera;
}

 /*!!
 * 
 * DISPLAY GAME ROUND - This is the function that runs to display game round
 * 
 */
function displayGameRound(round, win){
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

 /*!!
 * 
 * GAME INSTRUCTION - This is the function that runs to show game instruction
 * 
 */
export function toggleGameInstruction(con){
	instructionTxt.text = gameTextDisplay['game'+gameData.roundNum];
	instructionTxt.color = gameSettings['game'+gameData.roundNum].instruction.color;

	var alphaNum = con == true ? 1 : 0;
	TweenMax.to(gameInstructContainer, .5, {alpha:alphaNum, overwrite:true, onComplete:function(){
			
	}});

	resizeGameWorld();
}

function resizeGameWorld(){
	instructionTxt.x = canvasW/100 * gameSettings['game'+gameData.roundNum].instruction.x;
	instructionTxt.y = canvasH/100 * gameSettings['game'+gameData.roundNum].instruction.y;

	if(gameData.roundNum == 6){
		if(viewport.isLandscape){
			worldContainer.y = -150;
		}else{
			worldContainer.y = 0;
		}
	}
}

 /*!!
 * 
 * GAME CAMERA ANIMATE - This is the function that runs to animate game camera
 * 
 */
export function startPanCamera(){
	if(gameData.roundNum == 1){
		roundData.followCamera = false;

		var totalLength = gameSettings.game1.length;
		defaultData.position = (totalLength - (totalLength/5)) * defaultData.segmentLength;

		TweenMax.to(defaultData, 2, {delay:1, position:0, overwrite:true, onComplete:function(){
			roundData.followCamera = true;
			TweenMax.to(defaultData, 1, {overwrite:true, onComplete:function(){
				startGameRound();
			}});
		}});
	}else if(gameData.roundNum == 2){
		TweenMax.to(defaultData, 2, {delay:1, overwrite:true, onComplete:function(){
			startGameRound();
		}});
	}else if(gameData.roundNum == 3){
		defaultData.position = (defaultGameData.tugStart * 2) * defaultData.segmentLength;
		var totalLength = (defaultGameData.tugStart - 10) * defaultData.segmentLength;
		TweenMax.to(defaultData, 2, {position:totalLength, overwrite:true, onComplete:function(){
			roundData.followCamera = true;
			TweenMax.to(defaultData, 1, {overwrite:true, onComplete:function(){
				startGameRound();
			}});
		}});
	}else if(gameData.roundNum == 4){
		TweenMax.to(defaultData, 1, {delay:1, overwrite:true, onComplete:function(){
			startGameRound();
		}});
	}else if(gameData.roundNum == 5){
		var totalLength = (6) * defaultData.segmentLength;

		TweenMax.to(defaultData, 2, {position:totalLength, overwrite:true, onComplete:function(){
			startGameRound();
		}});
	}else if(gameData.roundNum == 6){
		var totalLength = defaultGameData.survivalStart + gameSettings.game6.length;
		defaultData.position = (totalLength - (totalLength/5)) * defaultData.segmentLength;

		TweenMax.to(defaultData, 2, {position:(6) * defaultData.segmentLength, overwrite:true, onComplete:function(){
			roundData.followCamera = true;
			startSurvivalGame();
		}});
	}
}


function loopPlayrMoveTimer(){
    TweenMax.to(roundData.lightData.moveTween, .1, {overwrite:true, onComplete:function(){
        loopPlayrMoveTimer();
        updatePlayerTime();
    }});
}

function updatePlayerTime(){
    for(var n=1; n<players.length; n++){
        if(players[n].moveTime > 0){
            players[n].moveTime -= 100;
        }
    }
}

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

 /*!!
 * 
 * RED LIGHT GREEN LIGHT GAME - This is the function that runs for red light green light game
 * 
 */

 /*!!
 * 
 * BRIDGE GAME - This is the function that runs for bridge game
 * 
 */

 /*!!
 * 
 * TUG OF WAR GAME - This is the function that runs for tug of war game
 * 
 */

 /*!!
 * 
 * SURVIVAL GAME - This is the function that runs for survival game
 * 
 */

/*!
 * 
 * STOP GAME - This is the function that runs to stop play game
 * 
 */

 /*!!
 * 
 * MARBLE GAME - This is the function that runs for marble game
 * 
 */

export function stopGame(){
	gameData.paused = true;

	toggleChooseNumber();
	stopSoundLoop('soundRope');
	toggleGameTimer(false);
	TweenMax.killAll();
}

/*!
 * 
 * SAVE GAME - This is the function that runs to save game
 * 
 */
export function saveGame(score){
	if ( typeof toggleScoreboardSave == 'function' ) { 
		$.scoreData.score = score;
		if(typeof type != 'undefined'){
			$.scoreData.type = type;	
		}
		toggleScoreboardSave(true);
	}

	/*$.ajax({
      type: "POST",
      url: 'saveResults.php',
      data: {score:score},
      success: function (result) {
          console.log(result);
      }
    });*/
}

/*!
 * 
 * LOOP UPDATE GAME - This is the function that runs to update game loop
 * 
 */
export function updateGame(){
	
	for(var n=0; n<gameData.money.length; n++){
		var thisMoney = gameData.money[n];
		thisMoney.y += thisMoney.speed;
		thisMoney.rotation += thisMoney.rotateSpeed;

		if(thisMoney.y > thisMoney.maxY){
			thisMoney.rotation = 0;
			thisMoney.y = thisMoney.oriY;
		}
	}
	
	if(curPage == 'game'){
		if(!gameData.paused){
			updateWorld();
		}
	}else{
		updateWorld();
	}
	
	if(!gameData.paused){
		if(timeData.enable){
			timeData.nowDate = new Date();
			timeData.elapsedTime = Math.floor((timeData.nowDate.getTime() - timeData.startDate.getTime()));
			timeData.timer = Math.floor((timeData.countdown) - (timeData.elapsedTime));
			
			if(timeData.oldTimer == -1){
				timeData.oldTimer = timeData.timer;
			}
	
			if(timeData.timer <= 0){
				//stop
				if(gameData.roundNum == 6){
					stopSurvivalRound();
				}else{
					endGame(false, true);
				}
			}else{
				if((timeData.oldTimer - timeData.timer) > 1000){
					if(timeData.timer < 1000){
						playSound('soundCountdownEnd');
					}else if(timeData.timer < 6000){
						playSound('soundCountdownClose');
					}else{
						//playSound('soundCountdown');	
					}
					timeData.oldTimer = timeData.timer;
				}
				
				timerTxt.text = millisecondsToTimeGame(timeData.timer);
			}
		}
	}
}

/*!
 * 
 * GAME TIMER - This is the function that runs for game timer
 * 
 */
export function toggleGameTimer(con){	
	if(con){
		timeData.startDate = new Date();
	}else{
		
	}
	timeData.enable = con;
}

/*!
 * 
 * UPDATE WORLD - This is the function that runs to update game world
 * 
 */
function updateWorld(){
	updateSprites();
	renderWorld();
}

function updateSprites() {
  	var n;
	var dt = (1/60);
	var playerSegment = findSegment((defaultData.position+defaultData.playerZ));
	var playerW = 90 * defaultData.scale;
	var speedPercent  = defaultData.speed/worldData.maxSpeed;
	var stageMouseX = (stage.mouseX - (canvasW/2)) * defaultData.turnSpeed;
	var dx = dt * Math.abs(stageMouseX) * speedPercent;
	var startPosition = defaultData.position;
	
	updatePlayers(dt);
	
	defaultData.position = getIncrease(defaultData.position, dt * defaultData.speed, defaultData.trackLength);
	
	if(gameData.roundNum == 6){
		var controlX = stage.mouseX - (canvasW/2);
		if(Math.abs(controlX) > 40 && roundData.survivalData.move){
			dx = 0.008;
		}
	}

	if (stageMouseX < 0){
		defaultData.playerX = defaultData.playerX - dx;
	}else{
		defaultData.playerX = defaultData.playerX + dx;
	}
	
	defaultData.playerX = defaultData.playerX - (dx * speedPercent * playerSegment.curve * defaultData.centrifugal);
	
	if (roundData.lightData.forward){
		defaultData.speed = getAccelerate(defaultData.speed, worldData.accel, dt);
	}else if (roundData.lightData.stop){
		defaultData.speed = getAccelerate(defaultData.speed, defaultData.breaking, dt);
	}else{
		defaultData.speed = getAccelerate(defaultData.speed, defaultData.decel, dt);
	}
	
	if ((defaultData.playerX < -1) || (defaultData.playerX > 1)) {
		if (defaultData.speed > defaultData.offRoadLimit)
			defaultData.speed = getAccelerate(defaultData.speed, defaultData.offRoadDecel, dt);
	}

	if(gameData.roundNum == 1){
		for(n = 0 ; n < playerSegment.players.length ; n++) {
			let player  = playerSegment.players[n];
			if(player.index != 0){
				let thisPlayerW = player.sprite.w * defaultData.scale;
				if (defaultData.speed > player.speed) {
					if (getOverlap(defaultData.playerX, playerW, player.offset, thisPlayerW, 0.8)) {
						defaultData.speed    = player.speed * (player.speed/defaultData.speed);
						defaultData.position = getIncrease(player.z, -defaultData.playerZ, defaultData.trackLength);
						break;
					}
				}
			}
		}
	}

	defaultData.playerX = getLimit(defaultData.playerX, -2, 2);// dont ever let it go too far out of bound
	defaultData.speed = getLimit(defaultData.speed, 0, worldData.maxSpeed); // or exceed defaultData.maxSpeed
	
	defaultData.skyOffset  = getIncrease(defaultData.skyOffset,  defaultData.skySpeed  * playerSegment.curve * (defaultData.position-startPosition)/defaultData.segmentLength, 1);
	defaultData.hillOffset = getIncrease(defaultData.hillOffset, defaultData.hillSpeed * playerSegment.curve * (defaultData.position-startPosition)/defaultData.segmentLength, 1);
	defaultData.treeOffset = getIncrease(defaultData.treeOffset, defaultData.treeSpeed * playerSegment.curve * (defaultData.position-startPosition)/defaultData.segmentLength, 1);
	
	if (defaultData.position > defaultData.playerZ) {
		if (currentLapTime && (startPosition < defaultData.playerZ)) {

		}else {
          currentLapTime += dt;
        }
	}
}

function updatePlayers(dt) {
	var n, player, oldSegment, newSegment;
	for(n = 0 ; n < players.length ; n++) {
		player         = players[n];
		oldSegment  = findSegment(player.z);

		if(gameData.roundNum == 1){
			if(n == 0){
				if(roundData.followCamera){
					player.z = defaultData.position + (roundData.players.playerZ * defaultData.segmentLength);
					player.offset = defaultData.playerX;
					
					if(player.z > gameSettings.game1.length * 100){
						endGame(true, false);
					}else{
						if(!roundData.lightData.moveCon){
							if(defaultData.speed > 50){
								endGame(false, false);
							}
						}

						if(defaultData.speed > 0){
							if(player.sandTime > 0){
								player.sandTime--;
							}else{
								player.sandTime = randomInt(defaultGameData.sandTime[0], defaultGameData.sandTime[1]);
								var randomFrame = Math.floor(Math.random()*3);
								playSound('soundSand'+(randomFrame+1));
							}
						}
					}
				}else{
					player.z = 0 + (roundData.players.playerZ * defaultData.segmentLength);
					player.offset = defaultData.playerX;
				}
			}else{
				if(player.z > gameSettings.game1.length * 100){
					player.status = 'complete';
				}

				if(player.status != 'dead'){
					if(player.moveTime > 0){
						updatePlayerFrame(n, 'run');
						player.z = getIncrease(player.z, dt * player.speed, defaultData.trackLength);

						if(player.sandTime > 0){
							player.sandTime--;
						}else{
							player.sandTime = randomInt(defaultGameData.sandTime[0], defaultGameData.sandTime[1]);
							var randomFrame = Math.floor(Math.random()*3);
							//playSound('soundSand'+(randomFrame+1));
						}
					}else{
						updatePlayerFrame(n, 'idle');
					}
				}
			}
		}else if(gameData.roundNum == 2){
			if(n == 0){
				if(roundData.followCamera){
					player.z = defaultData.position + (roundData.players.playerZ * defaultData.segmentLength);
					player.offset = defaultData.playerX;
				}else{
					player.z = 0 + (roundData.players.playerZ * defaultData.segmentLength);
					player.offset = defaultData.playerX;
				}
			}
		}else if(gameData.roundNum == 3){
				if(player.status == ''){
					player.speed = roundData.tugData.speed;
				}

				player.z = getIncrease(player.z, dt * player.speed, defaultData.trackLength);
				if(roundData.followCamera && n == 0){
					defaultData.position = (player.z - (7 * defaultData.segmentLength));
				}
				
				var startZ = defaultGameData.tugStart* worldData.segmentLength ;
				var endZ = (defaultGameData.tugStart + defaultGameData.tugHole + (defaultGameData.tugGap/2)) * worldData.segmentLength;
				if(n != players.length-1){
					if(player.z > startZ && player.z < endZ){
						if(player.active){
							player.speed = 0;
							player.status = 'dead';
							player.active = false;

							var randomFrame = Math.floor(Math.random()*3);
							playSound('soundScream'+(randomFrame+1));
						}
							
						endTugGame();
					}
				}
			}else if(gameData.roundNum == 4){
				if(n == 0){
					if(roundData.followCamera){
						player.z = defaultData.position + (roundData.players.playerZ * defaultData.segmentLength);
						player.offset = defaultData.playerX;
					}else{
						player.z = 0 + (roundData.players.playerZ * defaultData.segmentLength);
						player.offset = defaultData.playerX;
					}
				}
			}else if(gameData.roundNum == 6){
			if(n == 0){
				if(roundData.followCamera){
					defaultData.position = (player.z - (12 * defaultData.segmentLength));
				}

				if(player.status == ''){
					if(roundData.survivalData.move){
						var moveSpeed = defaultGameData.survivalSpeed;
						defaultData.speed = moveSpeed;

						if(stage.mouseY > (canvasH/100 * defaultGameData.survivalSplitPercent)){
							updatePlayerFrame(0, 'frontrun');
							moveSpeed = -moveSpeed;
						}else{
							updatePlayerFrame(0, 'run');
						}

						player.speed = moveSpeed;
					}else{
						updatePlayerFrame(0, 'idle')
						defaultData.speed = player.speed = 0;
					}

					player.z = getIncrease(player.z, dt * player.speed, defaultData.trackLength);
					player.offset = defaultData.playerX;

					if(defaultData.speed > 0){
						if(player.sandTime > 0){
							player.sandTime--;
						}else{
							player.sandTime = randomInt(defaultGameData.sandTime[0], defaultGameData.sandTime[1]);
							var randomFrame = Math.floor(Math.random()*3);
							playSound('soundSand'+(randomFrame+1));
						}
					}
				}
			}else{
				
				if(roundData.survivalData.start){
					updatePlayerMoveSpeed();

					var moveSpeed = roundData.survivalData.oppData.speedZ;
					var moveSpeedX = .006;

					var targetPlayer = players[0];
					if(!roundData.survivalData.turn){
						getOppAway();
						targetPlayer = roundData.survivalData.oppData;
					}

					var distanceZ = targetPlayer.z - player.z;
					var actionY = 'idle';
					var actionX = 'idle';

					if(Math.abs(distanceZ) > 50){
						if(distanceZ < 0){
							actionY = 'frontrun';
							player.speed = -moveSpeed;
						}else if(distanceZ > 0){
							actionY = 'run';
							player.speed = moveSpeed;
						}
					}else{
						actionY = 'idle';
						player.speed = 0;
					}

					var distanceX = targetPlayer.offset - player.offset;
					if(Math.abs(distanceX) > .05){
						if(distanceX < 0){
							player.offset -= moveSpeedX;
						}else if(distanceX > 0){
							player.offset += moveSpeedX;
						}
						actionX = 'run';
					}else{
						actionX = 'idle';
					}

					if(actionY == 'idle'){
						updatePlayerFrame(1, actionX);
					}else{
						updatePlayerFrame(1, actionY);
					}

					player.z = getIncrease(player.z, dt * player.speed, defaultData.trackLength);
				}
			}

			updatePlayerHealth();

			if(player.z < defaultGameData.survivalStart * defaultData.segmentLength){
				player.z = defaultGameData.survivalStart * defaultData.segmentLength
			}

			if(player.z > (defaultGameData.survivalStart + gameSettings.game6.length) * defaultData.segmentLength){
				player.z = (defaultGameData.survivalStart + gameSettings.game6.length) * defaultData.segmentLength
			}

			var endRange = 1
			if(defaultData.playerX < -endRange){
				defaultData.playerX = -endRange;
			}

			if(defaultData.playerX > endRange){
				defaultData.playerX = endRange;
			}
		}

		player.percent = percentRemaining(player.z, defaultData.segmentLength);
		newSegment  = findSegment(player.z);
		
		if (oldSegment != newSegment) {
			let index = oldSegment.players.indexOf(player);
			oldSegment.players.splice(index, 1);
			newSegment.players.push(player);
		}
	}
}

export function updatePlayerFrame(index, action){
	if(players[index].action != action){
		players[index].action = action;
		players[index].sprite.sprite.gotoAndPlay(action);

		if(action == 'dead'){
			players[index].sprite.numberTxt.text = '';

			var randomFrame = Math.floor(Math.random()*3);
			players[index].sprite.sprite.gotoAndStop(4+randomFrame);

			if(gameData.roundNum != 6){
				playSound('soundShot'+(randomFrame+1));
			}
		}
	}
}

function updatePlayerOffset(player, oldSegment, playerSegment, playerW) {
	var i, j, dir, segment, otherPlayer, otherPlayerW, lookahead = 20, playerW = player.sprite.w * defaultData.scale;
	if ((oldSegment.index - playerSegment.index) > defaultData.drawDistance)
		return 0;

	for(i = 1 ; i < lookahead ; i++) {
		segment = segments[(oldSegment.index+i)%segments.length];

		if ((segment === playerSegment) && (player.speed > defaultData.speed) && (getOverlap(defaultData.playerX, playerW, player.offset, playerW, 1.2))) {
			if (defaultData.playerX > 0.5)
				dir = -1;
			else if (defaultData.playerX < -0.5)
				dir = 1;
			else
				dir = (player.offset > defaultData.playerX) ? 1 : -1;
				return dir * 1/i * (player.speed-defaultData.speed)/worldData.maxSpeed;
		}

		for(j = 0 ; j < segment.players.length ; j++) {
			otherPlayer  = segment.players[j];
			otherPlayerW = otherPlayer.sprite.w * defaultData.scale;
			if ((player.speed > otherPlayer.speed) && getOverlap(player.offset, playerW, otherPlayer.offset, otherPlayerW, 1.2)) {
				if (otherPlayer.offset > 0.5)
					dir = -1;
				else if (otherPlayer.offset < -0.5)
					dir = 1;
				else
					dir = (player.offset > otherPlayer.offset) ? 1 : -1;
					return dir * 1/i * (player.speed-otherPlayer.speed)/worldData.maxSpeed;
			}
		}
	}

	if (player.offset < -0.9)
		return 0.1;
	else if (player.offset > 0.9)
		return -0.1;
	else
		return 0;
}

/*!
 * 
 * RENDER WORLD - This is the function that runs to update render world
 * 
 */
function renderWorld() {
	if (segments.length === 0) {
		//console.error("Segments array is empty. Cannot render world.");
		return;
	}

	var baseSegment   = findSegment(defaultData.position);
	var basePercent   = percentRemaining(defaultData.position, defaultData.segmentLength);
	var playerSegment = findSegment(defaultData.position+defaultData.playerZ);
	var playerPercent = percentRemaining(defaultData.position+defaultData.playerZ, defaultData.segmentLength);
	var playerY       = getInterpolate(playerSegment.p1.world.y, playerSegment.p2.world.y, playerPercent);
	var maxy          = defaultData.height+defaultData.extraHeight;
	
	var x  = 0;
	var dx = - (baseSegment.curve * basePercent);
	
	worldContainer.removeAllChildren();
	
	renderBackground(background, defaultData.width, defaultData.height, gameSettings['game'+gameData.roundNum].background.base0,   defaultData.bgOffset,  resolution * defaultData.bgSpeed  * playerY);
	renderBackground(background, defaultData.width, defaultData.height, gameSettings['game'+gameData.roundNum].background.base1,   defaultData.skyOffset,  resolution * defaultData.skySpeed  * playerY);
	renderBackground(background, defaultData.width, defaultData.height, gameSettings['game'+gameData.roundNum].background.base2, defaultData.hillOffset, resolution * defaultData.hillSpeed * playerY);
	renderBackground(background, defaultData.width, defaultData.height, gameSettings['game'+gameData.roundNum].background.base3, defaultData.treeOffset, resolution * defaultData.treeSpeed * playerY);

  	var n, i, segment, car, sprite, spriteScale, spriteX, spriteY;
	
	for(n = 0 ; n < defaultData.drawDistance ; n++) {
		var segmentIndex = (baseSegment.index + n);

		segment        = segments[segmentIndex % segments.length];
		segment.looped = segment.index < baseSegment.index;
		segment.fog    = exponentialFog(n/defaultData.drawDistance, gameSettings['game'+gameData.roundNum].path.fogDensity);
		segment.clip   = maxy;
		
		getProject(segment.p1, (defaultData.playerX * gameSettings['game'+gameData.roundNum].path.width) - x,      playerY + worldData.cameraHeight, defaultData.position - (segment.looped ? defaultData.trackLength : 0), defaultData.cameraDepth, defaultData.width, defaultData.height, gameSettings['game'+gameData.roundNum].path.width);
		getProject(segment.p2, (defaultData.playerX * gameSettings['game'+gameData.roundNum].path.width) - x - dx, playerY + worldData.cameraHeight, defaultData.position - (segment.looped ? defaultData.trackLength : 0), defaultData.cameraDepth, defaultData.width, defaultData.height, gameSettings['game'+gameData.roundNum].path.width);
		
		x  = x + dx;
		dx = dx + segment.curve;
		
		if ((segment.p1.camera.z <= defaultData.cameraDepth)         || // behind us
			(segment.p2.screen.y >= segment.p1.screen.y) || // back face cull
			(segment.p2.screen.y >= maxy))                  // clip by (already rendered) hill
		  continue;
		
		defaultData.lastY = segment.p1.screen.y;
		// render the road
		renderSegment(defaultData.width,
					   segment.p1.screen.x,
					   segment.p1.screen.y,
					   segment.p1.screen.w,
					   segment.p2.screen.x,
					   segment.p2.screen.y,
					   segment.p2.screen.w,
					   segment.fog,
					   segment.color,
					   segmentIndex);
		
		maxy = segment.p1.screen.y;
	}
	
	
  	for(n = (defaultData.drawDistance-1) ; n > 0 ; n--) {
		segment = segments[(baseSegment.index + n) % segments.length];
		
		
		for(i = 0 ; i < segment.players.length ; i++) {
		

			if (!segment.players[i]){
				console.log('i',segment.players);
				break;
			}
			let player      = segment.players[i];
			let spriteScale = getInterpolate(segment.p1.screen.scale, segment.p2.screen.scale, player.percent);
			let spriteX     = getInterpolate(segment.p1.screen.x,     segment.p2.screen.x,     player.percent) + (spriteScale * player.offset * gameSettings['game'+gameData.roundNum].path.width * defaultData.width/2);
			let spriteY     = getInterpolate(segment.p1.screen.y,     segment.p2.screen.y,     player.percent);

			if(player.active)
				renderSprite(defaultData.width, defaultData.height, resolution, gameSettings['game'+gameData.roundNum].path.width, sprites, player.sprite, spriteScale, spriteX, spriteY, -0.5, -1, segment.clip);
		}
	
		for(i = 0 ; i < segment.sprites.length ; i++) {
			sprite      = segment.sprites[i];
			spriteScale = segment.p1.screen.scale;
			spriteX     = segment.p1.screen.x + (spriteScale * sprite.offset * gameSettings['game'+gameData.roundNum].path.width * defaultData.width/2);
			spriteY     = segment.p1.screen.y;
			
			if(sprite.active)
				renderSprite(defaultData.width, defaultData.height, resolution, gameSettings['game'+gameData.roundNum].path.width, sprites, sprite.source, spriteScale, spriteX, spriteY, -0.5, -1, segment.clip);
		}
  	}
}

export function findSegment(z) {
	return segments[Math.floor(z/defaultData.segmentLength) % segments.length]; 
}


/*!
 * 
 * BUILD ROAD - This is the function that runs to build road
 * 
 */
function getLastY() {
	return (segments.length == 0) ? 0 : segments[segments.length-1].p2.world.y;
}

function addSegment(curve, y) {
	var n = segments.length;
	var segmentColor = {};
	var totalLane = 2;

	if(Math.floor(n/totalLane)%2){
		segmentColor.base = gameSettings['game'+gameData.roundNum].path.light.base;
		segmentColor.path = gameSettings['game'+gameData.roundNum].path.light.path;
		segmentColor.glass = gameSettings['game'+gameData.roundNum].path.light.glass;
		segmentColor.holder = gameSettings['game'+gameData.roundNum].path.light.holder;
		segmentColor.rope = gameSettings['game'+gameData.roundNum].path.light.rope;
		segmentColor.side = gameSettings['game'+gameData.roundNum].path.light.side;
		segmentColor.line = gameSettings['game'+gameData.roundNum].path.light.line;
	}else{
		segmentColor.base = gameSettings['game'+gameData.roundNum].path.dark.base;
		segmentColor.path = gameSettings['game'+gameData.roundNum].path.dark.path;
		segmentColor.glass = gameSettings['game'+gameData.roundNum].path.dark.glass;
		segmentColor.holder = gameSettings['game'+gameData.roundNum].path.dark.holder;
		segmentColor.rope = gameSettings['game'+gameData.roundNum].path.dark.rope;
		segmentColor.side = gameSettings['game'+gameData.roundNum].path.dark.side;
		segmentColor.line = gameSettings['game'+gameData.roundNum].path.dark.line;
	}

  segments.push({
	  index: n,
		 p1: { world: { y: getLastY(), z:  n   *defaultData.segmentLength }, camera: {}, screen: {} },
		 p2: { world: { y: y,       z: (n+1)*defaultData.segmentLength }, camera: {}, screen: {} },
	  curve: curve,
	sprites: [],
	players: [],
	  color: segmentColor
  });
}

function addSprite(n, sprite, offset) {
	segments[n].sprites.push({ source: sprite, offset: offset, active:true});
}

function addPath(enter, hold, leave, curve, y) {
	var startY   = getLastY();
	var endY     = startY + (toInt(y, 0) * defaultData.segmentLength);
	var n, total = enter + hold + leave;
	for(n = 0 ; n < enter ; n++)
		addSegment(easeIn(0, curve, n/enter), easeInOut(startY, endY, n/total));
	for(n = 0 ; n < hold  ; n++)
		addSegment(curve, easeInOut(startY, endY, (enter+n)/total));
	for(n = 0 ; n < leave ; n++)
		addSegment(easeInOut(curve, 0, n/leave), easeInOut(startY, endY, (enter+hold+n)/total));
}

/*!
 * 
 * RESET WORLD - This is the function that runs to reset game world
 * 
 */

export function resetWorld(){
	defaultData.maxSpeed = defaultData.segmentLength/(1/60);
	defaultData.accel          =  defaultData.maxSpeed/5;
	defaultData.breaking       = -defaultData.maxSpeed;
	defaultData.decel          = -defaultData.maxSpeed/5;
	defaultData.offRoadDecel   = -defaultData.maxSpeed/2;
	defaultData.offRoadLimit   =  defaultData.maxSpeed/4;
	
	defaultData.cameraDepth = 1 / Math.tan((defaultData.fieldOfView/2) * Math.PI/180);
	defaultData.playerZ = (roundData.players.playerZ * defaultData.segmentLength) + (defaultData.segmentLength/2); //(defaultData.cameraHeight * defaultData.cameraDepth) + 400;
	defaultData.oriPlayerZ = defaultData.playerZ;
	resolution = defaultData.height/1024;
	  	
	for(var key in defaultData) {
		worldData[key] = defaultData[key]; // Ensure segments array is reset
	}
}

function resetPath() {
	segments = [];
	
	var pathLength = 100;
	if(gameData.roundNum == 0){
		addPath(pathLength, pathLength, pathLength, 0, 0);

		var pos = [-.5, -.2, .2, .5];
		for(var n=0; n<pos.length; n++){
			var guardIndex = Math.floor(Math.random() * guards_arr.length);
			addSprite(25, $.sprites['guard'+guardIndex], pos[n]);
		}
		
	}else if(gameData.roundNum == 1){
		pathLength = gameSettings.game1.length;
		addPath(pathLength, pathLength, pathLength, 0, 0);
		segments[pathLength].color.path = gameSettings.game1.path.end;

		var pos = [-.5, -.2, .2, .5];
		for(var n=0; n<pos.length; n++){
			var guardIndex = Math.floor(Math.random() * guards_arr.length);
			addSprite(pathLength + 10, $.sprites['guard'+guardIndex], pos[n]);
		}

		addSprite(pathLength + 3, $.sprites['game1tree'], 0);
		addSprite(pathLength + 2, $.sprites['game1doll'], 0);

	}else if(gameData.roundNum == 2){
		addPath(pathLength, pathLength, pathLength, 0, 0);

		var totalGuards = Math.floor(gameSettings.game2.players/2);
		for(var n=0; n<totalGuards; n++){
			var guardIndex = Math.floor(Math.random() * guards_arr.length);
			addSprite(randomInt(roundData.players.startZ, roundData.players.endZ), $.sprites['guard'+guardIndex], Math.random() * randomChoice([-0.8, 0.8]) );
		}
	}else if(gameData.roundNum == 3){
		addPath(pathLength, pathLength, pathLength, 0, 0);

		var totalLength = (defaultGameData.tugStart + defaultGameData.tugHole + gameSettings.game3.players);
		addSprite(totalLength, $.sprites['game3construct'], 0);
	}else if(gameData.roundNum == 4){
		addPath(pathLength, pathLength, pathLength, 0, 0);

		var totalGuards = Math.floor(gameSettings.game4.players/2);
		for(var n=0; n<totalGuards; n++){
			var guardIndex = Math.floor(Math.random() * guards_arr.length);
			addSprite(randomInt(roundData.players.startZ, roundData.players.endZ), $.sprites['guard'+guardIndex], Math.random() * randomChoice([-0.8, 0.8]) );
		}
	}else if(gameData.roundNum == 5){
		addPath(pathLength, pathLength, pathLength, 0, 0);

		var totalLength = (gameSettings.game5.length * defaultGameData.bridgeSteps) + defaultGameData.bridgeStart;
		var pos = [-.5, -.2, .2, .5];
		for(var n=0; n<pos.length; n++){
			var guardIndex = Math.floor(Math.random() * guards_arr.length);
			addSprite(totalLength + 7, $.sprites['guard'+guardIndex], pos[n]);
		}

		addSprite(totalLength + 10, $.sprites['game5booth'], 0);
	}else if(gameData.roundNum == 6){
		addPath(pathLength, pathLength, pathLength, 0, 0);

		segments[defaultGameData.survivalStart].color.path = gameSettings.game6.path.end;
		segments[defaultGameData.survivalStart + gameSettings.game6.length].color.path = gameSettings.game6.path.end;

		var totalLength = (gameSettings.game5.length * defaultGameData.bridgeSteps) + defaultGameData.bridgeStart;
		var pos = [-.5, -.2, .2, .5];
		for(var n=0; n<pos.length; n++){
			var guardIndex = Math.floor(Math.random() * guards_arr.length);
			addSprite(defaultGameData.survivalStart + gameSettings.game6.length + 3, $.sprites['guard'+guardIndex], pos[n]);
		}
	}
	console.log('segments', segments);
	resetPlayers();
	defaultData.trackLength = segments.length * defaultData.segmentLength;
}

function resetPlayers() {
	players = [];
	cacheContainer.removeAllChildren();

	var n, player, segment, offset, z, speed;
	var playerTurnIndex = 0;
	var halfPeople = Math.floor(gameSettings.game3.players/2);
	console.log('halfPeople',roundData.totalPlayers, halfPeople)

	for (var n = 0 ; n < roundData.totalPlayers; n++) {
		var randomSegment = randomInt(roundData.players.startZ, roundData.players.endZ);
		offset = Math.random() * randomChoice([-0.8, 0.8]);
		z      = randomSegment * defaultData.segmentLength;
		speed  = randomInt(defaultGameData.playerSpeed[0], defaultGameData.playerSpeed[1]);

		var playerContainer = new createjs.Container();
		var playerIndex = Math.floor(Math.random()*players_arr.length);
		playerContainer.sprite = $.sprites['player'+playerIndex].clone();
		playerContainer.sprite.framerate = randomInt(15, 25);
		playerContainer.sprite.gotoAndPlay('idle');

		playerContainer.numberTxt = new createjs.Text();
		playerContainer.numberTxt.font = "13px kimberleyblack";
		playerContainer.numberTxt.color = "#fff";
		playerContainer.numberTxt.textAlign = "center";
		playerContainer.numberTxt.textBaseline='alphabetic';
		playerContainer.numberTxt.text = randomPlayerNumber();
		playerContainer.numberTxt.x = $.sprites['player'+playerIndex].w/2;
		playerContainer.numberTxt.y = 57;

		playerContainer.addChild(playerContainer.sprite, playerContainer.numberTxt);
		playerContainer.w = $.sprites['player'+playerIndex].w;
		playerContainer.h = $.sprites['player'+playerIndex].h;

		cacheContainer.addChild(playerContainer);

		if(roundData.playerSet){
			var getSegment = roundData.turnArr[playerTurnIndex];
			if(gameData.roundNum == 3){
				speed = 0;
				offset = n%2 == 0 ? -.02 : .02;

				if(n == roundData.totalPlayers - 1){
					playerContainer.sprite = itemCenter.clone();
					playerContainer.removeAllChildren();
					playerContainer.addChild(playerContainer.sprite);

					offset = 0;
				}else if(n >= halfPeople-1){
					playerContainer.sprite.gotoAndPlay('front');
				}
			}else if(gameData.roundNum == 5){
				offset = Math.random() * randomChoice([-0.1, 0.1]);

				getSegment = (defaultGameData.bridgeStart-1) - roundData.bridgeData.turnArr[playerTurnIndex];
			}else if(gameData.roundNum == 6){
				offset = Math.random() * randomChoice([-0.2, 0.2]);
			}

			getSegment = getSegment < 0 ? 0 : getSegment;
			z = getSegment * defaultData.segmentLength;

			if(n == 0){
				roundData.players.playerZ = getSegment;
				playerContainer.numberTxt.text = roundData.playerNumber;
			}

			playerTurnIndex++;
		}else{
			if(n == 0){
				offset = 0;
				z = roundData.players.playerZ;
				playerContainer.sprite.framerate = 20;
				playerContainer.numberTxt.text = roundData.playerNumber;
			}
		}
		
		player = { index:n, offset:offset, z:z, sprite:playerContainer, speed:speed, moveTime:0, sandTime:0, active:true, status:'', action:'idle' };
		segment = findSegment(player.z);
		segment.players.push(player);
		players.push(player);
	}
}

export function randomPlayerNumber(){
	var playerNumber = randomInt(1, 999);
	return pad(playerNumber, 3);
}

/*!
 * 
 * END GAME - This is the function that runs for end game
 * 
 */
export function endGame(win, timer){
	if(!gameData.ended){
		playerData.win = win;
		toggleGameInstruction(false);
		clearCandyDrawing();

		gameData.ended = true;
		gameData.interact = false;

		roundData.lightData.forward = false;
		roundData.lightData.stop = true;

		roundData.survivalData.start = false;
		roundData.survivalData.move = false;
		itemControl.visible = false;

		if(win){
			//calculate score
			if(gameData.roundNum == 6){
				var lifeLeft = roundData.survivalData.userHealth;
				var roundScore = lifeLeft * .05;
			}else{
				var timeLeft = gameSettings['game'+gameData.roundNum].timer - timeData.timer;
				var roundScore = timeLeft * .0005;
			}
			playerData.score += Math.round(roundScore);


		}else if(!win){
			var deadArr = [1,2,4];
			if(deadArr.indexOf(gameData.roundNum) != -1){
				updatePlayerFrame(0, 'dead');
			}
		}

		TweenMax.to(resultContainer, 0, {delay:.8, overwrite:true, onComplete:function(){
			if(!win){
				displayGameRound(false, false);
			}else{
				displayGameRound(false, true);
			}

			TweenMax.to(resultContainer, 3, {delay:0, overwrite:true, onComplete:function(){
				if(playerData.win){
					var newRound = gameData.roundNum + 1;
					if(newRound <= gameData.totalRound){
						gameData.roundNum = newRound;

						stopGame();
						startGame();
						resetWorld();
						resetPath();
					}else{
						goPage('result');	
					}
				}else{
					goPage('result');
				}
			}});
		}});
	}

	if(timer){
		if(gameData.roundNum == 1){
			TweenMax.killTweensOf(roundData.lightData);
			TweenMax.killTweensOf(roundData.lightData.moveTween);
			TweenMax.killTweensOf(roundData.lightData.timeTween);
			
			for(var n=1; n<players.length; n++){
				players[n].speed = 0;
				players[n].moveTime = 0;

				if(players[n].status != 'dead'){
					if(players[n].status != 'complete'){
						players[n].status = 'nextDead';
					}
				}
			}
			
			loopPlayerDead();
		}else if(gameData.roundNum == 3){
			gameData.paused = true;
			stopSoundLoop('soundRope');
		}

		toggleGameTimer(false);
	}
}

/*!
 * 
 * MILLISECONDS CONVERT - This is the function that runs to convert milliseconds to time
 * 
 */
export function millisecondsToTimeGame(milli) {
	var milliseconds = milli % 1000;
	var seconds = Math.floor((milli / 1000) % 60);
	var minutes = Math.floor((milli / (60 * 1000)) % 60);
	
	if(seconds<10){
		seconds = '0'+seconds;  
	}
	
	if(minutes<10){
		minutes = '0'+minutes;
	}
	
	return minutes+':'+seconds;
}

/*!
 * 
 * OPTIONS - This is the function that runs to mute and fullscreen
 * 
 */
function toggleSoundMute(con){
	buttonSoundOff.visible = false;
	buttonSoundOn.visible = false;
	toggleSoundInMute(con);
	if(con){
		buttonSoundOn.visible = true;
	}else{
		buttonSoundOff.visible = true;	
	}
}

function toggleMusicMute(con){
	buttonMusicOff.visible = false;
	buttonMusicOn.visible = false;
	toggleMusicInMute(con);
	if(con){
		buttonMusicOn.visible = true;
	}else{
		buttonMusicOff.visible = true;	
	}
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

/*!
 * 
 * OPTIONS - This is the function that runs to toggle options
 * 
 */

function toggleOption(){
	if(optionsContainer.visible){
		optionsContainer.visible = false;
	}else{
		optionsContainer.visible = true;
	}
}


/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
function share(action){
	gtag('event','click',{'event_category':'share','event_label':action});
	
	var loc = location.href
	loc = loc.substring(0, loc.lastIndexOf("/") + 1);
	
	var title = '';
	var text = '';
	
	if(playerData.win){
		title = shareWinTitle.replace("[SCORE]", addCommas(gameData.roundNum));
		text = shareWinMessage.replace("[SCORE]", addCommas(gameData.roundNum));
	}else{
		title = shareTitle.replace("[SCORE]", addCommas(gameData.roundNum));
		text = shareMessage.replace("[SCORE]", addCommas(gameData.roundNum));
	}

	if(gameCustomScore.status){
		title = shareTitle.replace("[SCORE]", addCommas(playerData.score));
		text = shareMessage.replace("[SCORE]", addCommas(playerData.score));
	}
	var shareurl = '';
	
	if( action == 'twitter' ) {
		shareurl = 'https://twitter.com/intent/tweet?url='+loc+'&text='+text;
	}else if( action == 'facebook' ){
		shareurl = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(loc+'share.php?desc='+text+'&title='+title+'&url='+loc+'&thumb='+loc+'share.jpg&width=590&height=300');
	}else if( action == 'google' ){
		shareurl = 'https://plus.google.com/share?url='+loc;
	}else if( action == 'whatsapp' ){
		shareurl = "whatsapp://send?text=" + encodeURIComponent(text) + " - " + encodeURIComponent(loc);
	}
	
	window.open(shareurl);
}