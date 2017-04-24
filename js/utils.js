var utils = {
	text_style: {
		font: 'Press Start 2P',
		fontSize: 16,
		fontWeight: 300,
		fill: '#FFFFFF',
		autoRound: true,
		wordWrap: true,
		wordWrapWidth: 762
	},

	title_style: {
		font: 'Press Start 2P',
		fontSize: 32,
		fontWeight: 300,
		fill: '#FFFFFF',
		autoRound: true
	},

	getRating: function(stat) {
		if(stat > 90)
			return 'excellent';
		else if(stat <= 90 && stat >= 75)
			return 'good';
		else if(stat < 75 && stat >= 50)
			return 'fair';
		else if(stat < 50 && stat >= 25)
			return 'poor';
		else if(stat < 25)
			return 'terrible';
		else
			return 'null';
	},

	getFatigue: function(stat) {
		if(stat > 90)
			return 'exhausted';
		else if(stat <= 90 && stat >= 85)
			return 'sleepy';
		else if(stat < 85 && stat >= 25)
			return 'okay';
		else if(stat < 25)
			return 'refreshed';
	},

	timeInWords: function(time_num) {
		if(time_num == 0)
		return '0 minutes';
		var hours = Math.floor(time_num / 60);
		var minutes = time_num % 60;
		var time_str = '';
		if(hours > 0) {
			if(hours > 1)
				time_str += String(hours) + ' hours and ';
			else
				time_str += String(hours) + ' hour and ';
			}
		if(minutes > 0) {
			if(minutes > 1)
				time_str += String(minutes) + ' minutes';
			else
				time_str += String(minutes) + ' minute';
			}
		else
			time_str += '0 minutes';
		return time_str;
	},

	addCenterAnchor: function(object, x = true, y = true) {
		if(x && y)
			object.anchor.setTo(0.5, 0.5);
		else if(x && !y)
			object.anchor.setTo(0.5, 0);
		else if(y && !x)
			object.anchor.setTo(0, 0.5);
		else
			return null;
	},

	addCenterAnchors: function(objects, x = true, y = true) {
		console.log(objects);
		objects.forEach(function(object) {
			if(x && y)
				object.anchor.setTo(0.5, 0.5);
			else if(x && !y)
				object.anchor.setTo(0.5, 0);
			else if(y && !x)
				object.anchor.setTo(0, 0.5);
			else
				return null;
		})
	},

	weightedRandom: function(choices, weights) {
		console.log(choices);
		console.log(weights);
		var sum = weights.reduce(function(a, b) { return a + b; }, 0);
		var random = Math.floor(Math.random() * sum);
		for(var i = 0; i < choices.length; i++) {
			random -= weights[i];
			if(random < 0)
				return choices[i];
		}
		return(choices[choices.length - 1]);
	}
};