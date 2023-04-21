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
		if(hours == 0) player.licenses[licenseType].status = "inactive";
		else player.licenses[licenseType].status = "active";
		player.licenses[licenseType].expiration_date = (Math.floor(Date.now() / 1000))+(hours*3600);
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
		SendMsg(player, 'f9f9f9', `Driving License - ${licenses.driving_license.expiration_date > Math.floor(Date.now() / 1000) ? "Active" : licenses.driving.suspend_hours > 0 ? "Suspended" : "Expired"} (${licenses.driving.expiration_date > Math.floor(Date.now() / 1000) ? `${licenses.driving.expiration_date/86400} days, ${(licenses.driving.expiration_date/3600) % 24}, ${((licenses.driving.expiration_date / 60) % 60)} hours, ${licenses.driving.expiration_date % 60} seconds.` : licenses.driving.suspend_hours > 0 ? `${licenses.driving.suspend_hours} hours` : "none"})`);
		SendMsg(player, 'f9f9f9', `Weapon License - ${licenses.weapon_license.expiration_date > Math.floor(Date.now() / 1000) ? "Active" : licenses.weapon.suspend_hours > 0 ? "Suspended" : "Expired"} (${licenses.weapon.expiration_date > Math.floor(Date.now() / 1000) ? `${licenses.weapon.expiration_date/86400} days, ${(licenses.weapon.expiration_date/3600) % 24}, ${((licenses.weapon.expiration_date / 60) % 60)} hours, ${licenses.weapon.expiration_date % 60} seconds.` : licenses.weapon.suspend_hours > 0 ? `${licenses.weapon.suspend_hours} hours` : "none"})`);
		SendMsg(player, 'f9f9f9', `Boat License - ${licenses.boat_license.expiration_date > Math.floor(Date.now() / 1000) ? "Active" : licenses.boat.suspend_hours > 0 ? "Suspended" : "Expired"} (${licenses.boat.expiration_date > Math.floor(Date.now() / 1000) ? `${licenses.boat.expiration_date/86400} days, ${(licenses.boat.expiration_date/3600) % 24}, ${((licenses.boat.expiration_date / 60) % 60)} hours, ${licenses.boat.expiration_date % 60} seconds.` : licenses.boat.suspend_hours > 0 ? `${licenses.boat.suspend_hours} hours` : "none"})`);
		SendMsg(player, 'f9f9f9', `Fly License - ${licenses.flying_license.expiration_date > Math.floor(Date.now() / 1000) ? "Active" : licenses.flying.suspend_hours > 0 ? "Suspended" : "Expired"} (${licenses.flying.expiration_date > Math.floor(Date.now() / 1000) ? `${licenses.flying.expiration_date/86400} days, ${(licenses.flying.expiration_date/3600) % 24}, ${((licenses.flying.expiration_date / 60) % 60)} hours, ${licenses.flying.expiration_date % 60} seconds.` : licenses.flying.suspend_hours > 0 ? `${licenses.flying.suspend_hours} hours` : "none"})`);
	}
}