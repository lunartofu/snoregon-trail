var instructionState = function() {};

instructionState.prototype = {
	init: function() {
		console.log('how to init');
		this.titleText = game.add.text(game.world.centerX, game.world.centerY - 96, 'HOW TO PLAY', utils.title_style);
		utils.addCenterAnchor(this.titleText, true, false);
	},

	create: function() {
		console.log('how to create');
		this.instructionText = game.add.text(game.world.centerX, game.world.centerY, "Try to survive for as long as possible by controlling your day-to-day sleep schedule all while dealing with all the hardships life throws your way. Simple, right?", utils.text_style);
		utils.addCenterAnchor(this.instructionText);
		console.log('is this even loading');

		game.input.onDown.addOnce(this.start, this)
	},

	start: function() {
		console.log('click');
		game.state.start('playState');
	}
};