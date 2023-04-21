declare global {
	interface PlayerMp {
		logged: boolean;
		chat_active: boolean;
		hel_met: boolean;
		belt: boolean;

		sqlID: number;
		admin: number;
		helper: number;
		staff: boolean;
		respect: number;
		level: number;
		money: number;
		bank: number;
		gender: number;
		skin: string;

		lastX: number;
		lastY: number;
		lastZ: number;
		afk: number;
		seconds: number;
		hours: number;
		warns: number;
		mute: number;
		job: number;
		hair: number;
		pants: number;
		shirt: number;
		shoes: number;

		/* --- JOBS SKILL / TIMES --- */

		skill: number[];
		times: number[];

		/* --- STATIC --- */
		asset_dmv: boolean;
		asset_dmv_vehicle: any;
		asset_dmv_step: number;

		respawnTimer: any;

		/* --- JOBS --- */
		in_work: boolean;
		have_fish: boolean;
		fish_price: any;

		/* --- FISHER --- */
		fishrod: boolean;
		momeala: number;

		/* --- LICENSES --- */
		licenses: {
            [key: string]: {
                status: "active" | "inactive" | "suspended";
                expiration_date: number;
				suspend_hours: number;
            };
        };


		loginTimeout: NodeJS.Timeout;
	}
	interface LicenseData {
		activeHours: number;
		suspendedHours: number;
	}
	interface TorsoData {
		[key: string]: {
			[key: number]: {
				BestTorsoDrawable: number;
				BestTorsoTexture: number;
			};
		};
	}	
}

export { };
