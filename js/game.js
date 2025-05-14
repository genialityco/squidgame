import { viewport } from "./main.js"; // Import viewport
import { isTablet } from "./helpers/device.js"; // Import isTablet helper

import {
  levelContainer,
  numberContainer,
  moneyContainer,
  piggyContainer,
  candyContainer,
} from "./canvas.js";
import {
  handContainer,
  cacheContainer,
  gameRoundContainer,
  gameInstructContainer,
  mainContainer,
} from "./canvas.js";
import { healthContainer, gameContainer, worldContainer } from "./canvas.js";
import {
  resultContainer,
  confirmContainer,
  optionsContainer,
} from "./canvas.js";
import {
  buttonChoose,
  buttonNumberL,
  buttonNumberR,
  buttonLevel,
  buttonArrowL,
  buttonArrowR,
} from "./canvas.js";
import {
  buttonStart,
  buttonRestart,
  buttonFacebook,
  buttonTwitter,
  buttonWhatsapp,
} from "./canvas.js";
import {
  buttonFullscreen,
  buttonSoundOn,
  buttonSoundOff,
  buttonMusicOn,
  buttonMusicOff,
} from "./canvas.js";
import {
  buttonExit,
  buttonSettings,
  buttonConfirm,
  buttonCancel,
} from "./canvas.js";
import {
  itemPiggy,
  itemLight,
  itemCandyBase,
  itemPixel,
  itemNeedle,
  itemControl,
  itemCenter,
} from "./canvas.js";
import {
  numberTxt,
  levelTxt,
  roundTxt,
  roundShadowTxt,
  roundNameTxt,
} from "./canvas.js";
import {
  roundNameShadowTxt,
  instructionTxt,
  resultTitleTxt,
  resultScoreTxt,
} from "./canvas.js";
import {
  pressMove,
  logo,
  timerTxt,
  candyDrawing,
  buttonOdd,
  buttonEven,
} from "./canvas.js";
import { canvasW, canvasH, stage, resizeCanvas } from "./canvas.js";

import { renderBackground, renderSegment, renderSprite } from "./renderMisc.js";
import { gameTextDisplay } from "./gameTextDisplay.js";
import { gameSettings } from "./gameSettings.js";
import { updatePlayers } from "./gameLogic/updatePlayers.js";
import { share } from "./helpers/social.js"; // Import social share helper
import { updateScore } from "./helpers/score.js"; // Import updateScore function
// import {randomInt, getIncrease,pad} from './plugins.js'
////////////////////////////////////////////////////////////
// GAMES
////////////////////////////////////////////////////////////
import { startGreenLightCount, loopPlayerDead } from "./games/RedLightGame.js";
import {
  checkCandyDrawingPos,
  clearCandyDrawing,
  initCandyDrawingPos,
  startCandyGame,
} from "./games/CandyGame.js";
import { startTugGame, playerTugAction } from "./games/TugGame.js";
import {
  resetMarbleGame,
  changeMarbleTurn,
  toggleHandStatus,
} from "./games/MarbleGame.js";
import {
  startSurvivalGame,
  updatePlayerHealthBar,
  stopSurvivalRound,
} from "./games/SurvivalGame.js";
import { moveFrontPlayer } from "./games/BridgeGame.js";
import { showPreGameQuestions } from "./games/pregameQuestions.js";
import { showInstructionModal } from "./helpers/instructions.js";

//player assets
export var players_arr = [{ src: "assets/player.png" }];

export var guards_arr = [{ src: "assets/guard.png" }];

//result custom score
export var gameCustomScore = {
  status: false,
  text: "[SCORE] BILLION",
};

//Social share, [SCORE] will replace with game score
export var shareEnable = true; //toggle share
export var shareText = "SHARE YOUR SCORE"; //social share message
export var shareWinTitle = "I won 45.6 billion on Survival Game."; //social share score title
export var shareWinMessage = "I won 45.6 billion on Survival Game! Try it now!"; //social share score message
export var shareTitle = "High score on Survival Game is ROUND [SCORE]."; //social share score title
export var shareMessage =
  "ROUND [SCORE] is my new high score on Survival Game! Try it now!"; //social share score message

/*!
 *
 * GAME SETTING CUSTOMIZATION END
 *
 */
export var dt;
export var defaultData = {
  width: 0,
  height: 0,
  scale: 0.00145,
  viewport: {
    landscape: { w: 1280, h: 840, scale: 0.00125 },
    portrait: { w: 768, h: 840, scale: 0.00205 },
  },
  extraHeight: 500,
  centrifugal: 0.3,
  bgSpeed: 0,
  skySpeed: 0.001,
  hillSpeed: 0.002,
  treeSpeed: 0.003,
  bgOffset: 0,
  skyOffset: 0,
  hillOffset: 0,
  treeOffset: 0,
  segmentLength: 100,
  trackLength: null,
  fieldOfView: 100,
  cameraHeight: 800,
  cameraDepth: null,
  drawDistance: 100,
  playerX: 0,
  playerZ: 0,
  position: 0,
  speed: 0,
  maxSpeed: 0,
  accel: 0,
  breaking: 0,
  decel: 0,
  offRoadDecel: 0,
  offRoadLimit: 0,
  turnSpeed: 0.005,
  lastY: 0,
};

export var defaultGameData = {
  playerSpeed: [500, 1500],
  sandTime: [5, 10],
  ropeWidth: 1,
  ropeY: 0,
  tugStart: 16,
  tugGap: 2,
  tugHole: 4,
  bridgeStart: 16,
  bridgeSteps: 4,
  bridgeGlassWidth: 30,
  bridgeGlassHoldWidth: 7,
  bridgeGlassHoldSpace: 3,
  survivalStart: 16,
  survivalSpeed: 1200,
  survivalSplitPercent: 75,
  survivalBarW: 150,
  survivalBarH: 25,
  survivalBarBorder: 3,
};

export var worldData = {};
var segments = [];
export var players = [];
var background = null;
var sprites = null;
var resolution = null;
var currentLapTime = 0;

export var playerData = { win: false, bestTime: 0, score: 0 };
export var gameData = {
  paused: true,
  money: [],
  roundNum: 0,
  ended: false,
  totalRound: 6,
};
export var timeData = {
  enable: false,
  startDate: null,
  nowDate: null,
  timer: 0,
  oldTimer: 0,
};
export var roundData = {
  players: {},
  lightData: { forward: false, stop: false, moveTween: {}, timeTween: {} },
  tugData: { moveTween: {} },
  candyData: {},
  bridgeData: {},
  marbleData: {},
  survivalData: {},
};
export var collisionMethod = ndgmr.checkPixelCollision;

function getUrlParameter(name) {
  const url = new URL(window.location.href);
  const param = url.searchParams.get(name);
  return param ? parseInt(param, 10) : null;
}

/*!
 *
 * GAME BUTTONS - This is the function that runs to setup button event
 *
 */
