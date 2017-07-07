import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as http from "http";
import * as express from "express";

import { ConfigFile } from "./lib/configfile";
import { Device } from "./lib/device";
import { Scheduler } from "./lib/scheduler";
import { ErrorDetail, ErrorDetailHandler } from "./lib/errorhandling";
import { Fauxmo } from "./lib/fauxmo";

import RootRoutes from "./routes";

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json({ limit: "100kb" })); // for parsing application/json

// Handle body-parser errors specifically
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (error.message === "invalid json") {
		throw new ErrorDetail(400, "Invalid JSON");
	} else if (error.message === "request entity too large") {
		throw new ErrorDetail(400, "Request too large");
	} else {
		next();
	}
});

app.use(cors({
	allowedHeaders: "Content-type,Accept,Authorization",
}));

// Static files served out of /public_html
app.use(express.static("public_html"));

// Register the routes in routes/index.ts
app.use("/", RootRoutes);

// Handle errors using our custom handler
app.use(ErrorDetailHandler);

Promise.resolve().then(async () => {
	await ConfigFile.Load("./config/settings.json");
	Fauxmo.Update(ConfigFile.devices);
	Scheduler.Start();

	await Device.Open(ConfigFile.settings.com_name);
	console.log(ConfigFile.settings.com_name + " opened");

	server.listen(ConfigFile.settings.web_port, function () {
		console.log("Server running");
	});
}).catch(err => {
	console.log("Couldn't start server");
	console.log(err);
});
