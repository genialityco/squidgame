
import { updatePlayerFrame } from "../game.js"; // Import player helper
import { defaultGameData, roundData, players, gameData, endGame,findSegment,defaultData } from "../game.js"; // Import shared variables
import { gameSettings } from '../gameSettings.js';

export function updatePlayers(dt) {
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