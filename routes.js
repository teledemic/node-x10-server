var _  = require("lodash");
var express = require("express");

var config = require("./config");
var device = require("./device");
var utilities = require("./utilities");

var router =  express.Router();

router.get("/api/listports", function(req, res) {
	device.listPorts(function(ports) {
		res.json(ports);
	}, function(err) {
		utilities.returnError(res, 500, "Couldn't retrieve port list", err);
	});
});
router.get("/api/devices", function(req, res) {
	res.json(config.devices || []);
});
router.post("/api/devices", function(req, res) {
	var devices = req.body;
	if (Array.isArray(devices)) {
		var valid = _.every(devices, function(device) {
			if (device.house !== null && device.module !== null && device.name !== null) {
				if (parseInt(device.house) === device.house && parseInt(device.module) === device.module) {
					return true;
				}
			}
			return false;
		});
		if (valid) {
			config.devices = devices;
			config.save(function() {
				res.json(true);
			}, function(err) {
				utilities.returnError(res, 500, "Unable to save to config file", err);
			});
		} else {
			utilities.returnError(res, 400, "Invalid format for devices");
		}
	} else {
		utilities.returnError(res, 400, "Must provide an array of devices");
	}
});
router.get("/api/schedules", function(req, res) {
	res.json(config.schedules || []);
});
router.post("/api/schedules", function(req, res) {
	var schedules = req.body;
	if (Array.isArray(schedules)) {
		var valid = _.every(schedules, function(schedule) {
			if (schedule.time !== null && schedule.house !== null && schedule.module !== null && schedule.command !== null) {
				if (parseInt(schedule.time) === schedule.time && parseInt(schedule.house) === schedule.house && parseInt(schedule.module) === schedule.module && parseInt(schedule.command) === schedule.command) {
					return true;
				}
			}
			return false;
		});
		if (valid) {
			config.schedules = schedules;
			config.save(function() {
				res.json(true);
			}, function(err) {
				utilities.returnError(res, 500, "Unable to save to config file", err);
			});
		} else {
			utilities.returnError(res, 400, "Invalid format for schedules");
		}
	} else {
		utilities.returnError(res, 400, "Must provide an array of schedules");
	}
});
router.get("/api/settings/commport", function(req, res) {
	res.json(config.settings.com_name);
});
router.post("/api/settings/commport", function(req, res) {
	if (req.body.com_name) {
		device.open(req.body.com_name, function() {
			console.log(req.body.com_name + " opened");
			config.settings.com_name = req.body.com_name;
			config.save(function() {
				res.json(true);
			}, function(err) {
				utilities.returnError(res, 500, "Unable to save to config file", err);
			});
		}, function(err) {
			utilities.returnError(res, 500, "Unable to open " + req.body.com_name, err);
		});
	} else {
		utilities.returnError(res, 400, "Must provide com_name");
	}
});
router.get("/api/on/:house/:module", function(req, res) {
	var house = parseInt(req.params.house);
	var module = parseInt(req.params.module);
	device.sendCommand(house, module, 1, function() {
		console.log("Sent: " + utilities.commandText(house, module, 1));
		res.json(true);
	}, function(err) {
		utilities.returnError(res, 500, "Couldn't turn on house " + house + ", module " + module, err);
	});
});
router.get("/api/off/:house/:module", function(req, res) {
	var house = parseInt(req.params.house);
	var module = parseInt(req.params.module);
	device.sendCommand(house, module, 0, function() {
		console.log("Sent: " + utilities.commandText(house, module, 0));
		res.json(true);
	}, function(err) {
		utilities.returnError(res, 500, "Couldn't turn off house " + house + ", module " + module, err);
	});
});

module.exports = router;
