var express = require("express");
var device = require("./device");

var router =  express.Router();

router.get("/listports", function(req, res) {
	device.listPorts(function(ports) {
		res.json(ports);
	}, function(err) {
		utilities.returnError(res, 500, "Couldn't retrieve port list", err);
	});
});
router.get("/tree/1", function(req, res) {
	device.sendCommand(2, 0, 1, function() {
		res.json(true);
	}, function(err) {
		utilities.returnError(res, 500, "Couldn't execute command", err);
	});
});
router.get("/tree/0", function(req, res) {
	device.sendCommand(2, 0, 0, function() {
		res.json(true);
	}, function(err) {
		utilities.returnError(res, 500, "Couldn't execute command", err);
	});
});

module.exports = router;