export function buildGameButton() {
  $(window).focus(function () {
    if (!buttonSoundOn.visible) {
      toggleSoundInMute(false);
    }

    if (typeof buttonMusicOn != "undefined") {
      if (!buttonMusicOn.visible) {
        toggleMusicInMute(false);
      }
    }
  });

  $(window).blur(function () {
    if (!buttonSoundOn.visible) {
      toggleSoundInMute(true);
    }

    if (typeof buttonMusicOn != "undefined") {
      if (!buttonMusicOn.visible) {
        toggleMusicInMute(true);
      }
    }
  });

  if ($.browser.mobile || isTablet()) {
  } else {
  }

  buttonStart.cursor = "pointer";
  buttonStart.addEventListener("click", function (evt) {
    playSound("soundClick");
    if (gameSettings.game0.chooseNumbers) {
      displayChooseNumber();
    } else {
      goPage("game");
    }
  });

  buttonChoose.cursor = "pointer";
  buttonChoose.addEventListener("click", function (evt) {
    playSound("soundClick");
    goPage("game");
  });

  buttonFacebook.cursor = "pointer";
  buttonFacebook.addEventListener("click", function (evt) {
    share("facebook");
  });
  buttonTwitter.cursor = "pointer";
  buttonTwitter.addEventListener("click", function (evt) {
    share("twitter");
  });
  buttonWhatsapp.cursor = "pointer";
  buttonWhatsapp.addEventListener("click", function (evt) {
    share("whatsapp");
  });

  buttonSoundOff.cursor = "pointer";
  buttonSoundOff.addEventListener("click", function (evt) {
    toggleSoundMute(true);
  });

  buttonSoundOn.cursor = "pointer";
  buttonSoundOn.addEventListener("click", function (evt) {
    toggleSoundMute(false);
  });

  if (typeof buttonMusicOff != "undefined") {
    buttonMusicOff.cursor = "pointer";
    buttonMusicOff.addEventListener("click", function (evt) {
      toggleMusicMute(true);
    });
  }

  if (typeof buttonMusicOn != "undefined") {
    buttonMusicOn.cursor = "pointer";
    buttonMusicOn.addEventListener("click", function (evt) {
      toggleMusicMute(false);
    });
  }

  buttonFullscreen.cursor = "pointer";
  buttonFullscreen.addEventListener("click", function (evt) {
    toggleFullScreen();
  });

  buttonExit.cursor = "pointer";
  buttonExit.addEventListener("click", function (evt) {
    playSound("soundClick");
    toggleConfirm(true);
  });

  buttonSettings.cursor = "pointer";
  buttonSettings.addEventListener("click", function (evt) {
    toggleOption();
  });

  buttonConfirm.cursor = "pointer";
  buttonConfirm.addEventListener("click", function (evt) {
    playSound("soundClick");
    toggleConfirm(false);
    stopGame(true);
    goPage("main");
  });

  buttonCancel.cursor = "pointer";
  buttonCancel.addEventListener("click", function (evt) {
    playSound("soundClick");
    toggleConfirm(false);
  });

  buttonRestart.cursor = "pointer";
  buttonRestart.addEventListener("click", function (evt) {
    playSound("soundClick");
    goPage("main");
  });

  pressMove.addEventListener("click", function (evt) {
    toggleGameControl("click", true);
  });

  pressMove.addEventListener("mousedown", function (evt) {
    toggleGameControl("mousedown");
  });

  pressMove.addEventListener("pressup", function (evt) {
    toggleGameControl("pressup");
  });

  itemCandyBase.addEventListener("mousedown", function (event) {
    if (!gameData.interact) {
      return;
    }

    toggleGameInstruction(false);

    roundData.candyData.draw = true;
    roundData.candyData.lastPoint = { x: 0, y: 0 };
    roundData.candyData.lastPoint.x = itemNeedle.x = event.stageX - canvasW / 2;
    roundData.candyData.lastPoint.y = itemNeedle.y = event.stageY - canvasH / 2;
    candyDrawing.graphics
      .ss(gameSettings.game2.drawStroke, "round")
      .s(gameSettings.game2.drawColor);

    initCandyDrawingPos(event.stageX - canvasW / 2, event.stageY - canvasH / 2);
  });

  itemCandyBase.addEventListener("pressmove", function (event) {
    if (roundData.candyData.draw) {
      candyDrawing.graphics.mt(
        roundData.candyData.lastPoint.x,
        roundData.candyData.lastPoint.y
      );
      candyDrawing.graphics.lt(
        event.stageX - canvasW / 2,
        event.stageY - canvasH / 2
      );

      checkCandyDrawingPos(
        event.stageX - canvasW / 2,
        event.stageY - canvasH / 2
      );
      itemPixel.x = event.stageX - canvasW / 2;
      itemPixel.y = event.stageY - canvasH / 2;

      var mouseDistance = getDistance(
        roundData.candyData.lastPoint.x,
        roundData.candyData.lastPoint.y,
        event.stageX - canvasW / 2,
        event.stageY - canvasH / 2
      );
      var intersection1 = ndgmr.checkPixelCollision(
        itemPixel,
        $.sprites["candy" + roundData.candyData.candyNum]
      );
      if (intersection1) {
        if (mouseDistance >= 1.5) {
          var randomFrame = Math.floor(Math.random() * 3);
          playSound("soundCrack" + (randomFrame + 1));
        }
      } else {
        playSound("soundCrackError");
        clearCandyDrawing();
      }

      roundData.candyData.lastPoint.x = itemNeedle.x =
        event.stageX - canvasW / 2;
      roundData.candyData.lastPoint.y = itemNeedle.y =
        event.stageY - canvasH / 2;
    }
  });

  itemCandyBase.addEventListener("pressup", function (event) {
    clearCandyDrawing();
  });

  buttonOdd.cursor = "pointer";
  buttonOdd.addEventListener("click", function (evt) {
    if (!gameData.interact) {
      return;
    }
    toggleHandStatus(false);
  });

  buttonEven.cursor = "pointer";
  buttonEven.addEventListener("click", function (evt) {
    if (!gameData.interact) {
      return;
    }
    toggleHandStatus(true);
  });

  if (gameSettings.game0.levelSelect) {
    itemPiggy.addEventListener("click", function (evt) {
      buttonStart.visible = false;
      levelContainer.visible = true;
      logo.visible = true;
      numberContainer.visible = false;
    });
  }

  buttonLevel.cursor = "pointer";
  buttonLevel.addEventListener("click", function (evt) {
    playSound("soundClick");
    goPage("game");
  });

  buttonArrowL.cursor = "pointer";
  buttonArrowL.addEventListener("click", function (evt) {
    playSound("soundClick");
    toggleRound(false);
  });

  buttonArrowR.cursor = "pointer";
  buttonArrowR.addEventListener("click", function (evt) {
    playSound("soundClick");
    toggleRound(true);
  });

  buttonNumberL.cursor = "pointer";
  buttonNumberL.addEventListener("mousedown", function (evt) {
    playSound("soundClick");
    toggleChooseNumber(false);
  });
  buttonNumberL.addEventListener("pressup", function (evt) {
    toggleChooseNumber();
  });

  buttonNumberR.cursor = "pointer";
  buttonNumberR.addEventListener("mousedown", function (evt) {
    playSound("soundClick");
    toggleChooseNumber(true);
  });
  buttonNumberR.addEventListener("pressup", function (evt) {
    toggleChooseNumber();
  });

  loopPiggyMoney();
}

function toggleRound(con) {
  if (con) {
    gameData.roundSelect++;
    gameData.roundSelect =
      gameData.roundSelect >= gameData.totalRound
        ? gameData.totalRound
        : gameData.roundSelect;
  } else {
    gameData.roundSelect--;
    gameData.roundSelect = gameData.roundSelect < 1 ? 1 : gameData.roundSelect;
  }

  if (gameData.roundSelect == 6) {
    levelTxt.text = gameTextDisplay.roundFinal.replace(
      "[NUMBER]",
      gameData.roundSelect
    );
  } else {
    levelTxt.text = gameTextDisplay.round.replace(
      "[NUMBER]",
      gameData.roundSelect
    );
  }
}

/*!
 *
 * DISPLAY PAGES - This is the function that runs to display pages
 *
 */
