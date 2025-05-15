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
        name:'LUZ ROJA, LUZ VERDE',
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
        timer:15000
    },
    game2:{
        name:'GALLETA DALGONA',
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
        timer:15000
    },
    game3:{
        name:'TIRA Y AFLOJA',
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
        timer:15000
    },
    game4:{
        name:'CANICAS',
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
        timer:40000
    },
    game5:{
        name:'PUENTE DE CRISTAL',
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
        players:8,
        length:15,
        timer:20000
    },
    game6:{
        name:'SUPERVIVENCIA',
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