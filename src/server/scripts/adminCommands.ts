/* ---- IMPORT SECTION ---- */
import { createVehicle, formatNumber, getNameByID, givePlayerBank, givePlayerMoney, give_player_weapon, is_valid_license, is_valid_skin, is_valid_vehicle, sendAdmins, sendError, SendMsg, sendStaff, sendToAll, sendUsage, showStats, spawn_player } from '@/resources/functions';
import { Database } from '@/class/database';
import { COLORS, RAGE_CLIENT_EVENTS, SHARE } from '@shared/constants';
import { LicensesManager } from '@/class/licenses';
import { SanctionsManager } from '@/class/sanctions';
import { appendFile } from 'fs';
import { CommandManager } from '@/class/commands';

const command = new CommandManager();
const license = new LicensesManager();
const sanction = new SanctionsManager();

/* ---- VARIABLES ---- */
const database = new Database();

/* ---- COMMANDS ---- */
command.addCommand({
	name: 'setadmin',
	description: 'Set admin level to player.',
	aliases: ['makeadmin'],
	permission: 'Admin',
	permissionValue: 6,
	handler: (player: PlayerMp, _, id, adminLevel: number) => {
		if (!id || !adminLevel) return sendUsage(player, '/setadmin <username/userID> <admin level>');

		const user = getNameByID(id);

		if (user == undefined) return sendError(player, SHARE.connectedError);
		if (user.admin > player.admin) return sendError(player, 'Nu poti folosi aceasta comanda asupra acelui jucator.');
		if (adminLevel < 0 || adminLevel > 7) return sendError(player, 'Invalid admin level (0 - 7).');

		user.admin = adminLevel;
		if (user.staff == false) user.staff = true;
		database.query('update accounts set admin = ? where username = ?', [user.admin, user.name]);
		sendAdmins(COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Admin ${player.name} i-a setat lui ${user.name} admin level ${adminLevel}.`);
		SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} ti-a setat admin level ${adminLevel}.`);
	}
});

command.addCommand({
	name: 'sethelper',
	description: 'Set helper level to player/id.',
	aliases: ['makehelper'],
	permission: 'Admin',
	permissionValue: 5,
	handler: (player: PlayerMp, _, id, helperLevel: number) => {

		if (!id || !helperLevel) return sendUsage(player, '/sethelper <username/userID> <helper level>');

		const user: any = getNameByID(id);
		if (user == undefined) return sendError(player, SHARE.connectedError);
		if (helperLevel < 0 || helperLevel > 3) return sendError(player, 'Invalid helper level (0 - 3).');

		user.helper = helperLevel;
		if (user.staff == false) user.staff = true;
		database.query('update accounts set helper = ? where username = ?', [user.helper, user.name]);
		sendStaff(COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Admin ${player.name} i-a setat lui ${user.name} helper level ${helperLevel}`);
		SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} ti-a setat helper level ${helperLevel}`);
	}
});

command.addCommand({
	name: 'savecam',
	description: 'Save camera positions.',
	aliases: ['cam'],
	permission: 'Admin',
	permissionValue: 6,
	handler: (player: PlayerMp, name: string = "no name") => player.call("client::getCamCoords", [name])
});

