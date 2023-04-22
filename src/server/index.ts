import './class/database';

import './resources/account';
import './resources/events';
import './resources/react';
import './resources/vehicles';
import './resources/wasted';
import './resources/debugs';

import './scripts/playerCommands';
import './scripts/adminCommands';
import './scripts/helperCommands';
import './scripts/drivingSchool';
import './scripts/serverJobs';
import './scripts/serverBusiness';

/* --- DISCORD --- */
//import './discord/index';

/* --- JOBS --- */
import './scripts/jobs/fisherman';

/* ---- IMPORT ---- */
import { PaydayManager } from './class/payday';
import { SendMsg } from './resources/functions';
import { COLORS, RAGE_CLIENT_EVENTS } from '@shared/constants';
import { Database } from './class/database';

/* ---- VARIABLES ---- */
const db = new Database();

/* --- INITIALIZE CLASS --- */
new PaydayManager();

/* ---- TIMER GLOBAL ---- */
setInterval(() => {
    mp.players.forEach(async (player) => {
        if (player.getVariable('logged') === true && player.getVariable("kicked") == false) {
            try {
                if (player.position.x == player.lastX && player.position.y == player.lastY && player.position.z == player.lastZ) { player.afk++; }
                else { if (player.afk) player.afk = 0; player.seconds++; }
                player.lastX = player.position.x; player.lastY = player.position.y; player.lastZ = player.position.z;

                if (player.mute > 0) {

                    player.mute--;
                    if (player.mute == 1) {
                        player.mute = 0;
                        SendMsg(player, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Ai primit unmute automat.`);
                        await db.query(`update accounts set mute = 0 where username = ?`, [player.name]);
                    }
                }
            } catch { }
        }
    });
}, 1000);