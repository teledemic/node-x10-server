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
		fauxmo.updateDevices({ devices: fauxdev });
	}
}

function HandleAction(house: number, module: number, action: any) {
	console.log(house, module, action);
}
