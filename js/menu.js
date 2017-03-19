var menuState = function() {};

menuState.prototype = {
	init: function() {
		console.log('menu init');
		this.titleText = game.add.text(game.world.centerX, game.world.centerY - 48, 'THE SNOREGON TRAIL', utils.title_style);
		utils.addCenterAnchor(this.titleText, true, false);
	},

	create: function() {
		console.log('menu create');
		this.pressStartText = game.add.text(game.world.centerX, game.world.centerY, 'Click to Begin', utils.text_style);
		utils.addCenterAnchor(this.pressStartText, true, false);
		console.log('is this even loading');

		game.input.onDown.addOnce(this.start, this)
	},

	start: function() {
		console.log('click');
		game.state.start('playState');
	}
};