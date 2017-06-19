import * as express from "express";

import { ConfigFile } from "../lib/configfile";
import { Device } from "../lib/device";
import { Utilities } from "../lib/utilities";
import { RouteWrap, ErrorDetail } from "../lib/errorhandling";
import { Fauxmo } from "../lib/fauxmo";

const router = express.Router();

router.get("/api/listports", RouteWrap(async (req, res) => {
	const ports = await Device.ListPorts();
	res.json(ports);
}));

router.get("/api/devices", function (req, res) {
	res.json(ConfigFile.devices || []);
});

router.post("/api/devices", RouteWrap(async (req, res) => {
	const devices = req.body;
	if (!Array.isArray(devices)) {
		throw new ErrorDetail(400, "Must provide an array of devices");
	}
	const valid = devices.every(device => {
		if (device.house !== null && device.module !== null && device.name !== null) {
			if (typeof device.house === "number" && typeof device.module === "number" && typeof device.name === "string") {
				return true;
			}
		}
		return false;
	});
	if (!valid) {
		throw new ErrorDetail(400, "Invalid format for devices");
	}
	ConfigFile.devices = devices;
	await ConfigFile.Save();
	Fauxmo.Update(ConfigFile.devices);
	Utilities.ReturnEmptySuccess(res);
}));

router.get("/api/schedules", function (req, res) {
	res.json(ConfigFile.schedules || []);
});

router.post("/api/schedules", RouteWrap(async (req, res) => {
	const schedules = req.body;
	if (!Array.isArray(schedules)) {
		throw new ErrorDetail(400, "Must provide an array of schedules");
	}
	const valid = schedules.every(schedule => {
		if (schedule.time !== null && schedule.house !== null && schedule.module !== null && schedule.command !== null) {
			if (typeof schedule.time === "number" && typeof schedule.house === "number" && typeof schedule.module === "number" && typeof schedule.command === "boolean") {
				return true;
			}
		}
		return false;
	});
	if (!valid) {
		throw new ErrorDetail(400, "Invalid format for schedules");
	}
	ConfigFile.schedules = schedules;
	await ConfigFile.Save();
	Utilities.ReturnEmptySuccess(res);
}));

router.get("/api/settings/commport", function (req, res) {
	res.json(ConfigFile.settings.com_name);
});

router.post("/api/settings/commport", RouteWrap(async (req, res) => {
	if (!req.body.com_name) {
		throw new ErrorDetail(400, "Must provide com_name");
	}
	await Device.Open(req.body.com_name);
	console.log(req.body.com_name + " opened");
	ConfigFile.settings.com_name = req.body.com_name;
	await ConfigFile.Save();
	Utilities.ReturnEmptySuccess(res);
}));

router.get("/api/on/:house/:module", RouteWrap(async (req, res) => {
	const house = parseInt(req.params.house, 10);
	const module = parseInt(req.params.module, 10);
	await Device.SendCommand(house, module, true);
	console.log("Sent: " + Utilities.CommandText(house, module, true));
	Utilities.ReturnEmptySuccess(res);
}));

router.get("/api/off/:house/:module", RouteWrap(async (req, res) => {
	const house = parseInt(req.params.house, 10);
	const module = parseInt(req.params.module, 10);
	await Device.SendCommand(house, module, false);
	console.log("Sent: " + Utilities.CommandText(house, module, false));
	Utilities.ReturnEmptySuccess(res);
}));

export default router;
