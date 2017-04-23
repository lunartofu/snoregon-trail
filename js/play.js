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
		this.is_night = true;
	},

	statInit: function() {
		this.health = 75;
		this.mood = 100;
		this.exhaustion = 0;
		this.current_stage = 2;
		this.current_sleep_duration = 495;
		this.current_awake_duration = 0;
		this.rem_cycle_count = 9;
		this.time_in_current_cycle = 45;

		//Penalties
		this.sleep_debt = 0;
		this.bad_night_of_sleep = false;
		this.all_nighters = 0;
		this.sleep_disturbance_modifier = 1.0;
		this.illness_modifier = 1.0;

		this.current_ailments = [];
		this.time_until_recovery = [];
		this.prevent_events = false;
	},

	stageInit: function() {
		game.add.sprite(0, 0, 'background');
		this.bed_inactive = game.add.sprite(20, 220, 'bed');
		this.bed_inactive.visible = false;
		this.bed_active = game.add.sprite(20, 220, 'bed_a');
		this.window_day = game.add.sprite(200, 30, 'window');
		this.window_day.visible = false;
		this.window_night = game.add.sprite(200, 30, 'window_night');
		game.add.sprite(425, 20, 'bookshelf');
		game.add.sprite(560, 140, 'desk');
		this.night_overlay = game.add.sprite(0, 0, 'nightoverlay');
		this.night_overlay.alpha = 0.75;
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
		this.fatigue_display = game.add.text(15, 477, 'Fatigue: ' + utils.getFatigue(this.exhaustion), utils.text_style);
		this.sleep_count_display = game.add.text(15, 519, 'Time Awake: ' + utils.timeInWords(this.current_awake_duration), utils.text_style);
		this.ailments_display = game.add.text(700, 375, 'Ailments', utils.text_style);
		this.ailments0 = game.add.text(700, 400, '(none)', utils.text_style);
		this.ailments1 = game.add.text(700, 421, '', utils.text_style);
		this.ailments2 = game.add.text(700, 442, '', utils.text_style);
		this.ailments3 = game.add.text(700, 463, '', utils.text_style);
		this.ailments4 = game.add.text(700, 484, '', utils.text_style);
		this.ailments5 = game.add.text(700, 505, '', utils.text_style);
		this.ailments6 = game.add.text(700, 526, '', utils.text_style);
		this.ailments7 = game.add.text(700, 547, '', utils.text_style);
		this.ailments8 = game.add.text(700, 568, '', utils.text_style);
		utils.addCenterAnchors([this.ailments_display, this.ailments0, this.ailments1, this.ailments2, this.ailments3, this.ailments4, this.ailments5, this.ailments6, this.ailments7, this.ailments8], true, false);
		
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

	debugInit: function() {
		this.health = 75;
		this.mood = 100;
		this.exhaustion = 0;
		this.current_stage = 2;
		this.current_sleep_duration = 495;
		this.current_awake_duration = 0;
		this.rem_cycle_count = 9;
		this.time_in_current_cycle = 45;
		this.sleep_debt = 0;
		this.bad_night_of_sleep = false;
		this.all_nighters = 0;
		this.sleep_disturbance_modifier = 1.0;
		this.illness_modifier = 1.0;
		this.current_ailments = ["test", "test", "test", "test", "test", "test", "test", "test"];
		this.time_until_recovery = [];
		this.prevent_events = false;
	},

	init: function() {
		this.debug_on = false;
		this.timeInit();
		this.statInit();
		this.stageInit();
		this.buttonInit();
		this.textInit();
		this.clockInit();
		if(this.debug_on)
			this.debugInit();
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
		this.health_display.setText('Health: ' + utils.getRating(this.health));
		this.mood_display.setText('Mood: ' + utils.getRating(this.mood));
		this.fatigue_display.setText('Fatigue: ' + utils.getFatigue(this.exhaustion));
		if(this.current_stage == 0)
			this.sleep_count_display.setText('Time Awake: ' + utils.timeInWords(this.current_awake_duration));
		else
			this.sleep_count_display.setText('Time Asleep: ' + utils.timeInWords(this.current_sleep_duration));
		this.printAilments();
	},

	updateStage: function() {
		if(this.is_night) {
			this.window_night.visible = true;
		}
		else {
			this.window_day.visible = true;
			this.window_night.visible = false;
			this.night_overlay.visible = false;
		}

		if(this.current_stage == 0) {
			this.bed_inactive.visible = true;
			this.bed_active.visible = false;
			this.night_overlay.visible = false;
		}
		else {
			this.bed_inactive.visible = false;
			this.bed_active.visible = true;
			if(this.is_night) {
				this.night_overlay.visible = true;
			}
		}
	},

	updateClock: function() {
		this.timekeeper();
		this.sunsetter();
		this.updateText();
		this.updateStage();
		this.sleepCycler();
		this.eventRoller();
	},

	displayAlert: function(message) {
		this.dialog_text.setText(message);
		this.dialog_box.visible = true;
		console.log(this.dialog_box);
		game.time.events.add(Phaser.Timer.SECOND * 2, this.hideAlert, this);
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
			this.button_pause.setFrames(2, 1, 0);
		}
		else {
			this.clock.resume();
			this.button_sleep.input.enabled = true;
			this.button_wake.input.enabled = true;
			this.button_pause.setFrames(1, 2, 0);
		}
	},

	eventRoller: function() {
		if (this.weekday >= 1 && this.weekday < 7) {
			if (this.hour == 6 && this.minute == 30) {
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
		if(!this.bad_night_of_sleep) {
			this.mood += 25;
			this.exhaustion -= 10;
		}
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
				this.updateRecovery();
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

	sleepCycler: function() {
		if(this.current_stage == 0) { //awake
			this.current_awake_duration++;
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
			else{
				console.log("something went wrong with sleepCycler");
			}
		}
	},

	fatigueCalculator: function() {
		if(this.exhaustion < 0)
			this.exhaustion = 0;
	},

	healthCalculator: function() {
		//TO-DO
		return null;
	},

	moodCalculator: function() {
		//TO-DO
		return null;
	},

	printAilments: function() { //this is the least efficient implementation of this possible but i am so tired holy crap
		if(this.current_ailments.length == 0) {
			this.ailments0.setText('(none)');
			this.ailments1.setText('');
			this.ailments2.setText('');
			this.ailments3.setText('');
			this.ailments4.setText('');
			this.ailments5.setText('');
			this.ailments6.setText('');
			this.ailments7.setText('');
			this.ailments8.setText('');
		}
		i = 0;
		while (i < this.current_ailments.length) {
			if(i == 0)
				this.ailments0.setText(this.current_ailments[0]);
			else if(i == 1)
				this.ailments1.setText(this.current_ailments[1]);
			else if(i == 2)
				this.ailments2.setText(this.current_ailments[2]);
			else if(i == 3)
				this.ailments3.setText(this.current_ailments[3]);
			else if(i == 4)
				this.ailments4.setText(this.current_ailments[4]);
			else if(i == 5)
				this.ailments5.setText(this.current_ailments[5]);
			else if(i == 6)
				this.ailments6.setText(this.current_ailments[7]);
			else if(i == 7)
				this.ailments7.setText(this.current_ailments[7]);
			else if(i == 8)
				this.ailments8.setText(this.current_ailments[8]);
			i++;
		}
	},

	updateRecovery: function() {
		//TO-DO
	}
};