import * as fsx from "fs-extra";

let file_path: string = null;

export class ConfigFile {
	public static settings = {
		com_name: "COM1",
		web_port: 8081,
		latitude: 44.5,
		longitude: -73.2
	};
	public static devices: any[] = [];
	public static schedules: any[] = [];

	public static async Load(path: string) {
		file_path = path;
		try {
			const data = await fsx.readFile(file_path, "utf-8");
			const parsed = JSON.parse(data);
			this.settings = parsed.settings;
			this.devices = parsed.devices;
			this.schedules = parsed.schedules;
		} catch (err) {
			if (err.code === "ENOENT") {
				await this.Save();
			} else {
				throw err;
			}
		}
	}

	public static async Save() {
		const conf = {
			settings: this.settings,
			devices: this.devices,
			schedules: this.schedules,
		};
		const data = JSON.stringify(conf, null, "\t");
		await fsx.writeFile(file_path, data);
	}
}
