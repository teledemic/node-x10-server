const x10 = require("node-x10-comm");

const device = x10.device();

export class Device {
	public static async Open(comName: string) {
		await device.open(comName);
	}

	public static async SendCommand(house: number, module: number, onoff: boolean) {
		if (!device) {
			throw new Error("Device not open");
		}
		await device.sendCommand(house, module, onoff);
	}

	public static async ListPorts() {
		return await x10.listPorts();
	}
}