command.addCommand({
	name: 'gotopos',
	description: 'Goto this positions',
	aliases: ['gotoxyz', 'gotocoords'],
	permission: 'Admin',
	permissionValue: 6,
	handler: (player: PlayerMp, posx, posy, posz) => {

		if (!parseFloat(posx) && !parseFloat(posy) && !parseFloat(posz)) return sendUsage(player, "/gotopos <x> <y> <z>");
		if (player.vehicle) return sendError(player, "Nu poti folosi aceasta comanda dintr-un vehicul.");
		player.position = new mp.Vector3(posx, posy, posz);
		SendMsg(player, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Te-ai teleportat la coordonatele: ${parseFloat(posx)}, ${parseFloat(posy)}, ${parseFloat(posz)}`);
	}
});

command.addCommand({
	name: 'test1234',
	description: '',
	aliases: [],
	permission: '',
	permissionValue: -1,
	handler: (player: PlayerMp) => {
		
		player.position = new mp.Vector3(-18.07856, -583.6725, 79.46569);
	}
});

command.addCommand({
	name: 'adminchat',
	description: 'Chat for administrators.',
	aliases: ['a'],
	permission: 'Admin',
	permissionValue: 1,
	handler: (player: PlayerMp, text: string) => {
		if (!text) return sendUsage(player, '/a <text>');
		sendAdmins(COLORS.COLOR_ADMINCHAT, `Admin Level (${player.admin}) | ${player.name}: ${text}`);
	}
});

command.addCommand({
	name: 'set',
	description: 'Set items to player/id.',
	aliases: ['setitem'],
	permission: 'Admin',
	permissionValue: 6,
	handler: (player: PlayerMp, _, id, item: string, amount: any) => {
		if (!id || !item || !amount) {
			sendUsage(player, '/set <username/userID> <item> <amount>');
			return SendMsg(player, COLORS.COLOR_SERVER, 'Items: !{f9f9f9}money, bank, level, respect, skin');
		}
		const user = getNameByID(id);
		if (user == undefined) return sendError(player, SHARE.connectedError);

		switch (item) {
			case 'money': {
				if (amount < 1 || amount > 999999999) return sendError(player, 'Invalid amount ($0 - $999.999.999).');
				givePlayerMoney(user, 'set', amount);
				sendAdmins(
					COLORS.COLOR_SERVER,
					`Notice: !{f9f9f9}Admin ${player.name} i-a setat lui ${user.name} suma de $${formatNumber(amount)} cash.`
				);
				SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} ti-a setat suma de $${formatNumber(amount)} cash.`);
				break;
			}
			case 'bank': {
				if (amount < 1 || amount > 999999999) return sendError(player, 'Invalid amount ($0 - $999.999.999).');
				givePlayerBank(user, 'set', amount);
				sendAdmins(
					COLORS.COLOR_SERVER,
					`Notice: !{f9f9f9}Admin ${player.name} i-a setat lui ${user.name} suma de $${formatNumber(amount)} in banca.`
				);
				SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} ti-a setat suma de $${formatNumber(amount)} in banca.`);
				break;
			}
			case 'level': {
				if (amount < 1 || amount > 999) return sendError(player, 'Invalid amount (1 - 999).');
				user.level = amount;
				sendAdmins(COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Admin ${player.name} i-a setat lui ${user.name} level ${amount}.`);
				SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} ti-a setat level ${amount}.`);
				break;
			}
			case 'respect': {
				if (amount < 1 || amount > 999) return sendError(player, 'Invalid amount (1 - 999).');
				user.respect = amount;
				sendAdmins(COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Admin ${player.name} i-a setat lui ${user.name} suma de ${amount} respect points.`);
				SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} ti-a setat suma de ${amount} respect points.`);
				break;
			}
			case 'skin': {

				if (!is_valid_skin(amount)) return sendError(player, "Invalid skin");
				user.skin = amount; user.model = mp.joaat(user.skin);
				sendAdmins(COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Admin ${player.name} i-a setat lui ${user.name} skinul ${amount}`);
				SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} ti-a setat skinul ${amount}.`);
				break;
			}
			default: {
				sendUsage(player, '/set <username/userID> <item> <amount>');
				SendMsg(player, COLORS.COLOR_SERVER, 'Items: !{f9f9f9}money, bank, level, respect, skin');
				break;
			}
		}
		database.query('update accounts set respect = ?, level = ?, skin = ? where username = ?', [user.respect, user.level, user.skin, user.name]);
	}
});

command.addCommand({
	name: 'check',
	description: 'Check player/id stats.',
	aliases: ['checkplayer'],
	permission: 'Admin',
	permissionValue: 1,
	handler: (player: PlayerMp, _, id) => {
		if (!id) return sendUsage(player, '/check <username/userID>');

		const user = getNameByID(id);
		if (user == undefined) return sendError(player, SHARE.connectedError);

		showStats(player, user);
	}
});

command.addCommand({
	name: 'statuscmd',
	description: 'Set command status.',
	aliases: ['statuscommand'],
	permission: 'Admin',
	permissionValue: 7,
	handler: (player: PlayerMp, cmdName: string) => {
		if (!cmdName) return sendUsage(player, `/statuscmd <command name>`);

		const cmd: any = command.getCommand(cmdName);
		if (!cmd) return sendError(player, `Comanda ${cmd} nu exista pe server.`);

		cmd.disabled = !cmd.disabled;
		command.toggleCommand(cmdName, cmd.disabled);

		const status = cmd.disabled ? 'dezactivat' : 'activat';
		sendAdmins(COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Admin ${player.name} a ${status} comanda '/${cmdName}' de pe server.`);
	},
});

