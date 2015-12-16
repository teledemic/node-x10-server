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
router.get("/api/device", function(req, res) {
	res.json(config.devices || []);
});
router.get("/api/schedule", function(req, res) {
	res.json(config.schedules || []);
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
router.get("/api/:house/:module/on", function(req, res) {
	var house = req.params.house;
	var module = req.params.module;
	device.sendCommand(house, module, 1, function() {
		console.log("Sent: " + utilities.commandText(house, module, 1));
		res.json(true);
	}, function(err) {
		utilities.returnError(res, 500, "Couldn't turn on house " + house + ", module " + module, err);
	});
});
router.get("/api/:house/:module/off", function(req, res) {
	var house = req.params.house;
	var module = req.params.module;
	device.sendCommand(house, module, 0, function() {
		console.log("Sent: " + utilities.commandText(house, module, 0));
		res.json(true);
	}, function(err) {
		utilities.returnError(res, 500, "Couldn't turn off house " + house + ", module " + module, err);
	});
});

module.exports = router;
