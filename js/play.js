var playState = function() {};

playState.prototype = {
	timeInit: function() {
		this.age = 0;
		this.season = 0;
		this.season_names = ['Spring', 'Summer', 'Autumn', 'Winter'];
		this.season_length = 4;
		this.week = 1;
		this.weekday = 1;
		this.weekday_names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		this.hour = 5;
		this.minute = 45;
		this.is_night = false;
	},

	statInit: function() {
		this.health = 75;
		this.mood = 100;
		this.exhaustion = 0;
		this.current_stage = 0;
		this.current_sleep_duration = 0;
		this.current_awake_duration = 50;
		this.rem_cycle_count = 0;
		this.time_in_current_cycle = 0;
		this.adenosine = 0;
		this.circadian = 0;

		//Penalties
		this.sleep_debt = 0;
		this.bad_night_of_sleep = false;
		this.times_drunk = 0;
		this.all_nighters = 0;
		this.sleep_disturbance_modifier = 1.0;

		this.time_until_recovery = [];
		this.prevent_events = false;
	},

	stageInit: function() {
		game.add.sprite(0, 0, 'background');
		game.add.sprite(20, 220, 'bed');
		game.add.sprite(200, 30, 'window');
		game.add.sprite(425, 20, 'bookshelf');
		game.add.sprite(560, 140, 'desk');
	},

	buttonInit: function() {
		this.button_sleep = game.add.button(100, 570, 'button', this.sleep, this, 1, 2, 0);
		this.button_sleep_text = game.add.text(0, 4, 'SLEEP', utils.text_style);
		this.button_sleep.addChild(this.button_sleep_text);

		this.button_wake = game.add.button(300, 570, 'button', this.wake, this, 1, 2, 0);
		this.button_wake_text = game.add.text(0, 4, 'WAKE', utils.text_style);
		this.button_wake.addChild(this.button_wake_text);

		this.button_pause = game.add.button(500, 570, 'button', this.togglePause, this, 1, 2, 0);
		this.button_pause_text = game.add.text(0, 4, 'PAUSE', utils.text_style);
		this.button_pause.addChild(this.button_pause_text);

		utils.addCenterAnchors([this.button_sleep, this.button_sleep_text, this.button_wake, this.button_wake_text, this.button_pause, this.button_pause_text]);
	},

	textInit: function() {
		this.date_display = game.add.text(15, 375, 'Week ' + String(this.week) + ' of ' + this.season_names[this.season] + ', ' + this.weekday_names[this.weekday], utils.text_style);
		this.time_display = game.add.text(15, 396, 'Time: ' + String(this.hour < 10 ? '0' + this.hour : this.hour) + ':' + String(this.minute < 10 ? '0' + this.minute : this.minute), utils.text_style);
		this.health_display = game.add.text(15, 435, 'Health: ' + utils.getRating(this.health), utils.text_style);
		this.mood_display = game.add.text(15, 456, 'Mood: ' + utils.getRating(this.mood), utils.text_style);
		this.fatigue_display = game.add.text(15, 477, 'Fatigue: ', utils.text_style);
		this.sleep_count_display = game.add.text(15, 519, 'Time Awake: ' + utils.timeInWords(this.current_awake_duration), utils.text_style);
		this.ailments_display = game.add.text(700, 375, 'Ailments', utils.text_style);
		utils.addCenterAnchor(this.ailments_display, true, false);
		
		this.dialog_box = game.add.sprite(game.world.centerX, 325, 'popup');
		this.dialog_text = game.add.text(0, 4, '', utils.text_style);
		this.dialog_box.addChild(this.dialog_text);
		utils.addCenterAnchors([this.dialog_box, this.dialog_text]);
		this.dialog_box.visible = false;
	},

	clockInit: function() {
		this.game_paused = false;
		this.clock = game.time.create(false);
		this.clock.loop(175, this.updateClock, this);
	},

	init: function() {
		this.timeInit();
		this.statInit();
		this.stageInit();
		this.buttonInit();
		this.textInit();
		this.clockInit();
	},

	create: function() {
		this.startClock();
	},

	startClock: function() {
		this.clock.start();
	},

	updateText: function() {
		this.date_display.setText('Week ' + String(this.week) + ' of ' + this.season_names[this.season] + ', ' + this.weekday_names[this.weekday]);
		this.time_display.setText('Time: ' + String(this.hour < 10 ? '0' + this.hour : this.hour) + ':' + String(this.minute < 10 ? '0' + this.minute : this.minute));
		if(this.current_stage == 0)
			this.sleep_count_display.setText('Time Awake: ' + utils.timeInWords(this.current_awake_duration));
		else
			this.sleep_count_display.setText('Time Asleep: ' + utils.timeInWords(this.current_sleep_duration));
	},

	updateClock: function() {
		this.timekeeper();
		this.sunsetter();
		this.updateText();
		this.sleepCycler();
		this.eventRoller();
	},

	displayAlert: function(message) {
		this.dialog_text.setText(message);
		this.dialog_box.visible = true;
		console.log(this.dialog_box);
		game.time.events.add(Phaser.Timer.SECOND * 3, this.hideAlert, this);
	},

	hideAlert: function() {
		this.dialog_box.visible = false;
	},

	togglePause: function() {
		this.game_paused = !this.game_paused;
		if(this.game_paused) {
			this.clock.pause();
			this.button_sleep.input.enabled = false;
			this.button_wake.input.enabled = false;
		}
		else {
			this.clock.resume();
			this.button_sleep.input.enabled = true;
			this.button_wake.input.enabled = true;
		}
	},

	eventRoller: function() {
		if (this.weekday >= 1 && this.weekday < 7) {
			if (this.hour == 6 && this.minute == 0) {
				this.displayAlert("Your alarm clock is ringing.");
			}
		}
	},

	sleep: function() {
		this.current_stage = 1;
		this.current_awake_duration = 0;
	},

	wake: function() {
		this.sleep_debt += 540 - this.current_sleep_duration;
		this.current_sleep_duration = 0;
		if(this.sleep_debt < 0)
			this.sleep_debt = 0;
		if(this.current_stage != 1)
			this.bad_night_of_sleep = true;
		this.current_stage = 0;
	},

	timekeeper: function() {
		if(this.minute >= 59) {
			if(this.hour >= 23) {
				if(this.weekday > this.weekday_names.length - 2) {
					if(this.week >= this.season_length) {
						if(this.season > this.season_names.length - 2) {
							this.season = 0;
						} else {
							this.season++;
						}
						this.week = 1;
					} else {
						this.week++;
					}
					this.weekday = 0;
				} else {
					this.weekday++;
					this.prevent_events = false;
				}
				this.hour = 0;
			} else {
				this.hour++;
			}
			this.minute = 0;
		} else {
			this.minute++;
		}
	},

	sunsetter: function() {
		if(this.season == 1) { //summer
			if(this.hour < 5 || this.hour >= 19) {
				this.is_night = true;
			}
			else {
				this.is_night = false;
			}
		}
		else if(this.season == 3) { //winter
			if(this.hour < 7 || this.hour >= 17) {
				this.is.night = true;
			}
			else {
				this.is_night = false;
			}
		}
		else { //spring or autumn
			if(this.hour < 6 || this.hour >= 18) {
				this.is_night = true;
			}
			else {
				this.is_night = false;
			}
		}
	},

	processC: function() {
		if(this.is_night) {
			this.circadian--;
		}
	},

	sleepCycler: function() {
		if(this.current_stage == 0) { //awake
			this.current_awake_duration++;
			this.adenosine++;
		}
		else {
			if(this.current_sleep_duration % 90 == 0 && this.current_sleep_duration != 0) {
				this.rem_cycle_count++;
				this.time_in_current_cycle = 0;
				this.current_stage == 1; //nrem 1
			}
			this.current_sleep_duration++;
			this.time_in_current_cycle++;
			if(this.time_in_current_cycle <= 9) {
				this.current_stage = 1; //nrem 1
				if(this.time_in_current_cycle >= 3 && this.time_in_current_cycle <= 6 && utils.weightedRandom([true, false], [1*this.sleep_disturbance_modifier, 100 - 1*this.sleep_disturbance_modifier])){
					this.wake();
				}
			}
			else if(this.time_in_current_cycle > 9 && this.time_in_current_cycle <= 54) {
				this.current_stage = 2; //nrem 2
			}
			else if(this.time_in_current_cycle > 54 && this.time_in_current_cycle <= 72) {
				this.current_stage = 3; //sws
			}
			else if(this.time_in_current_cycle > 72 && this.time_in_current_cycle < 90) {
				this.current_stage = 4; //rem
			}
			if(this.adenosine > 0)
				this.adenosine -= 2;
		}
	},

	fatigueCalculator: function() {
		//TO-DO: interaction between Process-C and adenosine                                                                              
		if(this.bad_night_of_sleep)
			this.exhaustion += 10;

	}
};