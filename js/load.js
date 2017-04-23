var loadingState = function() {};

loadingState.prototype = {
	loadScripts: function() {
		game.load.script('WebFont', '//cdn.jsdelivr.net/webfontloader/1.6.27/webfontloader.js');
		game.load.script('menu', 'js/menu.js');
		game.load.script('instruction', 'js/instruction.js');
		game.load.script('play', 'js/play.js');
		game.load.script('gameover', 'js/gameover.js');
	},

	loadAssets: function() {
		game.load.image('background', 'assets/background.gif');
		game.load.spritesheet('button', 'assets/button_spritesheet.gif', 108, 36);
		game.load.image('bed', 'assets/bed.gif');
		game.load.image('bed_a', 'assets/bed_active.gif');
		game.load.image('bookshelf', 'assets/bookshelf.gif');
		game.load.image('desk', 'assets/desk.gif');
		game.load.image('window', 'assets/window.gif');
		game.load.image('window_night', 'assets/window_night.gif');
		game.load.image('nightoverlay', 'assets/night_overlay.gif');
		game.load.image('popup', 'assets/popupbg.gif');
		game.load.json('diseases', 'assets/diseases.json');
		//game.load.json('events', 'assets/events.json');
	},

	loadFonts: function() {
		WebFontConfig = {
			custom: {
				families: ['Press Start 2P'],
				urls: ['pressstart2p.css']
			}
		}
	},

	init: function() {
		this.status = game.add.text(game.world.centerX, game.world.centerY, 'Loading...', utils.text_style);
		utils.addCenterAnchor(this.status, true, true);
		console.log('make loader');
	},

	preload: function() {
		this.loadScripts();
		this.loadAssets();
		this.loadFonts();
	},

	addGameStates: function() {
		console.log('adding states');
		game.state.add('menuState', menuState);
		console.log('adding menu state');
		game.state.add('instructionState', instructionState);
		console.log('adding instruction state')
		game.state.add('playState', playState);
		console.log('play state added');
		game.state.add('gameOverState', gameOverState);
		console.log('game over state added');
	},

	create: function() {
		this.addGameStates();
		console.log('ready');
		this.status.setText('Ready!');
		setTimeout(function() { game.state.start('menuState'); }, 1000);
	}
};