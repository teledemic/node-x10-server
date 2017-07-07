import { Device } from "./device";

const fauxmojs = require("fauxmojs");

const fauxmo = new fauxmojs();

export class Fauxmo {
	public static Update(devices: any[]) {
		const fauxdev = devices.map((device, index) => {
			return {
				name: device.name,
				port: 11000 + index,
				handler: (action: any) => {
					HandleAction(device.house, device.module, action);
				},
			};
		});
		// fauxmo = new fauxmojs({ devices: fauxdev });
		console.log(fauxdev);
		fauxmo.updateDevices(fauxdev);
	}
}

async function HandleAction(house: number, module: number, action: any) {
	if (action === "on") {
		await Device.SendCommand(house, module, true);
	} else if (action === "off") {
		await Device.SendCommand(house, module, false);
	}
	console.log(house, module, action);
}
