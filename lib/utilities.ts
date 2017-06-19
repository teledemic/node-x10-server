export class Utilities {
	public static ReturnEmptySuccess(res: any): void {
		res.status(204);
		res.send();
	}

	public static CommandText(house: number, module: number, command: boolean) {
		const housetxt = String.fromCharCode(65 + house);
		const pad = "0" + (module + 1);
		const moduletxt = pad.substr(pad.length - 2);
		let commandtxt = "off";
		if (command) commandtxt = "on";
		return housetxt + moduletxt + " *" + commandtxt + "*";
	}

	public static async Delay(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}
