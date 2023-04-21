/* ---- IMPORT SECTION ---- */
import { givePlayerMoney, sendError, SendMsg, showStats } from "@/resources/functions";
import { Database } from "@/class/database";
import { COLORS, RAGE_CLIENT_EVENTS, RAGE_GENERAL_EVENTS } from "@shared/constants";
import { CommandManager } from "@/class/commands";
import { LicensesManager } from "@/class/licenses";

/* ---- VARIABLES ---- */
const command = new CommandManager();
const database = new Database();
const license = new LicensesManager();

/* ---- COMMANDS ---- */
command.addCommand({
    name: 'killcp',
    description: 'Delete this checkpoint.',
    aliases: ["cancelcp", "killcheckpoint", "removecp"],
    handler: (player: PlayerMp) => {

        if (player.getVariable("checkpoint_status") == false) return sendError(player, "Nu ai un checkpoint activ.");
        if (player.in_work == true) return sendError(player, "Nu poti folosi aceasta comanda in timp ce muncesti.");
        if (player.asset_dmv == true) return sendError(player, "Nu poti folosi aceasta comanda in examenul auto.");
        player.call(RAGE_CLIENT_EVENTS.DESTROY_CLIENT_CHECKPOINT);
        SendMsg(player, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Checkpoint-ul a fost sters.`);
    }
});

command.addCommand({
    name: 'debuglicenses',
    description: 'debug licenses',
    aliases: ["no"],
    handler: (player: PlayerMp) => {
        console.log(player.licenses);
        console.log(player.licenses.driving_license);
        console.log(player.licenses.driving_license.status);
        console.log(player.licenses.driving_license.expiration_date);
        console.log(Math.floor(Date.now() / 1000));
    }
});


command.addCommand({
    name: 'buylevel',
    description: 'Buy level up.',
    aliases: [],
    handler: (player: PlayerMp) => {
        if (player.respect < (player.level * 3)) return sendError(player, "Nu ai suma necesara de respect points.");
        if (player.money < (player.level * 3) * 100000) return sendError(player, "Nu ai suma necesara de bani.");

        player.respect -= (player.level * 3); player.level++; givePlayerMoney(player, "take", (player.level * 3) * 100000);
        database.query("update accounts set respect = ?, level = ? where username = ?", [player.respect, player.level, player.name]);
        SendMsg(player, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Felicitari! Ai avansat la nivel ${player.level}`);
    }
});

command.addCommand({
    name: 'admins',
    description: 'Show admins online.',
    aliases: [],
    handler: (player: PlayerMp) => {

        const admins = mp.players.toArray().filter((p: PlayerMp) => p.admin);
        SendMsg(player, 'f9f9f9', `-------- !{${COLORS.COLOR_SERVER}}Admins Online!{f9f9f9} --------`);
        admins.forEach((e) => {
            if (e.getVariable("logged")) {
                SendMsg(player, 'f9f9f9', `(${e.id}) ${e.name} - admin level ${e.admin}`);
            }
        });
        if (admins.length === 0) return sendError(player, "Nu sunt admini conectati.");
        SendMsg(player, 'f9f9f9', `Sunt ${admins.length} admini conectati.`);
    }
});

command.addCommand({
    name: 'helpers',
    description: 'Show helpers online.',
    aliases: [],
    handler: (player: PlayerMp) => {

        const helpers = mp.players.toArray().filter((p: PlayerMp) => p.helper);
        SendMsg(player, 'f9f9f9', `-------- !{${COLORS.COLOR_SERVER}}Helpers Online!{f9f9f9} --------`);
        helpers.forEach((e) => {
            if (e.getVariable("logged")) {
                SendMsg(player, 'f9f9f9', `(${e.id}) ${e.name} - helper level ${e.helper}`);
            }
            else return sendError(player, "Nu sunt helperi conectati.");
        });
        if (helpers.length === 0) return sendError(player, "Nu sunt helperi conectati.");
        SendMsg(player, 'f9f9f9', `Sunt ${helpers.length} helperi conectati.`);
    }
});

command.addCommand({
    name: 'puthelmet',
    description: 'Put hel met.',
    aliases: ['ph'],
    handler: (player: PlayerMp) => mp.events.call(RAGE_GENERAL_EVENTS.SET_PLAYER_HEL_MET, player)
});

command.addCommand({
    name: 'licenses',
    description: 'Show your licenses.',
    aliases: ['mylicenses'],
    handler: (player: PlayerMp) => license.displayLicenses(player, player)
});

command.addCommand({
    name: 'stats',
    description: 'Show your account stats.',
    aliases: [],
    handler: (player: PlayerMp) => showStats(player, player)
});

command.addCommand({
    name: 'report',
    description: 'Report this problem.',
    aliases: [],
    handler: (player: PlayerMp) => player.call(RAGE_CLIENT_EVENTS.SHOW_CLIENT_DIALOG, ["dialog_report", "Alege o optiune", ["1. Sunt blocat/cad prin harta", "2. Am descoperit un bug", "3. Raporteaza un codat.", "4. Raporteaza un DeathMatch"], "Select", "Cancel"])
});