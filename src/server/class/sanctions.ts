import { sendToAll } from "@/resources/functions";
import { COLORS, RAGE_CLIENT_EVENTS } from "@shared/constants";
import { Database } from "./database";
const db = new Database();

export class SanctionsManager {

    kickPlayer(player: PlayerMp, reason: string) {

        player.setVariable("kicked", true);
        player.call(RAGE_CLIENT_EVENTS.HIDE_CLIENT_HUD);
        player.call(RAGE_CLIENT_EVENTS.HIDE_CLIENT_CHAT);
        player.call(RAGE_CLIENT_EVENTS.SHOW_CLIENT_SANCTION, ['kicked', reason]);
        player.call("client::freze_player", [player, true]);
        player.setVariable("logged", false);
        if (player.vehicle) player.vehicle.destroy();
        player.position = new mp.Vector3(0, 0, 0);
    }

    async banPlayer(player: PlayerMp, adminName: string, days: any, active: boolean, permanent: boolean, reason: string, reason2: string) {

        player.setVariable("kicked", true);
        player.call(RAGE_CLIENT_EVENTS.HIDE_CLIENT_HUD);
        player.call(RAGE_CLIENT_EVENTS.HIDE_CLIENT_CHAT);
        player.call(RAGE_CLIENT_EVENTS.SHOW_CLIENT_SANCTION, ['banned', reason]);
        player.call(RAGE_CLIENT_EVENTS.FREEZE_CLIENT, [player, true]);
        player.setVariable("logged", false);
        if (player.vehicle) player.vehicle.destroy();
        player.position = new mp.Vector3(0, 0, 0);

        await db.query("insert into bans (name, socialClubId, active, permanent, days, reason, adminName) values (?,?,?,?,?,?,?)", [player.name, player.rgscId, active, permanent, days, reason2, adminName]);

        sendToAll(COLORS.COLOR_SERVER, `Ban: !{f9f9f9}Jucatorul ${player.name} a primit ban ${days != 0 ? `${days} zile` : `permanent`} de la ${adminName}, reason: ${reason2}`);
    }

    async warnPlayer(player: PlayerMp, reason: string) {

        player.warns++;
        if (player.warns >= 3) {
            this.banPlayer(player, 'AdmBot', 3, true, false, `Ai fost banat 3 zile de catre AdmBot, motiv: 3/3 Warnings (Reason warn: ${reason}).`, `${reason}`);
            player.warns = 0;
        }
        await db.query("update accounts set warns = ? where username = ?", [player.warns, player.name]);
    }
    async mutePlayer(player: PlayerMp, minute: any) {

        player.mute = minute;
        await db.query("update accounts set mute = ? where username = ?", [player.mute, player.name]);
    }
}

function decrementDays() {
    db.query('SELECT * FROM bans WHERE active > 0 AND days > 0', (error: any, results: any, fields: any) => {
        if (error) throw console.log(error);
        if (results.length > 0) {
            db.query('UPDATE bans SET days = days - 1 WHERE active > 0 AND days > 0', (error: any, results: any, fields: any) => {
                if (error) throw console.log(error);
                console.log(`[BAN]: Updated ${results.length} ban(s).`);
            });
        } else {
            console.log('[BAN]: No bans found with days left.');
        }
    });
}
import { CronJob } from "cron";
new CronJob('0 0 0 * * *', decrementDays, null, true, 'Europe/Bucharest');