/* ---- IMPORT SECTION ---- */
import { Database } from '../class/database';
import * as bcrypt from 'bcryptjs';
import { RAGE_CLIENT_EVENTS, RAGE_GENERAL_EVENTS } from '@shared/constants';

/* ---- VARIABLES ---- */
let database = new Database();

/* ---- RAGEMP EVENTS ---- */
mp.events.add("playerJoin", (player: PlayerMp) => {

    player.setVariable("logged", false);
    player.loginTimeout = setTimeout(() => {
        player.call(RAGE_CLIENT_EVENTS.HIDE_CLIENT_LOGIN);
        player.kick("Ai primit kick deoarece au trecut 60 de secunde fara sa te loghezi/inregistrezi.");
    }, 60000);
});
mp.events.add("playerQuit", async (player: PlayerMp) => {
    if (player.loginTimeout != null) clearTimeout(player.loginTimeout);
    await database.query("update accounts set mute = ? where username = ?", [player.mute, player.name]);
});
/* ---- FUNCTIONS ---- */
export function is_email_valid({ email }: { email: string; }): boolean {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function succes_account_handle(player: PlayerMp, handle: any, username: string) {

    mp.events.call(RAGE_GENERAL_EVENTS.LOAD_PLAYER_ACCOUNT, player, username);
    player.call('client::login_handler', [handle]);
    console.log(`[ACCOUNT]: ${username} has been logged successfully.`);
    clearTimeout(player.loginTimeout);
    mp.players.forEach((e) => e.call(RAGE_CLIENT_EVENTS.UPDATE_HUD_ONLINE_PLAYERS));
}
export function error_handler_message(e: any) {
    if (e.sql) { console.log(`[MySQL] ERROR: ${e.sqlMessage}\n[MySQL] QUERY: ${e.sql}`) } else { console.log(`Error: ${e}`) }
}
export function failed_account(player: PlayerMp, handle: any) { player.call(`client::login_handler`, [handle]); }
export async function attempt_server_register(player: PlayerMp, username: string, email: string, pass: string): Promise<any> {

    try {
        console.log(`Username: ${username} | Email: ${email} | Pass: ${pass}`);
        const [rows] = await database.query('SELECT * FROM `accounts` WHERE `username` = ?', [username]);

        if (!rows || rows.length === 0) {

            const hash = await bcrypt.hash(pass, 10);
            await database.query('insert into accounts (username, email, password, socialClub, socialClubId) values (?,?,?,?,?)', [username, email, hash, player.socialClub, player.rgscId]);
            return true;
        }
        else return false;

    } catch (error) {

        if (error) console.log(error);
    }
}
export async function attempt_server_login(username: string, password: string): Promise<any> {

    try {

        const [rows] = await database.query('select username, password, id from accounts where username = ?', [username]);
        if (rows) {

            const newLocal = await bcrypt.compare(password, rows.password);
            if (newLocal) return true;
        }
        else return false;

    } catch (error) {

        if (error) console.log(error);

    }
}