export var curPage = "";
export function goPage(page) {
  curPage = page;

  levelContainer.visible = false;
  numberContainer.visible = false;
  mainContainer.visible = false;
  gameContainer.visible = false;
  resultContainer.visible = false;
  piggyContainer.visible = false;

  var targetContainer = null;
  switch (page) {
    case "main":
      targetContainer = mainContainer;
      roundData.playerNumber = randomPlayerNumber();
      logo.visible = true;
      buttonStart.visible = true;
      piggyContainer.visible = true;

      const chosenGame = getUrlParameter("chooseGame");
      const validGame = chosenGame >= 1 && chosenGame <= 6;

      gameData.roundNum = validGame ? chosenGame - 1 : 0;
      gameData.roundSelect = gameData.roundNum;

      toggleRound(true);
      prepareRound();
      resetWorld();
      playMusicLoop("musicGame");
      break;

    case "game":
      targetContainer = gameContainer;
      gameData.roundNum = gameData.roundSelect;

      stopMusicLoop("musicGame");
      startGame();
      break;

    case "result":
      targetContainer = resultContainer;
      stopGame(true);

      if (playerData.win) {
        playSound("soundWin");
        resultTitleTxt.text = gameTextDisplay.resultWinTitle;
        resultScoreTxt.text = gameTextDisplay.resultWinDesc;
      } else {
        resultTitleTxt.text = gameTextDisplay.resultFailTitle;
        resultScoreTxt.text = gameTextDisplay.resultFailDesc;
      }

      // Crear botón personalizado
      if (!resultContainer.getChildByName("backToGamesBtn")) {
        const backToGamesBtn = new createjs.Text(
          "Volver a los juegos",
          "20px Arial",
          "#ffffff"
        );
        backToGamesBtn.name = "backToGamesBtn";
        backToGamesBtn.textAlign = "center";
        backToGamesBtn.x = 640; // centro del canvas (1280 / 2)
        backToGamesBtn.y = 535; // posición vertical deseada
        backToGamesBtn.cursor = "pointer";
        backToGamesBtn.shadow = new createjs.Shadow("#000", 2, 2, 4);

        backToGamesBtn.addEventListener("click", () => {
          window.location.href = "https://squidgenfar.netlify.app/";
        });

        resultContainer.addChild(backToGamesBtn);
      }

      if (gameCustomScore.status) {
        resultScoreTxt.text = gameCustomScore.text.replace(
          "[SCORE]",
          playerData.score
        );
        saveGame(playerData.score);
      } else {
        saveGame(gameData.roundNum);
      }
      break;
  }

  if (targetContainer != null) {
    targetContainer.visible = true;
    targetContainer.alpha = 0;
    TweenMax.to(targetContainer, 0.5, { alpha: 1, overwrite: true });
  }

  resizeCanvas();
}

export function toggleConfirm(con) {
  confirmContainer.visible = con;

  if (con) {
    TweenMax.pauseAll(true, true);
    gameData.paused = true;
  } else {
    TweenMax.resumeAll(true, true);
    if (curPage == "game") {
      gameData.paused = false;
    }
  }
}

function loopPiggyMoney() {
  gameData.money = [];

  for (var n = 0; n < 10; n++) {
    var moneyIndex = Math.floor(Math.random() * 4);

    var newMoney = $.money["itemMoney" + (moneyIndex + 1)].clone();
    newMoney.x = randomInt(-25, 10);
    newMoney.y = newMoney.oriY = -400;
    newMoney.maxY = -100;
    newMoney.speed = randomInt(5, 15);
    newMoney.rotateSpeed = randomInt(-15, 15);

    moneyContainer.addChild(newMoney);
    gameData.money.push(newMoney);
  }
}

export function displayChooseNumber() {
  logo.visible = false;
  buttonStart.visible = false;
  numberContainer.visible = true;

  chooseNumberData.number = randomInt(1, 999);
  numberTxt.text = pad(chooseNumberData.number, 3);
}

var chooseNumberData = {
  interval: null,
  number: 0,
  timer: 0,
  max: 100,
  mix: 1,
  bet: 0,
};
export function toggleChooseNumber(con) {
  if (con) {
    roundData.bet = 1;
  } else if (!con) {
    roundData.bet = -1;
  } else {
    roundData.bet = 0;
  }

  if (con != undefined) {
    chooseNumberData.timer = chooseNumberData.max;
    loopChooseNumber();
  } else {
    clearInterval(chooseNumberData.interval);
    chooseNumberData.interval = null;
  }
}

function loopChooseNumber() {
  clearInterval(chooseNumberData.interval);
  chooseNumberData.interval = setInterval(
    loopChooseNumber,
    chooseNumberData.timer
  );
  chooseNumberData.timer -= 10;
  chooseNumberData.timer =
    chooseNumberData.timer < chooseNumberData.min
      ? chooseNumberData.max
      : chooseNumberData.timer;

  updateChooseNumber();
}

function updateChooseNumber() {
  chooseNumberData.number += roundData.bet;
  chooseNumberData.number =
    chooseNumberData.number <= 1 ? 1 : chooseNumberData.number;
  chooseNumberData.number =
    chooseNumberData.number >= 999 ? 999 : chooseNumberData.number;

  roundData.playerNumber = pad(chooseNumberData.number, 3);
  numberTxt.text = roundData.playerNumber;
}

/*!
 *
 * START GAME - This is the function that runs to start play game
 *
 */

