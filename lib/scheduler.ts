const suncalc = require("suncalc");

import { ConfigFile } from "./configfile";
import { Device } from "./device";
import { Utilities } from "./utilities";

let lastCheck = 0;

const TIME_BETWEEN_COMMANDS_MS = 500;
const TICK_TIME_MS = 5000;

export class Scheduler {
	public static Start() {
		lastCheck = (Date.now() - new Date().setHours(0, 0, 0, 0)) / 1000;
		Scheduler.UpdateDawnDusk();
		setTimeout(Scheduler.Tick, TICK_TIME_MS);
		console.log("Scheduler started: " + lastCheck);
	}

	private static async Tick() {
		const currentTime = (Date.now() - new Date().setHours(0, 0, 0, 0)) / 1000;
		try {
			let todo = [];
			if (currentTime < lastCheck) {
				// Midnight rollover
				Scheduler.UpdateDawnDusk();
				todo = ConfigFile.schedules.filter(sched => {
					return (sched.time > lastCheck || sched.time <= currentTime);
				});
			} else {
				todo = ConfigFile.schedules.filter(sched => {
					return (sched.time > lastCheck && sched.time <= currentTime);
				});
			}
			for (const sched of todo) {
				await Device.SendCommand(sched.house, sched.module, sched.onoff);
				console.log("Scheduler: sent " + Utilities.CommandText(sched.house, sched.module, sched.command));
				await Utilities.Delay(TIME_BETWEEN_COMMANDS_MS);
			}
		} finally {
			lastCheck = currentTime;
			setTimeout(Scheduler.Tick, TICK_TIME_MS);
		}
	}
	private static UpdateDawnDusk() {
		const lat = ConfigFile.settings.latitude || 44.5;
		const lon = ConfigFile.settings.longitude || -73.2;
		const times = suncalc.getTimes(new Date(), lat, lon);
		const dawn = (times.dawn.getTime() - times.dawn.setHours(0, 0, 0, 0)) / 1000;
		const dusk = (times.dusk.getTime() - times.dusk.setHours(0, 0, 0, 0)) / 1000;
		for (const sched of ConfigFile.schedules) {
			if (sched.dawn) {
				sched.time = dawn + sched.dawn;
			} else if (sched.dusk) {
				sched.time = dusk + sched.dusk;
			}
		}
	}
}