command.addCommand({
	name: 'agl',
	description: 'Give license to player/id.',
	aliases: ['admingivelicense', 'setlicense'],
	permission: 'Admin',
	permissionValue: 5,
	handler: async (player: PlayerMp, _, id, licenseName: any, hours: any) => {
		if (!id || !licenseName || !hours) {

			sendUsage(player, '/agl <username/userID> <license name> <hours (0h - 300h)>');
			return SendMsg(player, COLORS.COLOR_SERVER, "Licenses: !{f9f9f9}driving, weapon, boat, flying");
		}

		const user: any = getNameByID(id);
		if (user === undefined) return sendError(player, SHARE.connectedError);
		if (!is_valid_license(licenseName)) {

			sendError(player, "Invalid license type.");
			return SendMsg(player, COLORS.COLOR_SERVER, "Licenses: !{f9f9f9}driving, weapon, boat, flying");
		}

		if (parseInt(hours) < 0 || parseInt(hours) > 300) return sendError(player, "Invalid hours (0 - 300).");
		const new_name: any = licenseName + "_license";
		console.log(`the new name ${new_name}`)
		await license.setActiveHours(user, new_name, parseInt(hours));
		await license.setSuspendedHours(user, new_name, 0);
		sendAdmins(COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Admin ${player.name} i-a setat lui ${user.name} licenta de ${licenseName} pentru ${parseInt(hours)} ore.`);
		SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} ti-a setat licenta de ${licenseName} pentru ${parseInt(hours)} ore.`);
	}
});

command.addCommand({
	name: 'suspend',
	description: 'Suspend player/id license.',
	aliases: ['suspendlicense'],
	permission: 'Admin',
	permissionValue: 5,
	handler: async (player: PlayerMp, _, id, licenseName: any, hours) => {
		if (!id || !licenseName || !hours) {

			sendUsage(player, '/suspend <username/userID> <license name> <hours (0h - 20h)>');
			return SendMsg(player, COLORS.COLOR_SERVER, "Licenses: !{f9f9f9}driving, weapon, boat, flying");
		}

		const user: any = getNameByID(id);
		if (user === undefined) return sendError(player, SHARE.connectedError);
		if (!is_valid_license(licenseName)) {

			sendError(player, "Invalid license type.");
			return SendMsg(player, COLORS.COLOR_SERVER, "Licenses: !{f9f9f9}driving, weapon, boat, flying");
		}

		if (parseInt(hours) < 1 || parseInt(hours) > 20) return sendError(player, "Invalid hours (1 - 20).");
		const new_name: any = licenseName + "_license";
		console.log(`the new name ${new_name}`)
		await license.setSuspendedHours(user, new_name, parseInt(hours));
		await license.setActiveHours(user, new_name, 0);
		sendAdmins(COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Admin ${player.name} i-a suspendat lui ${user.name} licenta de ${licenseName} pentru ${parseInt(hours)} ore.`);
		SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} ti-a suspendat licenta de ${licenseName} pentru ${parseInt(hours)} ore`);
	}
});

command.addCommand({
	name: 'kick',
	description: 'Kick this player.',
	aliases: [],
	permission: 'Admin',
	permissionValue: 1,
	handler: (player: PlayerMp, _, id, reason) => {

		if (!id || !reason) return sendUsage(player, "/kick <username/userID> <reason>");
		const user: any = getNameByID(id);
		if (user === undefined) return sendError(player, SHARE.connectedError);
		if (user.getVariable("kicked")) return sendError(player, "Jucatorul are ban sau kick.");
		if (user == player) return sendError(player, "Nu poti folosi aceasta comanda asupra ta.");
		if (player.admin <= user.admin) return sendError(player, "Nu poti folosi aceasta comanda asupra acelui jucator.");

		const text: string = `You are kicked by administrator ${player.name}, reason: ${reason}`;

		sanction.kickPlayer(user, text);
		sendToAll(COLORS.COLOR_SERVER, `Kick: !{f9f9f9}Jucatorul ${user.name} a primit kick de la adminul ${player.name}, motiv: ${reason}`);
	}
});

