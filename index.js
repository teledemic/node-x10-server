var _  =  require("lodash");
var x10 = require('../node-x10-comm');

var comm = x10.device("/dev/cu.usbserial");
x10.listPorts(function(ports) {console.log(ports);});

comm.open(function() {
	console.log("opened");
	comm.sendCommand(2,0,1, function() {
			console.log("sent");
		}, function(err) {
			console.log("error: " + err);
		});
}, function(err) {
	console.log(err);
});
