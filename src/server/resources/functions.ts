/* ---- IMPORT SECTION ---- */
import { COLORS, RAGE_CLIENT_EVENTS, RAGE_GENERAL_EVENTS } from '@shared/constants';
import { Database } from '../class/database';
import { pedsData } from './pedsData';
import { vehiclesData } from "./vehicleData";
import { enums } from './structures';

/* ---- VARIABLES ---- */
const database = new Database();
const vehicleBoat = ["dinghy", "dinghy2", "dinghy3", "dinghy4", "jetmax", "marquis", "seashark", "seashark2", "seashark3", "speeder", "speeder2", "squalo", "submersible", "submersible2", "suntrap", "toro", "toro2", "tropic", "tropic2", "tug", "avisa", "dinghy5", "kosatka", "longfin", "patrolboat"]
const vehicleFlying = ["alphaz1", "avenger", "avenger2", "besra", "blimp", "blimp2", "blimp3", "bombushka", "cargoplane", "cargoplane2", "cuban800", "dodo", "duster", "howard", "hydra", "jet", "lazer", "luxor", "luxor2", "mammatus", "microlight", "miljet", "mogul", "molotok", "nimbus", "nokota", "pyro", "rogue", "seabreeze", "shamal", "starling", "strikeforce", "stunt", "titan", "tula", "velum", "velum2", "vestra", "volatol", "alkonost", "akula", "annihilator", "buzzard", "buzzard2", "cargobob", "cargobob2", "cargobob3", "cargobob4", "frogger", "frogger2", "havok", "hunter", "maverick", "savage", "seasparrow", "skylift", "supervolito", "supervolito2", "swift", "swift2", "valkyrie", "valkyrie2", "volatus", "annihilator2", "seasparrow2", "seasparrow3"]
const vehicleBike = ["bmx", "cruiser", "fixter", "scorcher", "tribike", "tribike2", "tribike3", "bati", "bati2"];
const vehiceBikes = ["bmx", "cruiser", "cruiser", "fixter", "scorcher", "tribike", "tribike2", "tribike3"];
const licenseData = ["driving", "weapon", "boat", "fly"];

/* ---- FUNCTIONS ---- */
export function select_player_database(player: PlayerMp, rows: any) {


	player.sqlID = rows.ID;
	player.admin = rows.admin;
	player.helper = rows.helper;
	player.respect = rows.respect;
	player.level = rows.level;
	player.money = rows.money;
	player.bank = rows.bank;
	player.warns = rows.warns;
	player.mute = rows.mute;
	player.hours = rows.hours;
	player.skin = rows.skin;
	player.seconds = rows.seconds;
	player.job = rows.job;
	player.fishrod = rows.fishrod;
	player.momeala = rows.momeala;
	player.gender = rows.gender;
	player.hair = rows.hair;
	player.pants = rows.pants;
	player.shoes = rows.shoes;
	player.shirt = rows.shirt;

	/* --- JOBS SKILL / TIMES --- */
	const skillValues = rows.skill.split("|").map(Number);
	const timesValues = rows.times.split("|").map(Number);

	player.skill = skillValues;
	player.times = timesValues;

	/* --- Licente --- */
	const licenses = {
		driving: { activeHours: rows.driving_license_active, suspendedHours: rows.driving_license_suspended },
		weapon: { activeHours: rows.weapon_license_active, suspendedHours: rows.weapon_license_suspended },
		fly: { activeHours: rows.fly_license_active, suspendedHours: rows.fly_license_suspended },
		boat: { activeHours: rows.boat_license_active, suspendedHours: rows.boat_license_suspended }
	};
	player.licenses = licenses;

	/* --- RESET --- */
	player.staff = false;
	player.asset_dmv = false;
	player.in_work = false;
	player.have_fish = false;
	player.hel_met = false;
	player.asset_dmv_vehicle = null;

	player.asset_dmv_step = 0;
	player.fish_price = 0;
	player.setVariable('chat_active', true);
	player.setVariable("kicked", false);
	player.setVariable("opened_menu", false);
	player.setVariable("belt", false);
	return true;
}

