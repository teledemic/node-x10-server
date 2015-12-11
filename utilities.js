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

};
