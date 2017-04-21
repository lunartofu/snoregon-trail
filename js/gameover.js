var gameOverState = function() {};

gameOverState.prototype = {
	init: function() {
		console.log('game over init');
		this.titleText = game.add.text(game.world.centerX, game.world.centerY - 96, 'GAME OVER', utils.title_style);
		utils.addCenterAnchor(this.titleText, true, false);
	},

	create: function() {
		console.log('game over create');
		this.gameOverText = game.add.text(game.world.centerX, game.world.centerY, "Here lies andy, peperony and chease \n \n (Hint: Everyone needs 9 hours of sleep a night. EVERYONE.)", utils.text_style);

		utils.addCenterAnchor(this.gameOverText);

		this.button_retry = game.add.button(game.world.centerX, game.world.centerY - 96, 'button', this.start, this, 1, 2, 0);
		this.button_retry_text = game.add.text(0, 3, 'RETRY?', utils.text_style);
		this.button_retry.addChild(this.button_retry_text);
		utils.addCenterAnchors([this.button_retry, this.button_retry_text]);
	},

	start: function() {
		console.log('click');
		game.state.start('menuState');
	}
};