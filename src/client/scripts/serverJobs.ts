import { createActor } from "@/resources/functions";
import { RAGE_CLIENT_EVENTS, RAGE_GENERAL_EVENTS } from "@shared/constants";

/* --- VARIABLES --- */
let jobsmenu_game_ui: any = null;
let actor_jobs_pos = [
    [-1829.7509765625, -1245.7364501953125, 13.017280578613281, 45.49898910522461] //fisher
]

let actor_jobs_model = [
    "g_m_m_armlieut_01" //fisher
]

/* --- EVENTS --- */
mp.events.add(RAGE_CLIENT_EVENTS.SHOW_CLIENT_JOB_MENU, (id, name, distance, owner, level, teleport) => {

    if (jobsmenu_game_ui == null) jobsmenu_game_ui = mp.browsers.new("package://game-ui/jobmenu/index.html");
    jobsmenu_game_ui.execute(`show_player_jobs(${JSON.stringify(id)}, ${JSON.stringify(name)}, ${JSON.stringify(distance)}, ${JSON.stringify(owner)}, ${JSON.stringify(level)}, ${JSON.stringify(teleport)})`);
    mp.gui.cursor.show(true, true);
    mp.events.callRemote(RAGE_GENERAL_EVENTS.SET_PLAYER_VARIABLE_MENU_ACTIVE, true);
    mp.events.call(RAGE_CLIENT_EVENTS.HIDE_CLIENT_CHAT);
});

mp.events.add("client::destroy_client_job_menu", () => {

    jobsmenu_game_ui.destroy();
    jobsmenu_game_ui = null;
    mp.gui.cursor.show(false, false);
    mp.events.callRemote(RAGE_GENERAL_EVENTS.SET_PLAYER_VARIABLE_MENU_ACTIVE, false);
    mp.events.call(RAGE_CLIENT_EVENTS.SHOW_CLIENT_CHAT);
});

mp.events.add("client::click_teleport_job", (jobid: number) => {

    mp.events.callRemote(RAGE_GENERAL_EVENTS.CLICK_JOB_TELEPORT, jobid);
    mp.events.call("client::destroy_client_job_menu");
});

mp.events.add("client::click_find_job", (jobid: number) => {

    mp.events.callRemote(RAGE_GENERAL_EVENTS.CLICK_JOB_TELEPORT, jobid);
    mp.events.call("client::destroy_client_job_menu");
})

/* --- ASSETS --- */
for (let i = 0; i < actor_jobs_pos.length; i++) {
    createActor(new mp.Vector3(actor_jobs_pos[i][0], actor_jobs_pos[i][1], actor_jobs_pos[i][2]), actor_jobs_model[i], actor_jobs_pos[i][3], 0, 'Esti gata sa muncesti?');
}

/* --- BINDS --- */
mp.keys.bind(0x4E, true, function () {
    if (mp.players.local.getVariable("logged") == true && mp.players.local.getVariable("opened_menu") == false && mp.players.local.getVariable("chat_active") == true && mp.players.local.getVariable("kicked") == false) {
        mp.events.callRemote(RAGE_GENERAL_EVENTS.QUIT_PLAYER_JOB);
    }
});
mp.keys.bind(0x59, true, function () {
    if (mp.players.local.getVariable("logged") == true && mp.players.local.getVariable("opened_menu") == false && mp.players.local.getVariable("chat_active") == true && mp.players.local.getVariable("kicked") == false) {
        mp.events.callRemote(RAGE_GENERAL_EVENTS.GET_PLAYER_JOB);
    }
}); 