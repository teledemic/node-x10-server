var fs = require("fs");

module.exports = {
	settings: {},
	path: null,
	load: function(path) {
		var parsed = {};
		try {
			var data = fs.readFileSync(path);
			parsed = JSON.parse(data);
			module.exports.settings = parsed;
			module.exports.path = path;
			return true;
		} catch (ex) {
			console.log("Error loading settings from " + path);
			return false;
		}
	},
	save: function() {
		var data = JSON.stringify(module.exports.settings, null, "\t");
		fs.writeFile(module.exports.path, data, function (err) {
			if (err) {
				return false;
			} else {
				return true;
			}
		});
	}
};