command.addCommand({
	name: 'fly',
	description: 'Start flymode.',
	aliases: ['flymode'],
	permission: 'Admin',
	permissionValue: 1,
	handler: (player: PlayerMp) => {
		if (player.vehicle) return sendError(player, "Nu poti folosi aceasta comanda dintr-un vehicul.");
		player.call(RAGE_CLIENT_EVENTS.START_CLIENT_FLYMODE, [player]);
	}
});

command.addCommand({
	name: 'ban',
	description: 'Ban this player.',
	aliases: [],
	permission: 'Admin',
	permissionValue: 1,
	handler: (player: PlayerMp, _, id, days) => {

		if (!id || !days) return sendUsage(player, "/ban <username/userID> <days (days == 0 - Permanent | days)> <reason>");
		const user: any = getNameByID(id);
		if (user == undefined) return sendError(player, SHARE.connectedError);
		if (user == player) return sendError(player, "Nu poti folosi aceasta comanda asupra ta.");
		if (player.admin <= user.admin) return sendError(player, "Nu poti folosi aceasta comanda asupra acelui jucator.");

		const reason = _.split(" ").slice(1).join(" ") || "no reason";

		const text: string = `Ai primit ban ${days == 0 ? "permanent" : `${days} zile`} de la adminul ${player.name}, motiv: ${reason}`;

		sanction.banPlayer(user, player.name, days, true, (days == 0 ? true : false), text, reason);
	}
});

command.addCommand({
	name: 'warn',
	description: 'Warn this player.',
	aliases: [],
	permission: 'Admin',
	permissionValue: 1,
	handler: (player: PlayerMp, _, id) => {

		if (!id) return sendUsage(player, "/warn <username/userID> <reason>");
		const user: any = getNameByID(id);
		if (user == undefined) return sendError(player, SHARE.connectedError);
		if (user == player) return sendError(player, "Nu poti folosi aceasta comanda asupra ta.");
		if (player.admin <= user.admin) return sendError(player, "Nu poti folosi aceasta comanda asupra acelui jucator.");

		const reason = _.split(" ").slice(1).join(" ") || "no reason";

		sanction.warnPlayer(player, reason);
		sendToAll(COLORS.COLOR_SERVER, `Warn: !{f9f9f9}Jucatorul ${user.name} a primit warn de la adminul ${player.name}, motiv: ${reason}`);
	}
});

command.addCommand({
	name: 'mute',
	description: 'Mute this player.',
	aliases: [],
	permission: 'Admin',
	permissionValue: 1,
	handler: (player: PlayerMp, _, id, seconds: any) => {
		if (!id || !seconds) return sendUsage(player, "/mute <username/userID> <minutes> <reason>");
		const user = getNameByID(id);
		if (user == undefined) return sendError(player, SHARE.connectedError);
		if (user == player) return sendError(player, "Nu poti folosi aceasta comanda asupra ta.");
		if (player.admin <= user.admin) return sendError(player, "Nu poti folosi aceasta comanda asupra acelui jucator.");

		const reason = _.split(" ").slice(1).join(" ") || "no reason";

		sanction.mutePlayer(player, (seconds * 60));
		sendToAll(COLORS.COLOR_SERVER, `Mute: !{f9f9f9}Jucatorul ${user.name} a primit mute de la ${player.name} pentru ${seconds} minute, motiv: ${reason}`);
		SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} ti-a dat mute pentru ${seconds} minute, motiv: ${reason}`);
	}
});

command.addCommand({
	name: 'unmute',
	description: 'Unmute this player.',
	aliases: [],
	permission: 'Admin',
	permissionValue: 2,
	handler: async (player: PlayerMp, _, id) => {

		if (!id) return sendUsage(player, "/unmute <username/userID>");
		const user: any = getNameByID(id);
		if (user == undefined) return sendError(player, SHARE.connectedError);
		if (user.mute == 0) return sendError(player, "Acel jucator nu are mute.");

		user.mute = 0;
		await database.query("update accounts set mute = ? where username = ?", [user.mute, user.name]);
		sendAdmins(COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Admin ${player.name} i-a dat unmute lui ${user.name}`);
		SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} ti-a dat unmute.`);
	}
});

command.addCommand({
	name: 'unwarn',
	description: 'Clear warn this player.',
	aliases: [],
	permission: 'Admin',
	permissionValue: 2,
	handler: async (player: PlayerMp, _, id) => {

		if (!id) return sendUsage(player, "/unwarn <username/userID>");
		const user: any = getNameByID(id);
		if (user == undefined) return sendError(player, SHARE.connectedError);
		if (user.warns == 0) return sendError(player, "Acel jucator nu are warn.");

		user.warns--;
		await database.query("update accounts set warn = ? where username = ?", [user.warn, user.name]);
		sendAdmins(COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Admin ${player.name} i-a dat clear la un warn lui ${user.name}.`);
		SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} ti-a dat clear la un warn.`);
	}
});

command.addCommand({
	name: 'unban',
	description: 'Unban this player.',
	aliases: [],
	permission: 'Admin',
	permissionValue: 2,
	handler: async (player: PlayerMp, name: string) => {

		if (!name || Number.isInteger(Number(name))) return sendError(player, "/unban <username>");

		const [rows_ban] = await database.query('select * from bans where name = ? and active > 0', [name]);
		if (rows_ban && rows_ban.length !== 0) {

			await database.query("delete from bans where name = ?", [rows_ban.name]);
			sendAdmins(COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Admin ${player.name} l-a debanat pe ${rows_ban.name}.`);
		}
		else return sendError(player, "Acel jucator nu este banat.");
	}
});

