var instructionState = function() {};

instructionState.prototype = {
	init: function() {
		console.log('how to init');
		this.titleText = game.add.text(game.world.centerX, 96, 'HOW TO PLAY', utils.title_style);
		utils.addCenterAnchor(this.titleText, true, false);
	},

	create: function() {
		console.log('how to create');
		this.instructionText = game.add.text(game.world.centerX, game.world.centerY, "Try to survive for as long as possible by controlling your day-to-day sleep schedule while dealing with all the hardships life throws your way.\n\nSimple, right?", utils.text_style);
		this.continueText = game.add.text(game.world.centerX, 600-96, '(click to continue)', utils.text_style);
		utils.addCenterAnchors([this.instructionText, this.continueText]);

		game.input.onDown.addOnce(this.start, this)
	},

	start: function() {
		console.log('click');
		game.state.start('playState');
	}
};