export function startGame() {
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
export function prepareRound() {
  defaultData.position = 0;
  defaultData.playerX = 0;
  defaultData.speed = 0;

  roundData.totalPlayers = gameSettings["game" + gameData.roundNum].players;

  roundData.playerSet = false;
  roundData.lightData.countTime = gameSettings.game1.countTime;
  roundData.lightData.peekTime = gameSettings.game1.peekTime;
  roundData.lightData.moveCon = false;

  roundData.candyData = {
    x: 0,
    y: 0,
    checkpoint: [],
    lastPoint: { x: 0, y: 0 },
    draw: false,
  };

  roundData.tugData.speed = 0;
  roundData.tugData.oppSpeed = gameSettings.game3.oppSpeed;
  roundData.tugData.userSpeed = gameSettings.game3.userSpeed;

  roundData.bridgeData.playerIndex = 0;
  roundData.bridgeData.seqArrIndex = 0;
  roundData.bridgeData.seqArr = [];
  roundData.bridgeData.animateCount = 0;
  roundData.bridgeData.lastPos = { x: 0, y: 0 };

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
  roundData.survivalData.oppData = {
    z: 0,
    offset: 0,
    time: 0,
    boost: 0,
    speedZ: 0,
    speedX: 0,
    speedTime: 0,
  };
  roundData.survivalData.healthTime = 0;

  itemLight.visible = false;
  candyContainer.visible = false;
  handContainer.visible = false;
  healthContainer.visible = false;
  itemControl.visible = false;
  worldContainer.y = 0;

  gameInstructContainer.alpha = 0;
  toggleGameInstruction(false);

  if (gameData.roundNum == 0) {
    roundData.followCamera = true;
    roundData.players.startZ = 7;
    roundData.players.endZ = 20;
    roundData.players.playerZ = 7;
  } else if (gameData.roundNum == 1) {
    roundData.followCamera = true;
    roundData.players.startZ = 11;
    roundData.players.endZ = 25;
    roundData.players.playerZ = 10;

    itemLight.visible = true;
    itemLight.gotoAndStop("red");
    gameData.doll.gotoAndPlay("idle");
  } else if (gameData.roundNum == 2) {
    roundData.followCamera = true;
    roundData.players.startZ = 11;
    roundData.players.endZ = 25;
    roundData.players.playerZ = 10;

    // chooseRandomCandy();
    // Inicia el juego de la galleta, con las preguntas al inicio
    // startCandyGame();
  } else if (gameData.roundNum == 3) {
    worldContainer.y = -100;

    roundData.followCamera = false;
    roundData.players.startZ = 8;
    roundData.players.endZ = 10;
    roundData.players.playerZ = 7;

    roundData.turnArr = [];
    var halfPeople = Math.floor(gameSettings.game3.players / 2);
    var tugSegment = defaultGameData.tugStart - defaultGameData.tugGap;

    var oppositeCon = false;
    for (var n = 0; n < gameSettings.game3.players; n++) {
      if (!oppositeCon) {
        tugSegment--;
      } else {
        tugSegment++;
      }

      roundData.turnArr.push(tugSegment);
      if (n >= halfPeople - 1 && !oppositeCon) {
        oppositeCon = true;
        tugSegment =
          defaultGameData.tugStart +
          defaultGameData.tugHole +
          defaultGameData.tugGap;
      }
    }

    roundData.totalPlayers += 1;
    roundData.turnArr.push(
      defaultGameData.tugStart + defaultGameData.tugHole / 2
    );

    roundData.playerSet = true;
    itemLight.visible = true;
    resetPath();
  } else if (gameData.roundNum == 4) {
    roundData.followCamera = true;
    roundData.players.startZ = 11;
    roundData.players.endZ = 25;
    roundData.players.playerZ = 10;
  } else if (gameData.roundNum == 5) {
    worldContainer.y = -100;

    roundData.followCamera = false;
    roundData.players.startZ = 8;
    roundData.players.endZ = 10;
    roundData.players.playerZ = 7;

    for (var n = 0; n < gameSettings.game5.length; n++) {
      roundData.bridgeData.seqArr.push({ side: randomInt(0, 1), step: false });
    }

    roundData.turnArr = [];
    var bridgeSegment = defaultGameData.bridgeStart - 1;
    for (var n = 0; n < gameSettings.game5.players; n++) {
      roundData.turnArr.push(bridgeSegment);
      bridgeSegment--;
    }

    roundData.bridgeData.turnArr = [];
    for (var n = gameSettings.game5.players - 1; n >= 0; n--) {
      roundData.bridgeData.turnArr.push(n);
    }

    roundData.playerSet = true;
    resetPath();
  } else if (gameData.roundNum == 6) {
    roundData.followCamera = false;
    roundData.players.startZ = 7;
    roundData.players.endZ = 20;
    roundData.players.playerZ = 12;

    roundData.totalPlayers = 2;

    roundData.turnArr = [];
    roundData.turnArr.push(18);
    roundData.turnArr.push(18 + (gameSettings.game6.length - 5));

    roundData.playerSet = true;

    $.sprites["healthTypeTxt" + 0].text = $.sprites[
      "healthTypeShadowTxt" + 0
    ].text = "";
    $.sprites["healthTypeTxt" + 1].text = $.sprites[
      "healthTypeShadowTxt" + 1
    ].text = "";

    itemLight.visible = true;
    itemLight.gotoAndStop("red");
    updatePlayerHealthBar();

    healthContainer.visible = true;
  }

  timeData.oldTimer = -1;
  timeData.countdown = gameSettings["game" + gameData.roundNum].timer;
  timerTxt.text = millisecondsToTimeGame(timeData.countdown);

  changeGameViewport();
  resetWorld();
  resetPath();
}

export function changeGameViewport() {
  if (viewport.isLandscape) {
    //landscape
    if (gameData.roundNum == 0) {
      roundData.camera = 750;
    } else if (gameData.roundNum == 1) {
      roundData.camera = 550;
    } else if (gameData.roundNum == 2) {
      roundData.camera = 550;
      roundData.players.playerZ = 10;
    } else if (gameData.roundNum == 3) {
      roundData.camera = 550;
    } else if (gameData.roundNum == 4) {
      roundData.camera = 550;
      roundData.players.playerZ = 10;
    } else if (gameData.roundNum == 5) {
      roundData.camera = 550;
    } else if (gameData.roundNum == 6) {
      roundData.camera = 750;
    }
  } else {
    //portrait
    if (gameData.roundNum == 0) {
      roundData.camera = 700;
    } else if (gameData.roundNum == 1) {
      roundData.camera = 700;
    } else if (gameData.roundNum == 2) {
      roundData.camera = 700;
      roundData.players.playerZ = 6;
    } else if (gameData.roundNum == 3) {
      roundData.camera = 700;
    } else if (gameData.roundNum == 4) {
      roundData.camera = 700;
      roundData.players.playerZ = 6;
    } else if (gameData.roundNum == 5) {
      roundData.camera = 700;
    } else if (gameData.roundNum == 6) {
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
function displayGameRound(round, win) {
  gameRoundContainer.alpha = 0;

  if (gameData.roundNum == 6) {
    roundTxt.text = roundShadowTxt.text = gameTextDisplay.roundFinal.replace(
      "[NUMBER]",
      gameData.roundNum
    );
  } else {
    roundTxt.text = roundShadowTxt.text = gameTextDisplay.round.replace(
      "[NUMBER]",
      gameData.roundNum
    );
  }
  roundTxt.color = gameSettings["game" + gameData.roundNum].textColor;
  roundShadowTxt.color =
    gameSettings["game" + gameData.roundNum].textShadowColor;
  roundNameTxt.color = gameSettings["game" + gameData.roundNum].textColor;
  roundNameShadowTxt.color =
    gameSettings["game" + gameData.roundNum].textShadowColor;

  if (round) {
    roundNameTxt.text = roundNameShadowTxt.text =
      gameSettings["game" + gameData.roundNum].name;
  } else {
    if (win) {
      playSound("soundComplete");
      roundNameTxt.text = roundNameShadowTxt.text =
        gameTextDisplay.roundComplete;
    } else {
      playSound("soundFail");
      roundNameTxt.text = roundNameShadowTxt.text = gameTextDisplay.roundFail;
    }
  }

  TweenMax.to(gameRoundContainer, 0.5, {
    alpha: 1.5,
    overwrite: true,
    onComplete: function () {
      TweenMax.to(gameRoundContainer, 0.5, {
        delay: 1,
        alpha: 0,
        overwrite: true,
        onComplete: function () {},
      });
    },
  });
}

/*!!
 *
 * GAME INSTRUCTION - This is the function that runs to show game instruction
 *
 */
export function toggleGameInstruction(con) {
  instructionTxt.text = gameTextDisplay["game" + gameData.roundNum];
  instructionTxt.color =
    gameSettings["game" + gameData.roundNum].instruction.color;

  var alphaNum = con == true ? 1 : 0;
  TweenMax.to(gameInstructContainer, 0.5, {
    alpha: alphaNum,
    overwrite: true,
    onComplete: function () {},
  });

  resizeGameWorld();
}

function resizeGameWorld() {
  instructionTxt.x =
    (canvasW / 100) * gameSettings["game" + gameData.roundNum].instruction.x;
  instructionTxt.y =
    (canvasH / 100) * gameSettings["game" + gameData.roundNum].instruction.y;

  if (gameData.roundNum == 6) {
    if (viewport.isLandscape) {
      worldContainer.y = -150;
    } else {
      worldContainer.y = 0;
    }
  }
}

/*!!
 *
 * GAME CAMERA ANIMATE - This is the function that runs to animate game camera
 *
 */
export function startPanCamera() {
  if (gameData.roundNum == 1) {
    roundData.followCamera = false;

    var totalLength = gameSettings.game1.length;
    defaultData.position =
      (totalLength - totalLength / 5) * defaultData.segmentLength;

    TweenMax.to(defaultData, 2, {
      delay: 1,
      position: 0,
      overwrite: true,
      onComplete: function () {
        roundData.followCamera = true;
        TweenMax.to(defaultData, 1, {
          overwrite: true,
          onComplete: function () {
            startGameRound();
          },
        });
      },
    });
  } else if (gameData.roundNum == 2) {
    TweenMax.to(defaultData, 2, {
      delay: 1,
      overwrite: true,
      onComplete: function () {
        startGameRound();
      },
    });
  } else if (gameData.roundNum == 3) {
    defaultData.position =
      defaultGameData.tugStart * 2 * defaultData.segmentLength;
    var totalLength =
      (defaultGameData.tugStart - 10) * defaultData.segmentLength;
    TweenMax.to(defaultData, 2, {
      position: totalLength,
      overwrite: true,
      onComplete: function () {
        roundData.followCamera = true;
        TweenMax.to(defaultData, 1, {
          overwrite: true,
          onComplete: function () {
            startGameRound();
          },
        });
      },
    });
  } else if (gameData.roundNum == 4) {
    TweenMax.to(defaultData, 1, {
      delay: 1,
      overwrite: true,
      onComplete: function () {
        startGameRound();
      },
    });
  } else if (gameData.roundNum == 5) {
    var totalLength = 6 * defaultData.segmentLength;

    TweenMax.to(defaultData, 2, {
      position: totalLength,
      overwrite: true,
      onComplete: function () {
        showPreGameQuestions(() => {
          startGameRound();
        });
      },
    });
  } else if (gameData.roundNum == 6) {
    var totalLength = defaultGameData.survivalStart + gameSettings.game6.length;
    defaultData.position =
      (totalLength - totalLength / 5) * defaultData.segmentLength;

    TweenMax.to(defaultData, 2, {
      position: 6 * defaultData.segmentLength,
      overwrite: true,
      onComplete: function () {
        roundData.followCamera = true;
        startSurvivalGame();
      },
    });
  }
}

function loopPlayrMoveTimer() {
  TweenMax.to(roundData.lightData.moveTween, 0.1, {
    overwrite: true,
    onComplete: function () {
      loopPlayrMoveTimer();
      updatePlayerTime();
    },
  });
}

function updatePlayerTime() {
  for (var n = 1; n < players.length; n++) {
    if (players[n].moveTime > 0) {
      players[n].moveTime -= 100;
    }
  }
}

/*!!
 *
 * GAME ROUND BEGIN - This is the function that runs to start game round
 *
 */
export function startGameRound() {
  gameData.interact = true;

  if (gameData.roundNum == 1) {
    //DEVNOW
    loopPlayrMoveTimer();
    startGreenLightCount();
  } else if (gameData.roundNum == 2) {
    candyContainer.visible = true;
    candyContainer.alpha = 0;

    TweenMax.to(candyContainer, 0.5, {
      alpha: 1,
      overwrite: true,
      onComplete: async function () {
        await showInstructionModal(
          `🍬 Solo los más pacientes y precisos lograrán superar esta dulce prueba…

📚 Antes de empezar, responde unas preguntas.
❌ Cada error te restará 5 segundos del tiempo total.

🖱️ Luego, usa tu dedo, mouse o cursor para recortar la figura sin romper la galleta.

⏱️ ¡Tienes tiempo limitado, así que ve con cuidado y precisión!
💥 Si rompes el borde… ¡quedarás eliminado!

✨ Pulso firme, mente fría…`
        );

        startCandyGame();
      },
    });
  } else if (gameData.roundNum == 3) {
    startTugGame();
  } else if (gameData.roundNum == 4) {
    handContainer.visible = true;
    handContainer.alpha = 0;

    $.sprites["handWrap" + 0].x -= 200;
    $.sprites["handWrap" + 1].x += 200;

    resetMarbleGame();

    TweenMax.to($.sprites["handWrap" + 0], 0.5, { x: 0, overwrite: true });
    TweenMax.to($.sprites["handWrap" + 1], 0.5, { x: 0, overwrite: true });

    TweenMax.to(handContainer, 0.5, {
      alpha: 1,
      overwrite: true,
      onComplete: async function () {
        await showInstructionModal(
          `🟢 JUEGO DE LAS CANICAS 🟢

📚 Antes de jugar, responde unas preguntas.
❌ Por cada error, perderás 5 segundos de tu tiempo total.

🎮 En el juego, deberás adivinar si la posición de las canicas de tu oponente está arriba o abajo.
✔️ Cada acierto te acerca a la victoria… ❌ cada fallo, a la eliminación. 💀

¡Piensa bien, juega con estrategia y no te confíes!
¿Sobrevivirás al juego de las canicas?`
        );

        showPreGameQuestions(() => {
          changeMarbleTurn();
        });
      },
    });
  } else {
  }

  toggleGameTimer(true);
  toggleGameInstruction(true);
}

/*!!
 *
 * GAME CONTROL - This is the function that runs for game control
 *
 */
export function toggleGameControl(type, con) {
  if (gameData.ended) {
    return;
  }

  if (!gameData.interact) {
    return;
  }

  toggleGameInstruction(false);

  if (gameData.roundNum == 1) {
    if (type == "mousedown") {
      roundData.lightData.forward = true;
      roundData.lightData.stop = false;
      players[0].sprite.sprite.gotoAndPlay("run");
    } else if (type == "pressup") {
      roundData.lightData.forward = false;
      roundData.lightData.stop = true;
      players[0].sprite.sprite.gotoAndPlay("idle");
    }
  } else if (gameData.roundNum == 2) {
    if (type == "mousedown") {
    }
  } else if (gameData.roundNum == 3) {
    if (type == "click") {
      playerTugAction();
    }
  } else if (gameData.roundNum == 4) {
    if (type == "mousedown") {
    }
  } else if (gameData.roundNum == 5) {
    if (type == "click") {
      moveFrontPlayer();
    }
  } else if (gameData.roundNum == 6) {
    if (type == "mousedown") {
      var controlDis = getDistance(
        stage.mouseX,
        stage.mouseY,
        itemControl.x,
        itemControl.y
      );
      if (controlDis < 100) {
        roundData.survivalData.move = true;
        itemControl.alpha = 0.5;
      }
    } else if (type == "pressup") {
      roundData.survivalData.move = false;
      itemControl.alpha = 1;
    }
  }
}

export function stopGame() {
  gameData.paused = true;

  toggleChooseNumber();
  stopSoundLoop("soundRope");
  toggleGameTimer(false);
  TweenMax.killAll();
}

/*!
 *
 * SAVE GAME - This is the function that runs to save game
 *
 */
export function saveGame(score) {
  if (typeof toggleScoreboardSave == "function") {
    $.scoreData.score = score;
    if (typeof type != "undefined") {
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
export function updateGame() {
  for (var n = 0; n < gameData.money.length; n++) {
    var thisMoney = gameData.money[n];
    thisMoney.y += thisMoney.speed;
    thisMoney.rotation += thisMoney.rotateSpeed;

    if (thisMoney.y > thisMoney.maxY) {
      thisMoney.rotation = 0;
      thisMoney.y = thisMoney.oriY;
    }
  }

  if (curPage == "game") {
    if (!gameData.paused) {
      updateWorld();
    }
  } else {
    updateWorld();
  }

  if (!gameData.paused) {
    if (timeData.enable) {
      timeData.nowDate = new Date();
      timeData.elapsedTime = Math.floor(
        timeData.nowDate.getTime() - timeData.startDate.getTime()
      );
      timeData.timer = Math.floor(timeData.countdown - timeData.elapsedTime);

      if (timeData.oldTimer == -1) {
        timeData.oldTimer = timeData.timer;
      }

      if (timeData.timer <= 0) {
        //stop
        if (gameData.roundNum == 6) {
          stopSurvivalRound();
        } else {
          endGame(false, true);
        }
      } else {
        if (timeData.oldTimer - timeData.timer > 1000) {
          if (timeData.timer < 1000) {
            playSound("soundCountdownEnd");
          } else if (timeData.timer < 6000) {
            playSound("soundCountdownClose");
          } else {
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
export function toggleGameTimer(con) {
  if (con) {
    timeData.startDate = new Date();
  } else {
  }
  timeData.enable = con;
}

/*!
 *
 * UPDATE WORLD - This is the function that runs to update game world
 *
 */
function updateWorld() {
  updateSprites();
  renderWorld();
}

function updateSprites() {
  var n;
  var dt = 1 / 60;
  var playerSegment = findSegment(defaultData.position + defaultData.playerZ);
  var playerW = 90 * defaultData.scale;
  var speedPercent = defaultData.speed / worldData.maxSpeed;
  var stageMouseX = (stage.mouseX - canvasW / 2) * defaultData.turnSpeed;
  var dx = dt * Math.abs(stageMouseX) * speedPercent;
  var startPosition = defaultData.position;

  updatePlayers(dt);

  defaultData.position = getIncrease(
    defaultData.position,
    dt * defaultData.speed,
    defaultData.trackLength
  );

  if (gameData.roundNum == 6) {
    var controlX = stage.mouseX - canvasW / 2;
    if (Math.abs(controlX) > 40 && roundData.survivalData.move) {
      dx = 0.008;
    }
  }

  if (stageMouseX < 0) {
    defaultData.playerX = defaultData.playerX - dx;
  } else {
    defaultData.playerX = defaultData.playerX + dx;
  }

  defaultData.playerX =
    defaultData.playerX -
    dx * speedPercent * playerSegment.curve * defaultData.centrifugal;

  if (roundData.lightData.forward) {
    defaultData.speed = getAccelerate(defaultData.speed, worldData.accel, dt);
  } else if (roundData.lightData.stop) {
    defaultData.speed = getAccelerate(
      defaultData.speed,
      defaultData.breaking,
      dt
    );
  } else {
    defaultData.speed = getAccelerate(defaultData.speed, defaultData.decel, dt);
  }

  if (defaultData.playerX < -1 || defaultData.playerX > 1) {
    if (defaultData.speed > defaultData.offRoadLimit)
      defaultData.speed = getAccelerate(
        defaultData.speed,
        defaultData.offRoadDecel,
        dt
      );
  }

  if (gameData.roundNum == 1) {
    for (n = 0; n < playerSegment.players.length; n++) {
      let player = playerSegment.players[n];
      if (player.index != 0) {
        let thisPlayerW = player.sprite.w * defaultData.scale;
        if (defaultData.speed > player.speed) {
          if (
            getOverlap(
              defaultData.playerX,
              playerW,
              player.offset,
              thisPlayerW,
              0.8
            )
          ) {
            defaultData.speed =
              player.speed * (player.speed / defaultData.speed);
            defaultData.position = getIncrease(
              player.z,
              -defaultData.playerZ,
              defaultData.trackLength
            );
            break;
          }
        }
      }
    }
  }

  defaultData.playerX = getLimit(defaultData.playerX, -2, 2); // dont ever let it go too far out of bound
  defaultData.speed = getLimit(defaultData.speed, 0, worldData.maxSpeed); // or exceed defaultData.maxSpeed

  defaultData.skyOffset = getIncrease(
    defaultData.skyOffset,
    (defaultData.skySpeed *
      playerSegment.curve *
      (defaultData.position - startPosition)) /
      defaultData.segmentLength,
    1
  );
  defaultData.hillOffset = getIncrease(
    defaultData.hillOffset,
    (defaultData.hillSpeed *
      playerSegment.curve *
      (defaultData.position - startPosition)) /
      defaultData.segmentLength,
    1
  );
  defaultData.treeOffset = getIncrease(
    defaultData.treeOffset,
    (defaultData.treeSpeed *
      playerSegment.curve *
      (defaultData.position - startPosition)) /
      defaultData.segmentLength,
    1
  );

  if (defaultData.position > defaultData.playerZ) {
    if (currentLapTime && startPosition < defaultData.playerZ) {
    } else {
      currentLapTime += dt;
    }
  }
}

export function updatePlayerFrame(index, action) {
  if (players[index].action != action) {
    players[index].action = action;
    players[index].sprite.sprite.gotoAndPlay(action);

    if (action == "dead") {
      players[index].sprite.numberTxt.text = "";

      var randomFrame = Math.floor(Math.random() * 3);
      players[index].sprite.sprite.gotoAndStop(4 + randomFrame);

      if (gameData.roundNum != 6) {
        playSound("soundShot" + (randomFrame + 1));
      }
    }
  }
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

  var baseSegment = findSegment(defaultData.position);
  var basePercent = percentRemaining(
    defaultData.position,
    defaultData.segmentLength
  );
  var playerSegment = findSegment(defaultData.position + defaultData.playerZ);
  var playerPercent = percentRemaining(
    defaultData.position + defaultData.playerZ,
    defaultData.segmentLength
  );
  var playerY = getInterpolate(
    playerSegment.p1.world.y,
    playerSegment.p2.world.y,
    playerPercent
  );
  var maxy = defaultData.height + defaultData.extraHeight;

  var x = 0;
  var dx = -(baseSegment.curve * basePercent);

  worldContainer.removeAllChildren();

  renderBackground(
    background,
    defaultData.width,
    defaultData.height,
    gameSettings["game" + gameData.roundNum].background.base0,
    defaultData.bgOffset,
    resolution * defaultData.bgSpeed * playerY
  );
  renderBackground(
    background,
    defaultData.width,
    defaultData.height,
    gameSettings["game" + gameData.roundNum].background.base1,
    defaultData.skyOffset,
    resolution * defaultData.skySpeed * playerY
  );
  renderBackground(
    background,
    defaultData.width,
    defaultData.height,
    gameSettings["game" + gameData.roundNum].background.base2,
    defaultData.hillOffset,
    resolution * defaultData.hillSpeed * playerY
  );
  renderBackground(
    background,
    defaultData.width,
    defaultData.height,
    gameSettings["game" + gameData.roundNum].background.base3,
    defaultData.treeOffset,
    resolution * defaultData.treeSpeed * playerY
  );

  var n, i, segment, car, sprite, spriteScale, spriteX, spriteY;

  for (n = 0; n < defaultData.drawDistance; n++) {
    var segmentIndex = baseSegment.index + n;

    segment = segments[segmentIndex % segments.length];
    segment.looped = segment.index < baseSegment.index;
    segment.fog = exponentialFog(
      n / defaultData.drawDistance,
      gameSettings["game" + gameData.roundNum].path.fogDensity
    );
    segment.clip = maxy;

    getProject(
      segment.p1,
      defaultData.playerX *
        gameSettings["game" + gameData.roundNum].path.width -
        x,
      playerY + worldData.cameraHeight,
      defaultData.position - (segment.looped ? defaultData.trackLength : 0),
      defaultData.cameraDepth,
      defaultData.width,
      defaultData.height,
      gameSettings["game" + gameData.roundNum].path.width
    );
    getProject(
      segment.p2,
      defaultData.playerX *
        gameSettings["game" + gameData.roundNum].path.width -
        x -
        dx,
      playerY + worldData.cameraHeight,
      defaultData.position - (segment.looped ? defaultData.trackLength : 0),
      defaultData.cameraDepth,
      defaultData.width,
      defaultData.height,
      gameSettings["game" + gameData.roundNum].path.width
    );

    x = x + dx;
    dx = dx + segment.curve;

    if (
      segment.p1.camera.z <= defaultData.cameraDepth || // behind us
      segment.p2.screen.y >= segment.p1.screen.y || // back face cull
      segment.p2.screen.y >= maxy
    )
      // clip by (already rendered) hill
      continue;

    defaultData.lastY = segment.p1.screen.y;
    // render the road
    renderSegment(
      defaultData.width,
      segment.p1.screen.x,
      segment.p1.screen.y,
      segment.p1.screen.w,
      segment.p2.screen.x,
      segment.p2.screen.y,
      segment.p2.screen.w,
      segment.fog,
      segment.color,
      segmentIndex
    );

    maxy = segment.p1.screen.y;
  }

  for (n = defaultData.drawDistance - 1; n > 0; n--) {
    segment = segments[(baseSegment.index + n) % segments.length];

    for (i = 0; i < segment.players.length; i++) {
      if (!segment.players[i]) {
        break;
      }
      let player = segment.players[i];
      let spriteScale = getInterpolate(
        segment.p1.screen.scale,
        segment.p2.screen.scale,
        player.percent
      );
      let spriteX =
        getInterpolate(
          segment.p1.screen.x,
          segment.p2.screen.x,
          player.percent
        ) +
        (spriteScale *
          player.offset *
          gameSettings["game" + gameData.roundNum].path.width *
          defaultData.width) /
          2;
      let spriteY = getInterpolate(
        segment.p1.screen.y,
        segment.p2.screen.y,
        player.percent
      );

      if (player.active)
        renderSprite(
          defaultData.width,
          defaultData.height,
          resolution,
          gameSettings["game" + gameData.roundNum].path.width,
          sprites,
          player.sprite,
          spriteScale,
          spriteX,
          spriteY,
          -0.5,
          -1,
          segment.clip
        );
    }

    for (i = 0; i < segment.sprites.length; i++) {
      sprite = segment.sprites[i];
      spriteScale = segment.p1.screen.scale;
      spriteX =
        segment.p1.screen.x +
        (spriteScale *
          sprite.offset *
          gameSettings["game" + gameData.roundNum].path.width *
          defaultData.width) /
          2;
      spriteY = segment.p1.screen.y;

      if (sprite.active)
        renderSprite(
          defaultData.width,
          defaultData.height,
          resolution,
          gameSettings["game" + gameData.roundNum].path.width,
          sprites,
          sprite.source,
          spriteScale,
          spriteX,
          spriteY,
          -0.5,
          -1,
          segment.clip
        );
    }
  }
}

export function findSegment(z) {
  return segments[Math.floor(z / defaultData.segmentLength) % segments.length];
}

/*!
 *
 * BUILD ROAD - This is the function that runs to build road
 *
 */
function getLastY() {
  return segments.length == 0 ? 0 : segments[segments.length - 1].p2.world.y;
}

function addSegment(curve, y) {
  var n = segments.length;
  var segmentColor = {};
  var totalLane = 2;

  if (Math.floor(n / totalLane) % 2) {
    segmentColor.base =
      gameSettings["game" + gameData.roundNum].path.light.base;
    segmentColor.path =
      gameSettings["game" + gameData.roundNum].path.light.path;
    segmentColor.glass =
      gameSettings["game" + gameData.roundNum].path.light.glass;
    segmentColor.holder =
      gameSettings["game" + gameData.roundNum].path.light.holder;
    segmentColor.rope =
      gameSettings["game" + gameData.roundNum].path.light.rope;
    segmentColor.side =
      gameSettings["game" + gameData.roundNum].path.light.side;
    segmentColor.line =
      gameSettings["game" + gameData.roundNum].path.light.line;
  } else {
    segmentColor.base = gameSettings["game" + gameData.roundNum].path.dark.base;
    segmentColor.path = gameSettings["game" + gameData.roundNum].path.dark.path;
    segmentColor.glass =
      gameSettings["game" + gameData.roundNum].path.dark.glass;
    segmentColor.holder =
      gameSettings["game" + gameData.roundNum].path.dark.holder;
    segmentColor.rope = gameSettings["game" + gameData.roundNum].path.dark.rope;
    segmentColor.side = gameSettings["game" + gameData.roundNum].path.dark.side;
    segmentColor.line = gameSettings["game" + gameData.roundNum].path.dark.line;
  }

  segments.push({
    index: n,
    p1: {
      world: { y: getLastY(), z: n * defaultData.segmentLength },
      camera: {},
      screen: {},
    },
    p2: {
      world: { y: y, z: (n + 1) * defaultData.segmentLength },
      camera: {},
      screen: {},
    },
    curve: curve,
    sprites: [],
    players: [],
    color: segmentColor,
  });
}

function addSprite(n, sprite, offset) {
  segments[n].sprites.push({ source: sprite, offset: offset, active: true });
}

function addPath(enter, hold, leave, curve, y) {
  var startY = getLastY();
  var endY = startY + toInt(y, 0) * defaultData.segmentLength;
  var n,
    total = enter + hold + leave;
  for (n = 0; n < enter; n++)
    addSegment(easeIn(0, curve, n / enter), easeInOut(startY, endY, n / total));
  for (n = 0; n < hold; n++)
    addSegment(curve, easeInOut(startY, endY, (enter + n) / total));
  for (n = 0; n < leave; n++)
    addSegment(
      easeInOut(curve, 0, n / leave),
      easeInOut(startY, endY, (enter + hold + n) / total)
    );
}

/*!
 *
 * RESET WORLD - This is the function that runs to reset game world
 *
 */

export function resetWorld() {
  defaultData.maxSpeed = defaultData.segmentLength / (1 / 60);
  defaultData.accel = defaultData.maxSpeed / 5;
  defaultData.breaking = -defaultData.maxSpeed;
  defaultData.decel = -defaultData.maxSpeed / 5;
  defaultData.offRoadDecel = -defaultData.maxSpeed / 2;
  defaultData.offRoadLimit = defaultData.maxSpeed / 4;

  defaultData.cameraDepth =
    1 / Math.tan(((defaultData.fieldOfView / 2) * Math.PI) / 180);
  defaultData.playerZ =
    roundData.players.playerZ * defaultData.segmentLength +
    defaultData.segmentLength / 2; //(defaultData.cameraHeight * defaultData.cameraDepth) + 400;
  defaultData.oriPlayerZ = defaultData.playerZ;
  resolution = defaultData.height / 1024;

  for (var key in defaultData) {
    worldData[key] = defaultData[key]; // Ensure segments array is reset
  }
}

function resetPath() {
  segments = [];

  var pathLength = 100;
  if (gameData.roundNum == 0) {
    addPath(pathLength, pathLength, pathLength, 0, 0);

    var pos = [-0.5, -0.2, 0.2, 0.5];
    for (var n = 0; n < pos.length; n++) {
      var guardIndex = Math.floor(Math.random() * guards_arr.length);
      addSprite(25, $.sprites["guard" + guardIndex], pos[n]);
    }
  } else if (gameData.roundNum == 1) {
    pathLength = gameSettings.game1.length;
    addPath(pathLength, pathLength, pathLength, 0, 0);
    segments[pathLength].color.path = gameSettings.game1.path.end;

    var pos = [-0.5, -0.2, 0.2, 0.5];
    for (var n = 0; n < pos.length; n++) {
      var guardIndex = Math.floor(Math.random() * guards_arr.length);
      addSprite(pathLength + 10, $.sprites["guard" + guardIndex], pos[n]);
    }

    addSprite(pathLength + 3, $.sprites["game1tree"], 0);
    addSprite(pathLength + 2, $.sprites["game1doll"], 0);
  } else if (gameData.roundNum == 2) {
    addPath(pathLength, pathLength, pathLength, 0, 0);

    var totalGuards = Math.floor(gameSettings.game2.players / 2);
    for (var n = 0; n < totalGuards; n++) {
      var guardIndex = Math.floor(Math.random() * guards_arr.length);
      addSprite(
        randomInt(roundData.players.startZ, roundData.players.endZ),
        $.sprites["guard" + guardIndex],
        Math.random() * randomChoice([-0.8, 0.8])
      );
    }
  } else if (gameData.roundNum == 3) {
    addPath(pathLength, pathLength, pathLength, 0, 0);

    var totalLength =
      defaultGameData.tugStart +
      defaultGameData.tugHole +
      gameSettings.game3.players;
    addSprite(totalLength, $.sprites["game3construct"], 0);
  } else if (gameData.roundNum == 4) {
    addPath(pathLength, pathLength, pathLength, 0, 0);

    var totalGuards = Math.floor(gameSettings.game4.players / 2);
    for (var n = 0; n < totalGuards; n++) {
      var guardIndex = Math.floor(Math.random() * guards_arr.length);
      addSprite(
        randomInt(roundData.players.startZ, roundData.players.endZ),
        $.sprites["guard" + guardIndex],
        Math.random() * randomChoice([-0.8, 0.8])
      );
    }
  } else if (gameData.roundNum == 5) {
    addPath(pathLength, pathLength, pathLength, 0, 0);

    var totalLength =
      gameSettings.game5.length * defaultGameData.bridgeSteps +
      defaultGameData.bridgeStart;
    var pos = [-0.5, -0.2, 0.2, 0.5];
    for (var n = 0; n < pos.length; n++) {
      var guardIndex = Math.floor(Math.random() * guards_arr.length);
      addSprite(totalLength + 7, $.sprites["guard" + guardIndex], pos[n]);
    }

    addSprite(totalLength + 10, $.sprites["game5booth"], 0);
  } else if (gameData.roundNum == 6) {
    addPath(pathLength, pathLength, pathLength, 0, 0);

    segments[defaultGameData.survivalStart].color.path =
      gameSettings.game6.path.end;
    segments[
      defaultGameData.survivalStart + gameSettings.game6.length
    ].color.path = gameSettings.game6.path.end;

    var totalLength =
      gameSettings.game5.length * defaultGameData.bridgeSteps +
      defaultGameData.bridgeStart;
    var pos = [-0.5, -0.2, 0.2, 0.5];
    for (var n = 0; n < pos.length; n++) {
      var guardIndex = Math.floor(Math.random() * guards_arr.length);
      addSprite(
        defaultGameData.survivalStart + gameSettings.game6.length + 3,
        $.sprites["guard" + guardIndex],
        pos[n]
      );
    }
  }
  resetPlayers();
  defaultData.trackLength = segments.length * defaultData.segmentLength;
}

function resetPlayers() {
  players = [];
  cacheContainer.removeAllChildren();

  var n, player, segment, offset, z, speed;
  var playerTurnIndex = 0;
  var halfPeople = Math.floor(gameSettings.game3.players / 2);

  for (var n = 0; n < roundData.totalPlayers; n++) {
    var randomSegment = randomInt(
      roundData.players.startZ,
      roundData.players.endZ
    );
    offset = Math.random() * randomChoice([-0.8, 0.8]);
    z = randomSegment * defaultData.segmentLength;
    speed = randomInt(
      defaultGameData.playerSpeed[0],
      defaultGameData.playerSpeed[1]
    );

    var playerContainer = new createjs.Container();
    var playerIndex = Math.floor(Math.random() * players_arr.length);
    playerContainer.sprite = $.sprites["player" + playerIndex].clone();
    playerContainer.sprite.framerate = randomInt(15, 25);
    playerContainer.sprite.gotoAndPlay("idle");

    playerContainer.numberTxt = new createjs.Text();
    playerContainer.numberTxt.font = "13px kimberleyblack";
    playerContainer.numberTxt.color = "#fff";
    playerContainer.numberTxt.textAlign = "center";
    playerContainer.numberTxt.textBaseline = "alphabetic";
    playerContainer.numberTxt.text = randomPlayerNumber();
    playerContainer.numberTxt.x = $.sprites["player" + playerIndex].w / 2;
    playerContainer.numberTxt.y = 57;

    playerContainer.addChild(playerContainer.sprite, playerContainer.numberTxt);
    playerContainer.w = $.sprites["player" + playerIndex].w;
    playerContainer.h = $.sprites["player" + playerIndex].h;

    cacheContainer.addChild(playerContainer);

    if (roundData.playerSet) {
      var getSegment = roundData.turnArr[playerTurnIndex];
      if (gameData.roundNum == 3) {
        speed = 0;
        offset = n % 2 == 0 ? -0.02 : 0.02;

        if (n == roundData.totalPlayers - 1) {
          playerContainer.sprite = itemCenter.clone();
          playerContainer.removeAllChildren();
          playerContainer.addChild(playerContainer.sprite);

          offset = 0;
        } else if (n >= halfPeople - 1) {
          playerContainer.sprite.gotoAndPlay("front");
        }
      } else if (gameData.roundNum == 5) {
        offset = Math.random() * randomChoice([-0.1, 0.1]);

        getSegment =
          defaultGameData.bridgeStart -
          1 -
          roundData.bridgeData.turnArr[playerTurnIndex];
      } else if (gameData.roundNum == 6) {
        offset = Math.random() * randomChoice([-0.2, 0.2]);
      }

      getSegment = getSegment < 0 ? 0 : getSegment;
      z = getSegment * defaultData.segmentLength;

      if (n == 0) {
        roundData.players.playerZ = getSegment;
        playerContainer.numberTxt.text = roundData.playerNumber;
      }

      playerTurnIndex++;
    } else {
      if (n == 0) {
        offset = 0;
        z = roundData.players.playerZ;
        playerContainer.sprite.framerate = 20;
        playerContainer.numberTxt.text = roundData.playerNumber;
      }
    }

    player = {
      index: n,
      offset: offset,
      z: z,
      sprite: playerContainer,
      speed: speed,
      moveTime: 0,
      sandTime: 0,
      active: true,
      status: "",
      action: "idle",
    };
    segment = findSegment(player.z);
    segment.players.push(player);
    players.push(player);
  }
}

export function randomPlayerNumber() {
  var playerNumber = randomInt(1, 999);
  return pad(playerNumber, 3);
}

/*!
 *
 * END GAME - This is the function that runs for end game, meaning when each round is finished
 *
 */
export function endGame(win, timer) {
  if (!gameData.ended) {
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

    if (win) {
      //calculate score
      if (gameData.roundNum == 6) {
        var lifeLeft = roundData.survivalData.userHealth;
        var roundScore = lifeLeft * 0.05;
      } else {
        var timeLeft =
          gameSettings["game" + gameData.roundNum].timer - timeData.timer;
        var roundScore = Math.round(timeLeft * 0.0005);
      }

      playerData.score += Math.round(roundScore);

      /** HERE THE PLAYER SCORE is going to be UPDATED TO THE DATABASE FIRESTORE */
      alert("Ganaste: " + roundScore + " puntos");
      updateScore(roundScore);
    } else if (!win) {
      var deadArr = [1, 2, 4];
      if (deadArr.indexOf(gameData.roundNum) != -1) {
        updatePlayerFrame(0, "dead");
      }
    }

    TweenMax.to(resultContainer, 0, {
      delay: 0.8,
      overwrite: true,
      onComplete: function () {
        if (!win) {
          displayGameRound(false, false);
        } else {
          displayGameRound(false, true);
        }

        TweenMax.to(resultContainer, 3, {
          delay: 0,
          overwrite: true,
          onComplete: function () {
            if (playerData.win) {
              var newRound = gameData.roundNum + 1;
              if (newRound <= gameData.totalRound) {
                gameData.roundNum = newRound;

                stopGame();
                startGame();
                resetWorld();
                resetPath();
              } else {
                goPage("result");
              }
            } else {
              goPage("result");
            }
          },
        });
      },
    });
  }

  if (timer) {
    if (gameData.roundNum == 1) {
      TweenMax.killTweensOf(roundData.lightData);
      TweenMax.killTweensOf(roundData.lightData.moveTween);
      TweenMax.killTweensOf(roundData.lightData.timeTween);

      for (var n = 1; n < players.length; n++) {
        players[n].speed = 0;
        players[n].moveTime = 0;

        if (players[n].status != "dead") {
          if (players[n].status != "complete") {
            players[n].status = "nextDead";
          }
        }
      }

      loopPlayerDead();
    } else if (gameData.roundNum == 3) {
      gameData.paused = true;
      stopSoundLoop("soundRope");
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

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  return minutes + ":" + seconds;
}

/*!
 *
 * OPTIONS - This is the function that runs to mute and fullscreen
 *
 */
function toggleSoundMute(con) {
  buttonSoundOff.visible = false;
  buttonSoundOn.visible = false;
  toggleSoundInMute(con);
  if (con) {
    buttonSoundOn.visible = true;
  } else {
    buttonSoundOff.visible = true;
  }
}

function toggleMusicMute(con) {
  buttonMusicOff.visible = false;
  buttonMusicOn.visible = false;
  toggleMusicInMute(con);
  if (con) {
    buttonMusicOn.visible = true;
  } else {
    buttonMusicOff.visible = true;
  }
}

function toggleFullScreen() {
  if (
    !document.fullscreenElement && // alternative standard method
    !document.mozFullScreenElement &&
    !document.webkitFullscreenElement &&
    !document.msFullscreenElement
  ) {
    // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(
        Element.ALLOW_KEYBOARD_INPUT
      );
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
function toggleOption() {
  if (optionsContainer.visible) {
    optionsContainer.visible = false;
  } else {
    optionsContainer.visible = true;
  }
}
