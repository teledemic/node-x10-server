var express = require("express");
var device = require("./device");

var router =  express.Router();

router.get("/api/listports", function(req, res) {
	device.listPorts(function(ports) {
		res.json(ports);
	}, function(err) {
		utilities.returnError(res, 500, "Couldn't retrieve port list", err);
	});
});
router.get("/api/:house/:module/on", function(req, res) {
	var house = req.params.house;
	var module = req.params.module;
	console.log("Sending *on* " + house + " " + module);
	device.sendCommand(house, module, 1, function() {
		console.log("Sent *on* " + house + " " + module);
		res.json(true);
	}, function(err) {
		utilities.returnError(res, 500, "Couldn't turn on house " + house + ", module " + module, err);
	});
});
router.get("/api/:house/:module/off", function(req, res) {
	var house = req.params.house;
	var module = req.params.module;
	console.log("Sending *off* " + house + " " + module);
	device.sendCommand(house, module, 0, function() {
		console.log("Sent *off* " + house + " " + module);
		res.json(true);
	}, function(err) {
		utilities.returnError(res, 500, "Couldn't turn off house " + house + ", module " + module, err);
	});
});

module.exports = router;