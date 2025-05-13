import {worldContainer, canvasH} from './canvas.js';
import { gameData, defaultGameData, gameSettings,defaultData,roundData} from './game.js';


export function renderPolygon(x1, y1, x2, y2, x3, y3, x4, y4, color, alpha, index){
	var shape = new createjs.Shape();
	shape.graphics.beginFill(color)
				.beginStroke()
				.moveTo(x1, y1)
				.lineTo(x2, y2)
				.lineTo(x3, y3)
				.lineTo(x4, y4)
				.endStroke();

	shape.alpha = alpha == undefined ? 1 : alpha;
	worldContainer.addChild(shape);

	if(index != undefined){
		worldContainer.setChildIndex(shape, 10);
	}
}

export function renderSegment(width, x1, y1, w1, x2, y2, w2, fog, color, index){
	var shape = new createjs.Shape();
	shape.graphics.beginFill(color.base).drawRect(0, y2, width, y1 - y2);
	worldContainer.addChild(shape);
    
	if(gameData.roundNum == 3){
		var holeLength = defaultGameData.tugHole;
		var totalLength = (holeLength) + defaultGameData.tugStart;
		if(index < defaultGameData.tugStart || index >= totalLength + 2){
			if(index >= totalLength + 2 && index <= totalLength + 4){
				renderPolygon(x1-w1, y1, x1+w1, y1, x1+w1, y2+canvasH, x2-w2, y2+canvasH, gameSettings['game'+gameData.roundNum].path.fog, 1, 1, worldContainer);
			}

			renderPolygon(x1-w1, y1, x1+w1, y1, x2+w2, y2, x2-w2, y2, color.path, worldContainer);
			
			var sideW = 10;
			var holderData = {
				space1:w1/100 * holderSpace,
				space2:w2/100 * holderSpace,
				w1:w1/100 * sideW,
				w2:w2/100 * sideW,
			}
			renderPolygon(x1-w1-holderData.w1, y1, x1-w1, y1, x2-w2, y2, x2-w2-holderData.w2, y2, color.side, worldContainer);
    		renderPolygon(x1+w1+holderData.w1, y1, x1+w1, y1, x2+w2, y2, x2+w2+holderData.w2, y2, color.side, worldContainer);
		}

		var holderSpace = 0;
		var ropeW = defaultGameData.ropeWidth;
		var ropeY = defaultGameData.ropeY;
		var holderData = {
			space1:w1/100 * 0,
			space2:w2/100 * 0,
			w1:w1/100 * ropeW,
			w2:w2/100 * ropeW,
		}

		renderPolygon(x1-holderData.w1, y1-ropeY, x1-holderData.space1, y1-ropeY, x2-holderData.space2, y2-ropeY, x2-holderData.w2, y2-ropeY, color.rope, worldContainer);
		renderPolygon(x1+holderData.w1, y1-ropeY, x1+holderData.space1, y1-ropeY, x2+holderData.space2, y2-ropeY, x2+holderData.w2, y2-ropeY, color.rope, worldContainer);
	}else if(gameData.roundNum == 5){
		var glassW = defaultGameData.bridgeGlassWidth;
		var holderW = defaultGameData.bridgeGlassHoldWidth;
		var holderSpace = defaultGameData.bridgeGlassHoldSpace;

		var glassData = {
			space1:w1/100 * 5,
			space2:w2/100 * 5,
			w1:w1/100 * glassW,
			w2:w2/100 * glassW,
		}

		var findIndex = index - (defaultGameData.bridgeStart + 2);
		for(var n=0; n<roundData.bridgeData.seqArr.length; n++){
			var firstIndex = n * defaultGameData.bridgeSteps;
			var nextIndex = firstIndex + 1;

			var renderCon = false;
			if(firstIndex == findIndex){
				renderCon = true;
			}else if(nextIndex == findIndex){
				renderCon = true;
			}

			if(renderCon){
				var glassLeft = color.glass;
				var glassRight = color.glass;

				if(roundData.bridgeData.seqArr[n].fail){
					if(roundData.bridgeData.seqArr[n].side == 1){
						glassLeft = '';
					}else{
						glassRight = '';
					}
				}

				renderPolygon(x1-glassData.w1, y1, x1-glassData.space1, y1, x2-glassData.space2, y2, x2-glassData.w2, y2, glassLeft, gameSettings.game5.glassAlpha, worldContainer);
				renderPolygon(x1+glassData.w1, y1, x1+glassData.space1, y1, x2+glassData.space2, y2, x2+glassData.w2, y2, glassRight, gameSettings.game5.glassAlpha, worldContainer);
			}
		}

		var holderData = {
			space1:w1/100 * holderSpace,
			space2:w2/100 * holderSpace,
			w1:w1/100 * holderW,
			w2:w2/100 * holderW,
		}

		renderPolygon(x1-holderData.w1, y1, x1-holderData.space1, y1, x2-holderData.space2, y2, x2-holderData.w2, y2, color.holder, worldContainer);
		renderPolygon(x1+holderData.w1, y1, x1+holderData.space1, y1, x2+holderData.space2, y2, x2+holderData.w2, y2, color.holder, worldContainer);

		var holderData = {
			space1:w1/100 * glassW,
			space2:w2/100 * glassW,
			w1:w1/100 * (glassW + (holderW - holderSpace)),
			w2:w2/100 * (glassW + (holderW - holderSpace)),
		}

		renderPolygon(x1-holderData.w1, y1, x1-holderData.space1, y1, x2-holderData.space2, y2, x2-holderData.w2, y2, color.holder, worldContainer);
		renderPolygon(x1+holderData.w1, y1, x1+holderData.space1, y1, x2+holderData.space2, y2, x2+holderData.w2, y2, color.holder, worldContainer);

		var totalLength = (gameSettings.game5.length * defaultGameData.bridgeSteps) + defaultGameData.bridgeStart;
		if(index < defaultGameData.bridgeStart || index >= totalLength + 2){
			if(index >= totalLength + 2 && index <= totalLength + 4){
				renderPolygon(x1-w1, y1, x1+w1, y1, x1+w1, y2+canvasH, x2-w2, y2+canvasH, gameSettings['game'+gameData.roundNum].path.fog, 1, 1, worldContainer);
			}

			renderPolygon(x1-w1, y1, x1+w1, y1, x2+w2, y2, x2-w2, y2, color.path, worldContainer);
		}
	}else if(gameData.roundNum == 6){
		if(index >= defaultGameData.survivalStart && index <= defaultGameData.survivalStart + gameSettings.game6.length){
			var sideW = 10;
			var holderData = {
				space1:w1/100 * holderSpace,
				space2:w2/100 * holderSpace,
				w1:w1/100 * sideW,
				w2:w2/100 * sideW,
			}
			renderPolygon(x1-w1-holderData.w1, y1, x1-w1, y1, x2-w2, y2, x2-w2-holderData.w2, y2, color.line, worldContainer);
    		renderPolygon(x1+w1+holderData.w1, y1, x1+w1, y1, x2+w2, y2, x2+w2+holderData.w2, y2, color.line, worldContainer);
		}

		renderPolygon(x1-w1, y1, x1+w1, y1, x2+w2, y2, x2-w2, y2, color.path, worldContainer);
	}else{
		renderPolygon(x1-w1, y1, x1+w1, y1, x2+w2, y2, x2-w2, y2, color.path, worldContainer);
	}
    
    renderFog(0, y1, width, y2-y1, fog, worldContainer, gameSettings, gameData);
}

