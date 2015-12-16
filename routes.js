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
	var settings = config.settings || {};
	res.json(settings.names || []);
});
router.get("/api/schedule", function(req, res) {
	var settings = config.settings || {};
	res.json(settings.schedules || []);
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
