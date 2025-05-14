////////////////////////////////////////////////////////////
// MAIN
////////////////////////////////////////////////////////////
import { initGameCanvas, buildGameCanvas, resizeCanvas } from "./canvas.js"; // Import resizeCanvas
import { buildGameButton, goPage } from "./game.js"; // Import buildGameButton
import { checkMobileOrientation } from "./mobile.js"; // Import checkMobileOrientation
import { isTablet } from './helpers/device.js'; // Import isTablet helper
export var stageW = 1280;
export var stageH = 768;
var contentW = 1024;
var contentH = 576;

export var viewport = { isLandscape: true };
export var landscapeSize = { w: stageW, h: stageH, cW: contentW, cH: contentH };
export var portraitSize = { w: 768, h: 1024, cW: 576, cH: 900 };
export var offset = { x: 0, y: 0, left: 0, top: 0 };
/*!
 *
 * START BUILD GAME - This is the function that runs build game
 *
 */
export function initMain() {
  if (!$.browser.mobile || !isTablet()) {
    
    $("#canvasHolder").show();
    initGameCanvas(stageW, stageH);
    buildGameCanvas();
    buildGameButton();
    if (typeof buildScoreBoardCanvas == "function") {
      buildScoreBoardCanvas();
    }

    goPage("main");

    checkMobileOrientation();
    resizeCanvas();
  }
}

