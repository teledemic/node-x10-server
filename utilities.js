module.exports = {

	returnError: function(res, errcode, message, detail) {
		res.status(errcode);
		res.message = message;
		res.exception = detail;
		res.json({
			"status": errcode,
			"message": message
		});
	},

	returnOK: function(res, message) {
		res.status(200);
		res.message = message;
		res.json({
			"status": 200,
			"message": message,
		});
	},

	returnCreated: function(res, message) {
		res.status(201);
		res.message = message;
		res.json({
			"status": 201,
			"message": message,
		});
	},

	returnEmptySuccess: function(res) {
		res.status(204);
		res.send();
	},

	commandText: function(house, module, command) {
		var housetxt = String.fromCharCode(65 + parseInt(house));
		var pad = "0" + (module + 1);
		var moduletxt = pad.substr(pad.length - 2);
		var commandtxt = "off";
		if (command) commandtxt = "on";
		return housetxt + moduletxt + " *" + commandtxt + "*";
	},

};