command.addCommand({
	name: 'spawncar',
	description: 'Spawn admin vehicle.',
	aliases: ['spawnveh', 'veh'],
	permission: 'Admin',
	permissionValue: 1,
	handler: (player: PlayerMp, vehicleName: string) => {
		if (!vehicleName) return sendUsage(player, "/spawncar <vehicle name>");

		if (!is_valid_vehicle(vehicleName)) return sendError(player, "Invalid vehicle name.");
		const vehicle: any = createVehicle(player, vehicleName, player.position, new mp.Vector3(0, 0, 0), "ADMIN", 1, 1, false, false, player.dimension, 1, player.heading);
		vehicle.setVariable("is_admin_vehicle", vehicleName);
	}
});

command.addCommand({
	name: 'vre',
	description: 'Destroy vehicle.',
	aliases: ['dv'],
	permission: 'Admin',
	permissionValue: 1,
	handler: (player: PlayerMp, veh: any) => {

		if ((!veh || isNaN(veh)) && !player.vehicle) return sendUsage(player, `/vre <vehicle id>`);

		const vehID = mp.vehicles.at(veh);
		if (!player.vehicle && vehID == undefined) return sendError(player, "This vehicle doesn't exist.");

		sendAdmins(COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Admin ${player.name} a despawnat vehiculul [id: ${((player.vehicle) ? player.vehicle.id : vehID.id)}].`);
		((player.vehicle) ? player.vehicle : vehID).destroy();
	}
});

command.addCommand({
	name: 'despawncars',
	description: 'Despawn all admin vehicles.',
	aliases: ['dcars'],
	permission: 'Admin',
	permissionValue: 2,
	handler: (player: PlayerMp) => {
		const adminCars = mp.vehicles.toArray().filter(f => f.getVariable("is_admin_vehicle"));
		adminCars.forEach(vehicle => vehicle.destroy());
		sendAdmins(COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Admin ${player.name} a despawnat ${adminCars.length} vehicule de admini.`);
	}
});

command.addCommand({
	name: 'save',
	description: 'Save positions.',
	aliases: ['savepos'],
	permission: 'Admin',
	permissionValue: 6,
	handler: (player: PlayerMp, name: string = "no name") => {
		const pos = (player.vehicle) ? player.vehicle.position : player.position;
		const rot: any = (player.vehicle) ? player.vehicle.rotation : player.heading;
		const saveFile = "savedpos.txt";

		appendFile(saveFile, `Position: ${pos.x.toFixed(6)}, ${pos.y.toFixed(6)}, ${pos.z.toFixed(6)} | ${(player.vehicle) ? `Rotation: ${rot.x.toFixed(6)}, ${rot.y.toFixed(6)}, ${rot.z.toFixed(6)}` : `Heading: ${rot}`} | ${(player.vehicle) ? "InCar" : "OnFoot"} - ${name}\r\n`, (err) => {

			if (err) player.notify(`~p~[SERVER]~w~ SavePos Error: ~w~${err.message}`);
			else player.notify(`~p~[SERVER]~w~ Position saved. ~w~(${name})`);
		});
	}
});

