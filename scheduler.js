var _  = require("lodash");

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

module.exports = {
	start: function() {
		lastCheck = (Date.now() - new Date().setHours(0,0,0,0)) / 1000;
		setTimeout(module.exports.tick, TICK_TIME_MS);
		console.log("Scheduler started: " + lastCheck);
	},
	tick: function() {
		var currentTime = (Date.now() - new Date().setHours(0,0,0,0)) / 1000;
		var todo = _.filter(config.settings.schedules, function(sched) {
			return (sched.time > lastCheck && sched.time <= currentTime);
		});
		executeCommands(todo, function() {
			lastCheck = currentTime;
			setTimeout(module.exports.tick, TICK_TIME_MS);
		}, function(err) {
			console.log("Error executing scheduled commands");
			console.log(err);
		});
	}
};
