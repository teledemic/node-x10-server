var x10 = require('../node-x10-comm');

var device = null;

module.exports = {
	open: function(comName, callback, errcallback) {
		if (device) {
			device.close();
		}
		try {
			var dev = x10.device(comName);
			dev.open(function() {
				device = dev;
				callback();
			}, errcallback);
		} catch (ex) {
			errcallback(ex);
		}
	},
	sendCommand: function(house, module, onoff, callback, errcallback) {
		if (device) {
			device.sendCommand(house, module, onoff, callback, errcallback);
		} else {
			errcallback("Device not open");
		}
	},
	listPorts: function(callback, errcallback) {
		x10.listPorts(callback, errcallback);
	},
};