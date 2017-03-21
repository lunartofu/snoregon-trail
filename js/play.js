var playState = function() {};

playState.prototype = {
	timeInit: function() {
		this.age = 0;
		this.season = 0;
		this.season_names = ['Spring', 'Summer', 'Autumn', 'Winter'];
		this.season_length = 4;
		this.week = 1;
		this.weekday = 0;
		this.weekday_names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		this.hour = 0;
		this.minute = 0;
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
	},

	stageInit: function() {
		game.add.sprite(0, 0, 'background');
		game.add.sprite(20, 220, 'bed');
		game.add.sprite(55, 35, 'window');
		game.add.sprite(305, 35, 'clock');
		game.add.sprite(430, 35, 'bookshelf');
		game.add.sprite(555, 110, 'desk');
	},

	buttonInit: function() {
		this.button_sleep = game.add.button(100, 570, 'button', this.buttonSleepClick, this, 1, 2, 0);
		this.button_sleep_text = game.add.text(0, 3, 'SLEEP', utils.text_style);
		this.button_sleep.addChild(this.button_sleep_text);

		this.button_wake = game.add.button(300, 570, 'button', this.buttonWakeClick, this, 1, 2, 0);
		this.button_wake_text = game.add.text(0, 3, 'WAKE', utils.text_style);
		this.button_wake.addChild(this.button_wake_text);

		this.button_pause = game.add.button(500, 570, 'button', this.buttonClick, this, 1, 2, 0);
		this.button_pause_text = game.add.text(0, 3, 'PAUSE', utils.text_style);
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
	},

	clockInit: function() {
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
	},

	buttonClick: function() {
		return 0;
	},

	buttonSleepClick: function() {
		this.current_stage = 1;
		this.current_awake_duration = 0;
	},

	buttonWakeClick: function() {
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
				this.current_stage == 1;
			}
			this.current_sleep_duration++;
			if(this.adenosine > 0)
				this.adenosine -= 2;
		}
	},

	fatigueCalculator: function() {
		//TO-DO: interaction between Process-C and adenosine
	}
};