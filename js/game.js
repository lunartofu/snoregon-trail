var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gamebox'); 

var bootState = function() {};

/*WebFontConfig({
    google: { families: ['Press Start 2P'] },
    active: function() {  }
});*/

bootState.prototype = {
	preload: function() {
		//load loading screen assets
		game.load.script('utils', 'js/utils.js');
		game.load.script('load', 'js/load.js');

		console.log('preload');
	},

	create: function() {
		console.log('create');

		game.state.add('loadingState', loadingState);
		game.state.start('loadingState');
	}
};

game.state.add('bootState', bootState);
game.state.start('bootState');