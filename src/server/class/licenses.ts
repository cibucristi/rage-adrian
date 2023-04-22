import { SendMsg } from '@/resources/functions';
import { COLORS } from '@shared/constants';
import { Database } from './database';
let db = new Database();

type LicenseType = 'Driving' | 'Weapon' | 'Flying' | 'Boat';

export class LicensesManager {
	async updatePlayerLicense(player: PlayerMp, licenseType: LicenseType): Promise<void> {
		const query = `UPDATE accounts SET licenses = ? WHERE username = ?`;
		await db.query(query, [JSON.stringify(player.licenses), player.name])
	}

	async addActiveHours(player: PlayerMp, licenseType: LicenseType, unix: number): Promise<void> {
		player.licenses[licenseType].status = "active";
		player.licenses[licenseType].expiration_date = unix;
		this.updatePlayerLicense(player, licenseType);
	}

	async addSuspendedHours(player: PlayerMp, licenseType: LicenseType, hours: number): Promise<void> {
		player.licenses[licenseType].status = "suspended";
		player.licenses[licenseType].suspend_hours = hours;
		this.updatePlayerLicense(player, licenseType);
	}

	async setActiveHours(player: PlayerMp, licenseType: LicenseType, hours: number): Promise<void> {
		if(hours == 0) {
			player.licenses[licenseType].status = "inactive";
			player.licenses[licenseType].expiration_date = 0;
		}
		else {
			player.licenses[licenseType].status = "active";
			player.licenses[licenseType].expiration_date = (Math.floor(Date.now() / 1000))+(hours*3600);
		}
		this.updatePlayerLicense(player, licenseType);
	}

	async subtractActiveHours(player: PlayerMp, licenseType: LicenseType, hours: number): Promise<void> {
		const license = player.licenses[licenseType];
		if (license) {
			license.expiration_date -= hours*3600;
			if (license.expiration_date < 0) {
				license.expiration_date = 0;
			}
			await this.updatePlayerLicense(player, licenseType);
		}
	}

	async setSuspendedHours(player: PlayerMp, licenseType: LicenseType, hours: number): Promise<void> {

		player.licenses[licenseType].suspend_hours = hours;
		await this.updatePlayerLicense(player, licenseType);
	}

	async subtractSuspendedHours(player: PlayerMp, licenseType: LicenseType, hours: number): Promise<void> {
		const license = player.licenses[licenseType];
		if (license) {
			license.suspend_hours -= hours;
			if (license.suspend_hours < 0) {
				license.suspend_hours = 0;
			}
			await this.updatePlayerLicense(player, licenseType);
		}
	}

	displayLicenses(player: PlayerMp, user: PlayerMp): void {

		const licenses = user.licenses;
		
		SendMsg(player, 'f9f9f9', `-------- !{${COLORS.COLOR_SERVER}}${user.name}'s licenses!{f9f9f9} --------`);

		let driving_time = licenses.driving_license.expiration_date - Math.floor(Date.now() / 1000);
		let weapon_time = licenses.weapon_license.expiration_date - Math.floor(Date.now() / 1000);
		let flying_time = licenses.flying_license.expiration_date - Math.floor(Date.now() / 1000);
		let boat_time = licenses.boat_license.expiration_date - Math.floor(Date.now() / 1000);

		if(licenses.driving_license.suspend_hours > 0) SendMsg(player, 'f9f9f9', `Driving License - Suspended (${licenses.driving_license.suspend_hours} ${licenses.driving_license.suspend_hours>1?`hours`:`hour`})`);
		else if(licenses.driving_license.status=="active") SendMsg(player, 'f9f9f9', `Driving License - Expires in ${Math.floor(driving_time/86400)} days, ${Math.floor((driving_time/3600) % 24)} hours, ${Math.floor(((driving_time / 60) % 60))} minutes, ${Math.floor(driving_time % 60)} seconds`);
		else SendMsg(player, 'f9f9f9', `Driving License - Inactive.`)


		if(licenses.weapon_license.suspend_hours > 0) SendMsg(player, 'f9f9f9', `Weapon License - Suspended (${licenses.weapon_license.suspend_hours} ${licenses.weapon_license.suspend_hours>1?`hours`:`hour`})`);
		else if(licenses.weapon_license.status=="active") SendMsg(player, 'f9f9f9', `Weapon License - Expires in ${Math.floor(weapon_time/86400)} days, ${Math.floor((weapon_time/3600) % 24)} hours, ${Math.floor(((weapon_time / 60) % 60))} minutes, ${Math.floor(weapon_time % 60)} seconds`);
		else SendMsg(player, 'f9f9f9', `Weapon License - Inactive.`)


		if(licenses.flying_license.suspend_hours > 0) SendMsg(player, 'f9f9f9', `Flying License - Suspended (${licenses.flying_license.suspend_hours} ${licenses.flying_license.suspend_hours>1?`hours`:`hour`})`);
		else if(licenses.flying_license.status=="active") SendMsg(player, 'f9f9f9', `Flying License - Expires in ${Math.floor(flying_time/86400)} days, ${Math.floor((flying_time/3600) % 24)} hours, ${Math.floor(((flying_time / 60) % 60))} minutes, ${Math.floor(flying_time % 60)} seconds`);
		else SendMsg(player, 'f9f9f9', `Flying License - Inactive.`)


		if(licenses.boat_license.suspend_hours > 0) SendMsg(player, 'f9f9f9', `Boat License - Suspended (${licenses.boat_license.suspend_hours} ${licenses.boat_license.suspend_hours>1?`hours`:`hour`})`);
		else if(licenses.boat_license.status=="active") SendMsg(player, 'f9f9f9', `Boat License - Expires in ${Math.floor(boat_time/86400)} days, ${Math.floor((boat_time/3600) % 24)} hours, ${Math.floor(((boat_time / 60) % 60))} minutes, ${Math.floor(boat_time % 60)} seconds`);
		else SendMsg(player, 'f9f9f9', `Boat License - Inactive.`)
	}
}