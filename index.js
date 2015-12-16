var _  = require("lodash");
var bodyParser = require("body-parser");
var cors = require("cors");
var express = require("express");
var http = require("http");

var config = require("./config");
var device = require("./device");
var scheduler = require("./scheduler");

var app = express();
var server = http.createServer(app);

app.enable('trust proxy');
app.use(bodyParser.json({ limit : "100kb" })); // for parsing application/json

app.use(function(error, req, res, next) {
	//Catch bodyParser error
	if (error.message === "invalid json") {
		utilities.returnError(res, 400, "Invalid JSON");
	} else if (error.message === "request entity too large") {
		utilities.returnError(res, 400, "Request too large");
	} else {
		next();
	}
});

app.use(cors({
	allowedHeaders: "Content-type,Accept,X-Access-Token",
}));

// Static files served out of /public_html
app.use(express.static(__dirname + '/public_html'));
app.use("/", require("./routes"));

scheduler.start();

config.load("./config/settings.json", function() {
	device.open(config.settings.com_name, function() {
		console.log(config.settings.com_name + " opened");
	}, function(err) {
		console.log("Error opening device:");
		console.log(err);
	});

	server.listen(config.settings.web_port, function () {
		console.log("Server running");
	});
}, function(err) {
	console.log("Couldn't read config file");
});
