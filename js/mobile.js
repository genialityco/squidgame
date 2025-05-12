import { isTablet } from './helpers/device.js'; // Import isTablet helper
import { viewport } from './main.js'; // Import viewport
import { changeViewport } from './canvas.js'; // Import changeViewport

////////////////////////////////////////////////////////////
// MOBILE
////////////////////////////////////////////////////////////
var resizeTimer;

/*!
 * 
 * START MOBILE CHECK - This is the function that runs for mobile event
 * 
 */
export function checkMobileEvent(){
	if($.browser.mobile || isTablet()){
		$( window ).off('orientationchange').on( "orientationchange", function( event ) {
			$('#canvasHolder').hide();
			$('#rotateHolder').hide();
			
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(checkMobileOrientation, 1000);
		});
		
		checkMobileOrientation();
	}
}

/*!
 * 
 * MOBILE ORIENTATION CHECK - This is the function that runs to check mobile orientation
 * 
 */
export function checkMobileOrientation() {
	var isLandscape=false;
	
	if(window.innerWidth>window.innerHeight){
		isLandscape=true;
	}
	
	viewport.isLandscape = isLandscape;
	
	changeViewport(viewport.isLandscape);
	resizeGameFunc();
	$('#canvasHolder').show();
}

/*!
 * 
 * TOGGLE ROTATE MESSAGE - This is the function that runs to display/hide rotate instruction
 * 
 */
function toggleRotate(con){
	if(con){
		$('#rotateHolder').fadeIn();
	}else{
		$('#rotateHolder').fadeOut();		
	}
	resizeGameFunc();
}

export function resizeGameFunc() {
	// Placeholder implementation or actual logic for resizing the game
	console.log("resizeGameFunc called");
}