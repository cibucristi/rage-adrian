import { CommandManager } from '@/class/commands';
import { Database } from '@/class/database';
import { formatNumber, isPlayerInRangeOfPoint, sendError, sendLocal, SendMsg } from '@/resources/functions';
import { enums } from '@/resources/structures';
import { COLORS, RAGE_CLIENT_EVENTS } from '@shared/constants';

/* --- VARIABLEs --- */
const command = new CommandManager();
const db = new Database();

interface FishType {
	name: string;
	minPrice: number;
	maxPrice: number;
	chance: number;
}

const fishTypes: FishType[][] = [
	[],
	[
		{ name: 'Biban European', minPrice: 17000, maxPrice: 27000, chance: 0.55 },
		{ name: 'Lufar', minPrice: 32000, maxPrice: 57000, chance: 0.30 },
		{ name: 'Caras auriu', minPrice: 80000, maxPrice: 115000, chance: 0.15 }
	],
	[
		{ name: 'Somn', minPrice: 38000, maxPrice: 45000, chance: 0.60 },
		{ name: 'Salau', minPrice: 50000, maxPrice: 67000, chance: 0.40 },
		{ name: 'Nisetru', minPrice: 85000, maxPrice: 117000, chance: 0.15 }
	],
	[
		{ name: 'Stiuca', minPrice: 54000, maxPrice: 71000, chance: 0.60 },
		{ name: 'Somon', minPrice: 77000, maxPrice: 89000, chance: 0.25 },
		{ name: 'Pastrav', minPrice: 92000, maxPrice: 127000, chance: 0.15 }
	],
	[
		{ name: 'Tipar', minPrice: 81000, maxPrice: 100000, chance: 0.60 },
		{ name: 'Novac', minPrice: 92000, maxPrice: 115000, chance: 0.25 },
		{ name: 'Grindel', minPrice: 117000, maxPrice: 145000, chance: 0.15 }
	],
	[
		{ name: 'Sprot', minPrice: 121000, maxPrice: 145000, chance: 0.60 },
		{ name: 'Zglăvoacă', minPrice: 142000, maxPrice: 175000, chance: 0.35 },
		{ name: 'Scobar', minPrice: 176000, maxPrice: 221000, chance: 0.15 }
	]
];

export function generateFishPriceAndName(skill: number): { name: string; price: number } {
	const fishTypeGroup = fishTypes[skill];

	let cumulativeChance = 0;
	for (const fishType of fishTypeGroup) {
		cumulativeChance += fishType.chance;
	}

	const randomNumber = Math.random();
	let currentChance = 0;

	for (const fishType of fishTypeGroup) {
		currentChance += fishType.chance / cumulativeChance;
		if (randomNumber <= currentChance) {
			const priceRange = fishType.maxPrice - fishType.minPrice;
			const price =
				priceRange === 0
					? fishType.minPrice
					: fishType.minPrice + Math.floor((priceRange * (Math.random() + skill)) / (2 * fishTypes.length));
			return {
				name: fishType.name,
				price: price
			};
		}
	}

	return {
		name: '',
		price: 0
	};
}

/* --- COMMANDS --- */
command.addCommand({
	name: 'fish',
	description: 'Start fishing job.',
	aliases: [],
	handler: (player: PlayerMp) => {
		if (player.job != 1) return sendError(player, 'Nu ai jobul fisherman.');
		if (player.in_work == true) return sendError(player, 'Ai inceput deja sa pescuiesti.');
		if (player.have_fish == true) return sendError(player, 'Ai deja un peste.');
		if (player.getVariable("checkpoint_status") == true) return sendError(player, "Ai un checkpoint activ, foloseste comanda /killcp.");
		if (!isPlayerInRangeOfPoint(player, new mp.Vector3(enums.jobs[0].job_work_pos_x, enums.jobs[0].job_work_pos_y, enums.jobs[0].job_work_pos_z), 20.0)) {
			sendError(player, 'Nu esti la locul unde poti pescui.');
			player.call(RAGE_CLIENT_EVENTS.SET_CLIENT_CHECKPOINT, [1, 1, new mp.Vector3(enums.jobs[0].job_work_pos_x, enums.jobs[0].job_work_pos_y, enums.jobs[0].job_work_pos_z), new mp.Vector3(0, 0, 0), 5, true, 0]);
			return true;
		}
		if (player.momeala == 0 || player.fishrod == false) return sendError(player, 'Nu ai momeala sau o undita, mergi la fishshop pentru a le cumpara.');
		if (enums.jobs[0].job_status == true) return sendError(player, "Momentan acest job a fost dezactivat.");
		player.call(RAGE_CLIENT_EVENTS.SET_CLIENT_FISH_ROD);
		player.in_work = true;
		setTimeout(async () => {
			player.momeala--;
			player.have_fish = true;
			player.in_work = false;
			player.stopAnimation();

			const fisher = generateFishPriceAndName(player.skill[player.job - 1]);
			player.fish_price = fisher.price;

			SendMsg(
				player,
				COLORS.COLOR_SERVER,
				`Fish: !{f9f9f9}Felicitari, ai prins un peste de tip ${fisher.name}!{f9f9f9} in valoare de $${formatNumber(fisher.price)}.`
			);
			SendMsg(player, COLORS.COLOR_SERVER, `Shop: !{f9f9f9}Mergi si vinde acest peste la un Fish Shop (sell).`);
			sendLocal(player, 'cedb14', 20, `* ${player.name} a prins un peste de tip ${fisher.name}!{f9f9f9}.`);
			await db.query('update accounts set momeala = ? where username = ?', [player.momeala, player.name]);
		}, 10000);
	}
});

/* --- EVENTS --- */
mp.events.add('playerDeath', (player: PlayerMp) => {
	if (player.have_fish == true) {
		player.have_fish = false;
		SendMsg(player, COLORS.COLOR_SERVER, `Fish: !{f9f9f9}Deoarece ai murit ai pierdut pestele prins.`);
	}
});