export function isPlayerInRangeOfPoint(player: PlayerMp, point: Vector3, range: number): boolean {
	const playerPos = player.position;
	const distance = getDistanceBetweenPoints(playerPos, point);
	return distance <= range;
}
function getDistanceBetweenPoints(a: Vector3, b: Vector3): number {
	const dx = a.x - b.x;
	const dy = a.y - b.y;
	const dz = a.z - b.z;
	return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
export const sendToAll = (color: string, message: string) => {
	mp.players.forEach(x => {
		if (x.getVariable('logged') === true) x.outputChatBox(`!{${color}} ${message}`);
	});
}
export function get_distance_from_point(player: PlayerMp, x: number, y: number, z: number): string {
	const playerPos = player.position;
	const dx = playerPos.x - x;
	const dy = playerPos.y - y;
	const dz = playerPos.z - z;
	const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

	if (distance < 1000) {
		return `${distance.toFixed(0)}m`;
	} else if (distance < 10000) {
		return `${(distance / 1000).toFixed(1)}km`;
	} else {
		return `${(distance / 1000).toFixed(0)}km`;
	}
}
export function spawn_player(player: PlayerMp) {
	player.spawn(new mp.Vector3(-116.83824920654297, -604.8067016601562, 36.28071594238281));
	player.heading = -113.38792419433594;
	player.health = 100;
	player.model = mp.joaat(player.skin);

	if (player.getVariable("registred") == true) SendMsg(player, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Bine ai venit pe comunitatea noastra.`);
	if (player.getVariable("registred") == true) player.setVariable("registred", false);

	mp.events.call(RAGE_GENERAL_EVENTS.SET_PLAYER_HAIR, player, player.hair);
	mp.events.call(RAGE_GENERAL_EVENTS.SET_PLAYER_PANTS, player, player.pants);
	mp.events.call(RAGE_GENERAL_EVENTS.SET_PLAYER_SHIRT, player, player.shirt);
	mp.events.call(RAGE_GENERAL_EVENTS.SET_PLAYER_SHOES, player, player.shoes);
}

export const sendLocal = (player: PlayerMp, color: string, range: number, message: string) => {
	if (player.getVariable('logged') === true) mp.players.forEachInRange(player.position, range, (x) => x.outputChatBox(`!{${color}} ${message}`));
};

export const SendMsg = (player: PlayerMp, color: string, message: string) => {
	if (player.getVariable('logged') === true) player.outputChatBox(`!{${color}} ${message}`);
};

export const sendError = (player: PlayerMp, message: string) => {
	if (player.getVariable('logged') === true) player.outputChatBox(`!{${COLORS.COLOR_SERVER}}Error: !{f9f9f9}${message}`);
};

export const sendUsage = (player: PlayerMp, message: string) => {
	if (player.getVariable('logged') === true) player.outputChatBox(`!{${COLORS.COLOR_SERVER}}Syntax: !{f9f9f9}${message}`);
};

export const sendAdmins = (color: string, message: string) => {
	mp.players.forEach((x) => {
		if (x.admin > 0 && x.getVariable('logged') == true) x.outputChatBox(`!{${color}} ${message}`);
	});
};

export const sendHelpers = (color: string, message: string) => {
	mp.players.forEach((x) => {
		if (x.helper > 0 && x.getVariable('logged') == true) x.outputChatBox(`!{${color}} ${message}`);
	});
};

export const sendStaff = (color: string, message: string) => {
	mp.players.forEach((x) => {
		if (x.staff == true && x.getVariable('logged') == true) x.outputChatBox(`!{${color}} ${message}`);
	});
};

export const getNameByID = (playerNameOrPlayerId: any) => {
	if (!isNaN(playerNameOrPlayerId)) return mp.players.at(parseInt(playerNameOrPlayerId));
	else {
		let foundPlayer = null;
		mp.players.forEach((rageMpPlayer) => {
			if (rageMpPlayer.name.toLowerCase().startsWith(playerNameOrPlayerId.toLowerCase())) {
				foundPlayer = rageMpPlayer;
				return;
			}
		});
		return foundPlayer;
	}
};
export const give_player_weapon = (player: PlayerMp, gun: any, ammo: any) => {
	player.giveWeapon(gun, ammo);
}
export const is_valid_vehicle = (value: string) => { return (vehiclesData.includes(value) ? 1 : 0); };
export const is_valid_license = (value: string) => { return (licenseData.includes(value) ? 1 : 0); }
export const is_valid_skin = (value: string) => { return (pedsData.includes(value) ? 1 : 0); };
export const vehicleIsBoat = (name: string) => { return (vehicleBoat.includes(name) ? (true) : (false)); }
export const vehicleIsFly = (name: string) => { return (vehicleFlying.includes(name) ? (true) : (false)); }
export const vehicleIsBike = (name: string) => { return (vehicleBike.includes(name) ? (true) : (false)); }
export const vehicleIsABike = (name: string) => { return (vehiceBikes.includes(name) ? (true) : (false)); }
export const givePlayerMoney = (player: PlayerMp, type: string, amount: number) => {
	switch (type) {
		case 'set': {
			player.money = amount;
			break;
		}
		case 'give': {
			player.money += amount;
			break;
		}
		case 'take': {
			player.money -= amount;
			break;
		}
	}
	database.query('update accounts set money = ? where username = ?', [player.money, player.name]);
	player.call(RAGE_CLIENT_EVENTS.UPDATE_CLIENT_HUD_MONEY, [player.money, player.bank]);
	return;
};

export const givePlayerBank = (player: PlayerMp, type: string, amount: number) => {
	switch (type) {
		case 'set': {
			player.bank = amount;
			break;
		}
		case 'give': {
			player.bank += amount;
			break;
		}
		case 'take': {
			player.bank -= amount;
			break;
		}
	}
	database.query('update accounts set bank = ? where username = ?', [player.bank, player.name]);
	player.call(RAGE_CLIENT_EVENTS.UPDATE_CLIENT_HUD_MONEY, [player.money, player.bank]);
	return;
};

export const showStats = (player: PlayerMp, user: PlayerMp) => {
	SendMsg(player, 'f9f9f9', `-------------- !{${COLORS.COLOR_SERVER}}${user.name}'s stats!{f9f9f9} --------------`);
	SendMsg(player, COLORS.COLOR_SERVER, `General: !{f9f9f9}Name: ${user.name}[ID: ${user.id}] | Level: ${user.level} | Respect Points: ${user.respect}/${user.level * 3} | Hours: ${player.hours.toFixed(2)} [played seconds: ${player.seconds}]`);
	SendMsg(player, COLORS.COLOR_SERVER, `Account: !{f9f9f9}Money: ${formatNumber(user.money)} | Bank: ${formatNumber(user.bank)} | Warnings: ${user.warns}/3 | LevelUP Cost: ${user.level * 3 * 100000} | Premium Points: [0]`);
	SendMsg(player, COLORS.COLOR_SERVER, `Personal: !{f9f9f9}House: [0] | Business: [0] | Job: ${player.job === 0 ? "None" : enums.jobs[player.job-1].job_name} | Personal Vehicles: [0] | Rob Points: [0] | Escape Points: [0]`);
	SendMsg(player, COLORS.COLOR_SERVER, `Others: !{f9f9f9}Crates: [0] | Drugs: [0] | Materials: [0] | R-Points: [0] | Gift Points: [0]`);
	if (player.admin > 0) SendMsg(player, COLORS.COLOR_SERVER, `Admin: !{f9f9f9}Admin Level: [${user.admin}] | Virtual World: ${user.dimension} | Raport: [R: 0 ; C: 0 ; D: 0]`);
	if (player.helper > 0) SendMsg(player, COLORS.COLOR_SERVER, `Helper: !{f9f9f9}Helper Level: [${user.helper}] | Helped Players: [0] | Virtual World: ${user.dimension}`);
	return;
};

export function formatNumber(value: number): string {
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export const createVehicle = (player: PlayerMp, model: string, position: Vector3, rotation: Vector3, plate: string, colorOne: any, colorTwo: any, status: boolean, engine: boolean, dimension: number, put = 1, heading: any) => {

	const vehicle = mp.vehicles.new(model, position, { heading: heading, numberPlate: plate, color: [colorOne, colorTwo], locked: status, engine: engine, dimension: dimension });
	vehicle.rotation = rotation;

	if (put == 1) player.putIntoVehicle(vehicle, 0);
	vehicle.setVariable("createVehicle", model);
	vehicle.setVariable("collision_vehicle", true);
	if (!vehicleIsBike(model)) player.call(RAGE_CLIENT_EVENTS.SET_CLIENT_ENGINE_STATE, [false, player]);
	return vehicle;
};