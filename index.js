var _  =             require("lodash");
var bodyParser =     require("body-parser");
var cors =           require("cors");
var http =           require("http");
var express =        require("express");

var device =         require("./device");
var config =         require("./config");

var app = express();
var server = http.createServer(app);

//var COM_NAME = "/dev/cu.usbserial";
//var COM_NAME = "COM3";

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

if (config.load("./config/settings.json")) {
	device.open(config.settings.com_name, function() {
		console.log("Device opened");
	}, function(err) {
		console.log("Error opening device: " + err);
	});

	server.listen(config.settings.web_port, function () {
		console.log("Server running");
	});
} else {
	console.log("Couldn't read config file");
}