command.addCommand({
	name: 'respawn',
	description: 'Respawn this player/id.',
	aliases: ['spawn'],
	permission: 'Admin',
	permissionValue: 1,
	handler: (player: PlayerMp, _, id) => {
		if (!id) return sendUsage(player, "/respawn <username/userID>");

		const user = getNameByID(id);
		if (user == undefined) return sendError(player, SHARE.connectedError);
		spawn_player(user);
		sendAdmins(COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Admin ${player.name} l-a respawnat pe ${user.name}`);
		SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} ti-a dat respawn.`);
	}
});

command.addCommand({
	name: 'givegun',
	description: 'Give weapon this player/id.',
	aliases: ['giveweapon'],
	permission: 'Admin',
	permissionValue: 1,
	handler: (player: PlayerMp, _, id, gunName: string, buletts: any) => {
		if (!id || !gunName || !buletts) return sendUsage(player, "/givegun <username/userID> <weapon name> <ammo>");

		const user = getNameByID(id);
		if (user == undefined) return sendError(player, SHARE.connectedError);
		if (buletts < 1 || buletts > 9999) return sendError(player, "Invalid ammo (1 - 9999).");

		give_player_weapon(player, mp.joaat(gunName), parseInt(buletts));

		sendAdmins(COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Admin ${player.name} i-a dat lui ${user.name} arma ${gunName} cu ${buletts} gloante.`);
		SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} ti-a dat arma ${gunName} cu ${buletts} gloante.`);
	}
});

command.addCommand({
	name: 'gotom',
	description: 'Teleport to mountain chilliad.',
	aliases: [],
	permission: 'Admin',
	permissionValue: 1,
	handler: (player: PlayerMp) => {

		if (player.vehicle) player.vehicle.position = new mp.Vector3(495.3240966796875, 5591.61767578125, 794.861083984375);
		else player.position = new mp.Vector3(501.4615478515625, 5604.625, 797.9095458984375);
	}
});

command.addCommand({
	name: 'gotols',
	description: 'Teleport to Los Santos.',
	aliases: [],
	permission: 'Admin',
	permissionValue: 1,
	handler: (player: PlayerMp) => {

		if (player.admin < 1) return sendError(player, SHARE.accesError);
		if (player.vehicle) player.vehicle.position = new mp.Vector3(-71.14082336425781, -856.8265991210938, 40.57482147216797);
		else player.position = new mp.Vector3(-71.14082336425781, -856.8265991210938, 40.57482147216797);
	}
});

command.addCommand({
	name: 'gotopaleto',
	description: 'Teleport to paleto.',
	aliases: [],
	permission: 'Admin',
	permissionValue: 1,
	handler: (player: PlayerMp) => {
		if (player.vehicle) player.vehicle.position = new mp.Vector3(-302.221435546875, 6231.70361328125, 31.454235076904297);
		else player.position = new mp.Vector3(-302.221435546875, 6231.70361328125, 31.454235076904297);
	}
});

command.addCommand({
	name: 'gotospawn',
	description: 'Teleport to spawn.',
	aliases: [],
	permission: 'Admin',
	permissionValue: 1,
	handler: (player: PlayerMp) => {
		if (player.vehicle) player.vehicle.position = new mp.Vector3(-104.6806869506836, -609.2161254882812, 36.07132339477539);
		else player.position = new mp.Vector3(-116.83824920654297, -604.8067016601562, 36.28071594238281);
	}
});

