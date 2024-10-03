function CMain(oData){
	var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;
    
    var _oPreloader;
    var _oMenu;
    var _oModeMenu;
    var _oHelp;
    var _oGame;

    this.initContainer = function(){
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
        createjs.Touch.enable(s_oStage);
		
	s_bMobile = jQuery.browser.mobile;
        if(s_bMobile === false){
            s_oStage.enableMouseOver(20);  
            $('body').on('contextmenu', '#canvas', function(e){ return false; });
        }
		
        s_iPrevTime = new Date().getTime();

	createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.setFPS(30);
        
        if(navigator.userAgent.match(/Windows Phone/i)){
                DISABLE_SOUND_MOBILE = true;
        }
        
        s_oSpriteLibrary  = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();
		
	
    };
    
    this.preloaderReady = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            this._initSounds();
        }
        
        this._loadImages();
        _bUpdate = true;
    };
    
    this.soundLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);

         if(_iCurResource === RESOURCE_TO_LOAD){
            this._onRemovePreloader();
         }
    };
    
    this._initSounds = function(){
         if (!createjs.Sound.initializeDefaultPlugins()) {
             return;
         }

        if(navigator.userAgent.indexOf("Opera")>0 || navigator.userAgent.indexOf("OPR")>0){
                createjs.Sound.alternateExtensions = ["mp3"];
                createjs.Sound.addEventListener("fileload", createjs.proxy(this.soundLoaded, this));

                createjs.Sound.registerSound("./sounds/ot_soundtrack.ogg", "soundtrack");
                createjs.Sound.registerSound("./sounds/press_button.ogg", "click");
                createjs.Sound.registerSound("./sounds/ot_game_over.ogg", "game_over");
                createjs.Sound.registerSound("./sounds/ot_click_cell.ogg", "click_cell", 10);
                createjs.Sound.registerSound("./sounds/ot_win.ogg", "win");
                createjs.Sound.registerSound("./sounds/drawer.ogg", "drawer");
                createjs.Sound.registerSound("./sounds/king.ogg", "king");
        }else{
                createjs.Sound.alternateExtensions = ["ogg"];
                createjs.Sound.addEventListener("fileload", createjs.proxy(this.soundLoaded, this));

                createjs.Sound.registerSound("./sounds/ot_soundtrack.mp3", "soundtrack");
                createjs.Sound.registerSound("./sounds/press_button.mp3", "click");
                createjs.Sound.registerSound("./sounds/ot_game_over.mp3", "game_over");
                createjs.Sound.registerSound("./sounds/ot_click_cell.mp3", "click_cell", 10);
                createjs.Sound.registerSound("./sounds/ot_win.mp3", "win");
                createjs.Sound.registerSound("./sounds/drawer.mp3", "drawer");
                createjs.Sound.registerSound("./sounds/king.mp3", "king");
              
        }
        
        RESOURCE_TO_LOAD += 7;
        
    };

    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );

        s_oSpriteLibrary.addSprite("but_play","./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("msg_box","./sprites/msg_box.png");
        
        s_oSpriteLibrary.addSprite("bg_menu","./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_mod_menu","./sprites/bg_mod_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_game","./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("but_credits","./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("but_fullscreen","./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("logo_ctl","./sprites/logo_ctl.png");
        
        s_oSpriteLibrary.addSprite("but_vs_man","./sprites/vs_man_panel.png"); 
        s_oSpriteLibrary.addSprite("but_vs_pc","./sprites/vs_pc_panel.png");
        s_oSpriteLibrary.addSprite("message","./sprites/message.png");
        
        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_settings","./sprites/but_settings.png");
        s_oSpriteLibrary.addSprite("white_chip","./sprites/chip_vertical_white.png");
        s_oSpriteLibrary.addSprite("black_chip","./sprites/chip_vertical_black.png");
        s_oSpriteLibrary.addSprite("board8","./sprites/grid_8.png");
        s_oSpriteLibrary.addSprite("chip_box","./sprites/chip_box.png");
        s_oSpriteLibrary.addSprite("chip_flip_white","./sprites/chip_flip_white.png");
        s_oSpriteLibrary.addSprite("chip_flip_black","./sprites/chip_flip_black.png");
        
        s_oSpriteLibrary.addSprite("highlight","./sprites/highlight.png");
        s_oSpriteLibrary.addSprite("bg_turn","./sprites/player_panel.png");
        s_oSpriteLibrary.addSprite("audio_icon_big","./sprites/audio_icon_big.png");
        
        
        s_oSpriteLibrary.addSprite("pawn","./sprites/pawn.png");
        
       
        
        
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);

        _oPreloader.refreshLoader(iPerc);
        
        if(_iCurResource === RESOURCE_TO_LOAD){
            this._onRemovePreloader();
        }
    };
    
    this._onRemovePreloader = function(){
        _oPreloader.unload();

        this.gotoMenu();
    };
    
    this._onAllImagesLoaded = function(){
        
    };
    
    this.onAllPreloaderImagesLoaded = function(){
        this._loadImages();
    };
    
    this.gotoMenu = function(){
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };
    
    
    this.gotoModeMenu = function(){
        _oModeMenu = new CModeMenu();
        _iState = STATE_MENU;
    };
    

    this.gotoGame = function(iType){
        
        s_iGameType = iType;

        _oGame = new CGame(_oData);   						
        _iState = STATE_GAME;
    };
    
    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };
	
    this.stopUpdate = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");
	createjs.Sound.setMute(true);
        
    };

    this.startUpdate = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");
        
        if(s_bAudioActive){
            createjs.Sound.setMute(false);
        }
    };

    
    this._update = function(event){
		if(_bUpdate === false){
			return;
		}
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;
        
        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }
                
        if(_iState === STATE_GAME){
            _oGame.update();
        }
        
        s_oStage.update(event);

    };
    
    s_oMain = this;
    
    _oData = oData;
    ENABLE_CHECK_ORIENTATION = oData.check_orientation;
    ENABLE_FULLSCREEN = oData.fullScreen;
    
    this.initContainer();
}
var s_bMobile;
var s_bAudioActive = true;
var s_bFullscreen = false;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundTrack;
var s_oCanvas;
var s_iGameType;

var s_bWeightSquares = false;
var s_bEdgeSensitive = false;