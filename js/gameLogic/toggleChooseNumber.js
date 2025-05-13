import { roundData } from "../game.js"; // Import shared variables

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

export function loopChooseNumber() {
    clearInterval(chooseNumberData.interval);
    chooseNumberData.interval = setInterval(loopChooseNumber, chooseNumberData.timer);
    chooseNumberData.timer -= 10;
    chooseNumberData.timer = chooseNumberData.timer < chooseNumberData.min ? chooseNumberData.max : chooseNumberData.timer;
    updateChooseNumber();
}

export function updateChooseNumber() {
    chooseNumberData.number += roundData.bet;
    chooseNumberData.number = Math.max(1, Math.min(999, chooseNumberData.number));
    roundData.playerNumber = pad(chooseNumberData.number, 3);
    numberTxt.text = roundData.playerNumber;
}
