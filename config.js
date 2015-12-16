var fs = require("fs");

var file_path = null;

module.exports = {
	settings: {
		com_name: "COM1",
		web_port: 8081,
	},
	devices: [],
	schedules: [],
	load: function(path, callback, errcallback) {
		fs.readFile(path, function(err, data) {
			if (!err) {
				try {
					var parsed = JSON.parse(data);
					module.exports.settings = parsed.settings;
					module.exports.devices = parsed.devices;
					module.exports.schedules = parsed.schedules;
					file_path = path;
					callback();
				} catch (ex) {
					errcallback(ex);
				}
			} else {
				errcallback(err);
			}
		});
	},
	save: function(callback, errcallback) {
		var db = {
			settings: module.exports.settings,
			devices: module.exports.devices,
			schedules: module.exports.schedules,
		};
		var data = JSON.stringify(db, null, "\t");
		fs.writeFile(file_path, data, function (err) {
			if (err) {
				errcallback(err);
			} else {
				callback();
			}
		});
	}
};
