var x10 = require('node-x10-comm');

var device = x10.device();

module.exports = {
	open: function(comName, callback, errcallback) {
		try {
			device.open(comName, callback, errcallback);
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