command.addCommand({
	name: 'fixveh',
	description: 'Repair this vehicle.',
	aliases: ['fixcar', 'fix', 'fv'],
	permission: '',
	permissionValue: 0,
	handler: (player: PlayerMp) => {
		if (!player.vehicle) return sendError(player, "Nu esti intr-un vehicul.");

		player.vehicle.repair();
		SendMsg(player, COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Vehiculul [ID: ${player.vehicle.id}] a fost reparat.`);
	}
});

command.addCommand({
	name: 'gotocar',
	description: 'Teleport to vehicle id.',
	aliases: ['gotoveh'],
	permission: 'Admin',
	permissionValue: 1,
	handler: (player: PlayerMp, vehicleID: any) => {
		if (!vehicleID) return sendUsage(player, "/gotocar <vehicle id>");

		const vehID = mp.vehicles.at(vehicleID);

		if (vehID == undefined) return sendError(player, "This vehicle doesn't exist.");

		player.position = new mp.Vector3((vehID.position.x + 1.5), vehID.position.y, vehID.position.z);
	}
});

command.addCommand({
	name: 'getcar',
	description: 'Teleport vehicle id to yourself.',
	aliases: ['getveh'],
	permission: 'Admin',
	permissionValue: 1,
	handler: (player: PlayerMp, vehicleID: any) => {
		if (!vehicleID) return sendUsage(player, "/getcar <vehicle id>");

		const vehID = mp.vehicles.at(vehicleID);

		if (vehID == undefined) return sendError(player, "This vehicle doesn't exist.");

		vehID.position = new mp.Vector3((player.position.x + 3), player.position.y, player.position.z);
	}
});

command.addCommand({
	name: 'slap',
	description: 'Slap this player.',
	aliases: [],
	permission: 'Admin',
	permissionValue: 1,
	handler: (player: PlayerMp, _, id) => {
		if (!id) return sendUsage(player, "/slap <username/userID>");

		const user = getNameByID(id);
		if (user == undefined) return sendError(player, SHARE.connectedError);
		user.position = new mp.Vector3(user.position.x, user.position.y, (user.position.z + 2.5));
		sendAdmins(COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Admin ${player.name} i-a dat slap lui ${user.name}.`);
		SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} ti-a dat slap.`);
	}
});

command.addCommand({
	name: 'slapcar',
	description: 'Slap this vehicle.',
	aliases: ['slapveh'],
	permission: 'Admin',
	permissionValue: 1,
	handler: (player: PlayerMp, vehicleID: any) => {
		if (!vehicleID) return sendUsage(player, "/slapcar <vehicle id>");

		const vehID = mp.vehicles.at(vehicleID);
		if (vehID == undefined) return sendError(player, "This vehicle doesn't exist.");

		vehID.position = new mp.Vector3(vehID.position.x, vehID.position.y, (vehID.position.z + 3));
	}
});

command.addCommand({
	name: 'goto',
	description: 'Teleport to player/id.',
	aliases: ['tp'],
	permission: 'Admin',
	permissionValue: 1,
	handler: (player: PlayerMp, _, id) => {
		if (!id) return sendUsage(player, "/goto <username/userID>");

		const user = getNameByID(id);
		if (user == undefined) return sendError(player, SHARE.connectedError);
		if (user == player) return sendError(player, "Nu poti folosi aceasta comanda asupra ta.");

		player.position = new mp.Vector3((user.position.x + 2), user.position.y, user.position.z); player.dimension = user.dimension;
		sendAdmins(COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Admin ${player.name} s-a teleportat la ${user.name}.`);
		SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} s-a teleportat la tine.`);
	}
});

command.addCommand({
	name: 'gethere',
	description: 'Teleport player to yourself.',
	aliases: ['get'],
	permission: 'Admin',
	permissionValue: 1,
	handler: (player: PlayerMp, _, id) => {
		if (!id) return sendUsage(player, "/gethere <username/userID>");

		const user = getNameByID(id);
		if (user == undefined) return sendError(player, SHARE.connectedError);
		if (user == player) return sendError(player, "Nu poti folosi aceasta comanda asupra ta.");

		user.position = new mp.Vector3((player.position.x + 2), player.position.y, player.position.z); user.dimension = player.dimension;
		sendAdmins(COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Admin ${player.name} l-a teleportat pe ${user.name} la el.`);
		SendMsg(user, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Admin ${player.name} te-a teleportat la el.`);
	}
});

command.addCommand({
	name: 'checklicenses',
	description: 'Check licenses this player.',
	aliases: ['checkl', 'checklicense'],
	permission: 'Admin',
	permissionValue: 1,
	handler: (player: PlayerMp, _, id) => {
		if (!id) return sendUsage(player, "/checklicenses <username/userID>");
		const user: any = getNameByID(id);
		license.displayLicenses(player, user);
	}
});