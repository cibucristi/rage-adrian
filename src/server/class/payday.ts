import { COLORS, RAGE_CLIENT_EVENTS } from '@shared/constants';
import { Database } from './database';
import { formatNumber, SendMsg } from '../resources/functions';
import { LicensesManager } from './licenses';

type LicenseType = 'Driving' | 'Weapon' | 'Flying' | 'Boat';

const db = new Database();
const licensesManager = new LicensesManager();

export class PaydayManager {
	private readonly paydayInterval: NodeJS.Timeout;
	private readonly paydayHours: Set<number>;

	constructor() {
		this.paydayHours = new Set();

		this.paydayInterval = setInterval(() => {
			const now = new Date();
			const currentHour = now.getHours();
			const currentMinute = now.getMinutes();


			if (!this.paydayHours.has(currentHour) && currentMinute === 0) {
				this.givePaydayToPlayers();
				this.paydayHours.add(currentHour);

			} else if (this.paydayHours.has(currentHour) && currentMinute === 1) {
				this.paydayHours.delete(currentHour);

			}
		}, 60000);
	}

	async givePaydayToPlayers(): Promise<void> {
		const players = mp.players.toArray();

		for (const player of players) {

			const playerLevel = player.level;
			const respect = Math.floor(Math.random() * 3) + 1;
			const moneyReward = playerLevel * 50000;
			const expiredLicenses: LicenseType[] = [];
			const hours = player.seconds / 3600;
			const minutes = player.seconds / 60;
			const hoursString = hours.toFixed(2) + (hours.toFixed(2) !== '1.00' ? ' ore' : ' ora');
			const minutesString = minutes.toFixed(0) + ' minute';

			player.bank = moneyReward;
			player.respect += respect;
			player.hours = hours;
			player.call(RAGE_CLIENT_EVENTS.UPDATE_CLIENT_HUD_MONEY, [player.money, player.bank]);

			SendMsg(player, 'f9f9f9', `--------------------- !{${COLORS.COLOR_SERVER}}Server PayDay!{f9f9f9} ---------------------`);
			SendMsg(player, 'f9f9f9', `Your paycheck has arrived; please visit the bank to withdraw your money.`);
			SendMsg(player, 'f9f9f9', `Ai primit ${hoursString} jucate (${minutesString}).`);
			SendMsg(player, 'f9f9f9', `PayCheck: $${formatNumber(moneyReward)} | Bank Balance: $${formatNumber(player.bank)} | Respect Points: ${respect} | Respect Balance: ${player.respect}`);

			for (const licenseType of ['Driving', 'Weapon', 'Flying', 'Boat'] as LicenseType[]) {
				if(player.licenses[licenseType].expiration_date < Math.floor(Date.now() / 1000)) expiredLicenses.push(licenseType);
			}
			for (const licenseType of expiredLicenses) {
				SendMsg(player, 'f9f9f9', `Licenta de ${licenseType} ti-a expirat!`);
			}

			for (const licenseType of ['Driving', 'Weapon', 'Flying', 'Boat'] as LicenseType[]) {
				const license = player.licenses[licenseType];
				if (license && license.suspend_hours > 0) {
					await licensesManager.subtractSuspendedHours(player, licenseType, 1);
				}
			}

			await db.query('update accounts set respect = ?, bank = ? where username = ?', [player.respect, player.bank, player.name]);
		}
	}
	stop(): void {
		clearInterval(this.paydayInterval);
	}
}
