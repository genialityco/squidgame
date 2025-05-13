/*!
 * 
 * SHARE - This is the function that runs to open share url
 * 
 */
export function share(action){
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