export function renderBackground(background, width, height, layer, rotation, offset){
	var newBackground = $.background[layer.id].clone();
	var newBackgroundMirror = $.background[layer.id].clone();
    rotation = rotation || 0;
    offset   = offset   || 0;
	
	newBackground.x = rotation * layer.w;
	if(rotation > 0){
		newBackground.x = -(newBackground.x);	
	}else{
		newBackground.x = Math.abs(newBackground.x);	
	}
	
	var destY = (defaultData.lastY/defaultData.height) * .2;
	newBackground.y = destY+offset;
	
	worldContainer.addChild(newBackground, newBackgroundMirror);
	
	newBackgroundMirror.x = newBackground.x + layer.w;
	newBackgroundMirror.y = newBackground.y;
}

export function renderSprite(width, height, resolution, roadWidth, sprites, sprite, scale, destX, destY, offsetX, offsetY, clipY){
	var newSprite = sprite.clone(true);
	
	var destW  = (sprite.w * scale * width/2) * (defaultData.scale * roadWidth);
    var destH  = (sprite.h * scale * width/2) * (defaultData.scale * roadWidth);

    destX = destX + (destW * (offsetX || 0));
    destY = destY + (destH * (offsetY || 0));
	
    var clipH = clipY ? Math.max(0, destY+destH-clipY) : 0;
    if (clipH < destH){
		newSprite.x = destX;
		newSprite.y = destY;
		newSprite.scaleX = destW/sprite.w;
		newSprite.scaleY = (destH - clipH)/sprite.h;
		
		worldContainer.addChild(newSprite);
	}
}

export function renderFog(x, y, width, height, fog, worldContainer, gameSettings, gameData){
	if (fog < 1) {
		var shape = new createjs.Shape();
		shape.graphics.beginFill(gameSettings['game'+gameData.roundNum].path.fog).drawRect(x, y, width, height);
		shape.alpha = (1-fog);
		worldContainer.addChild(shape);
    }
}