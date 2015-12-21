var _  = require("lodash");
var suncalc = require("suncalc");

var config = require("./config");
var device = require("./device");
var utilities = require("./utilities");

var lastCheck = 0;

var TIME_BETWEEN_COMMANDS_MS = 500;
var TICK_TIME_MS = 5000;

function executeCommands(schedules, callback, errcallback) {
	if (schedules.length > 0) {
		var sched = schedules.shift();
		device.sendCommand(sched.house, sched.module, sched.command, function() {
			console.log("Scheduler: sent " + utilities.commandText(sched.house, sched.module, sched.command));
			setTimeout(executeCommands, TIME_BETWEEN_COMMANDS_MS, schedules, callback, errcallback);
		}, errcallback);
	} else {
		//Queue is empty
		callback();
	}
}

function updateDawnDusk() {
	var lat = config.settings.latitude || 44.5;
	var lon = config.settings.longitude || -73.2;
	var times = suncalc.getTimes(new Date(), lat, lon);
	var dawn = (times.dawn.getTime() - times.dawn.setHours(0,0,0,0)) / 1000;
	var dusk = (times.dusk.getTime() - times.dusk.setHours(0,0,0,0)) / 1000;
	_.forEach(config.schedules, function(sched) {
		if (sched.dawn) {
			sched.time = dawn + sched.dawn;
		} else if (sched.dusk) {
			sched.time = dusk + sched.dusk;
		}
	});
}

module.exports = {
	start: function() {
		lastCheck = (Date.now() - new Date().setHours(0,0,0,0)) / 1000;
		updateDawnDusk();
		setTimeout(module.exports.tick, TICK_TIME_MS);
		console.log("Scheduler started: " + lastCheck);
	},
	tick: function() {
		var currentTime = (Date.now() - new Date().setHours(0,0,0,0)) / 1000;
		var todo = [];
		if (currentTime < lastCheck) {
			//Midnight rollover
			updateDawnDusk();
			todo = _.filter(config.schedules, function(sched) {
				return (sched.time > lastCheck || sched.time <= currentTime);
			});
		} else {
			todo = _.filter(config.schedules, function(sched) {
				return (sched.time > lastCheck && sched.time <= currentTime);
			});
		}
		executeCommands(todo, function() {
			lastCheck = currentTime;
			setTimeout(module.exports.tick, TICK_TIME_MS);
		}, function(err) {
			console.log("Error executing scheduled commands");
			console.log(err);
			lastCheck = currentTime;
			setTimeout(module.exports.tick, TICK_TIME_MS);
		});
	}
};
