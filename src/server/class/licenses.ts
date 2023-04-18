import { SendMsg } from '@/resources/functions';
import { COLORS } from '@shared/constants';
import { Database } from './database';
let db = new Database();

type LicenseType = 'Driving' | 'Weapon' | 'Fly' | 'Boat';

export class LicensesManager {
	async updatePlayerLicense(player: PlayerMp, licenseType: LicenseType, licenseData: LicenseData): Promise<void> {
		player.licenses[licenseType] = licenseData;
		const query = `UPDATE accounts SET ${licenseType.toLowerCase()}_license_active = ?, ${licenseType.toLowerCase()}_license_suspended = ? WHERE username = ?`;
		await db.query(query, [licenseData.activeHours, licenseData.suspendedHours, player.name]);
	}

	async addActiveHours(player: PlayerMp, licenseType: LicenseType, hours: number): Promise<void> {
		const license = player.licenses[licenseType];
		if (license) {
			license.activeHours += hours;
			await this.updatePlayerLicense(player, licenseType, license);
		}
	}

	async addSuspendedHours(player: PlayerMp, licenseType: LicenseType, hours: number): Promise<void> {
		const license = player.licenses[licenseType];
		if (license) {
			license.suspendedHours += hours;
			await this.updatePlayerLicense(player, licenseType, license);
		}
	}

	async setActiveHours(player: PlayerMp, licenseType: LicenseType, hours: number): Promise<void> {

		const license = player.licenses[licenseType];
		license.activeHours = hours;
		await this.updatePlayerLicense(player, licenseType, license);
	}

	async subtractActiveHours(player: PlayerMp, licenseType: LicenseType, hours: number): Promise<void> {
		const license = player.licenses[licenseType];
		if (license) {
			license.activeHours -= hours;
			if (license.activeHours < 0) {
				license.activeHours = 0;
			}
			await this.updatePlayerLicense(player, licenseType, license);
		}
	}

	async setSuspendedHours(player: PlayerMp, licenseType: LicenseType, hours: number): Promise<void> {

		const license = player.licenses[licenseType];
		license.suspendedHours = hours;
		await this.updatePlayerLicense(player, licenseType, license);
	}

	async subtractSuspendedHours(player: PlayerMp, licenseType: LicenseType, hours: number): Promise<void> {
		const license = player.licenses[licenseType];
		if (license) {
			license.suspendedHours -= hours;
			if (license.suspendedHours < 0) {
				license.suspendedHours = 0;
			}
			await this.updatePlayerLicense(player, licenseType, license);
		}
	}
	displayLicenses(player: PlayerMp, user: PlayerMp): void {

		const licenses = user.licenses;
		
		SendMsg(player, 'f9f9f9', `-------- !{${COLORS.COLOR_SERVER}}${user.name}'s licenses!{f9f9f9} --------`);
		SendMsg(player, 'f9f9f9', `Driving License - ${licenses.driving.activeHours > 0 ? "Active" : licenses.driving.suspendedHours > 0 ? "Suspended" : "Expired"} (${licenses.driving.activeHours > 0 ? `${licenses.driving.activeHours} hours` : licenses.driving.suspendedHours > 0 ? `${licenses.driving.suspendedHours} hours` : "none"})`);
		SendMsg(player, 'f9f9f9', `Weapon License - ${licenses.weapon.activeHours > 0 ? "Active" : licenses.weapon.suspendedHours > 0 ? "Suspended" : "Expired"} (${licenses.weapon.activeHours > 0 ? `${licenses.weapon.activeHours} hours` : licenses.weapon.suspendedHours > 0 ? `${licenses.weapon.suspendedHours} hours` : "none"})`);
		SendMsg(player, 'f9f9f9', `Boat License - ${licenses.boat.activeHours > 0 ? "Active" : licenses.boat.suspendedHours > 0 ? "Suspended" : "Expired"} (${licenses.boat.activeHours > 0 ? `${licenses.boat.activeHours} hours` : licenses.boat.suspendedHours > 0 ? `${licenses.boat.suspendedHours} hours` : "none"})`);
		SendMsg(player, 'f9f9f9', `Fly License - ${licenses.fly.activeHours > 0 ? "Active" : licenses.fly.suspendedHours > 0 ? "Suspended" : "Expired"} (${licenses.fly.activeHours > 0 ? `${licenses.fly.activeHours} hours` : licenses.fly.suspendedHours > 0 ? `${licenses.fly.suspendedHours} hours` : "none"})`);
	}
}