/* ---- VARIABLES ---- */

import { RAGE_CLIENT_EVENTS, RAGE_GENERAL_EVENTS } from "@shared/constants";

/* ---- EVENTS ---- */
mp.events.add(RAGE_CLIENT_EVENTS.SET_CLIENT_ENGINE_STATE, (state: boolean, player: PlayerMp) => {

    if (state) player.vehicle.setLights(0);
    if (player.vehicle && !player.vehicle.getIsEngineRunning()) {

        player.vehicle.setEngineOn(state, state, true);
        player.vehicle.setUndriveable(state);
    }
});

mp.events.add(RAGE_CLIENT_EVENTS.REMOVE_CLIENT_HELMET, () => {
    mp.players.local.setHelmet(false);
    mp.players.local.clearAllProps();
})

mp.events.add(RAGE_CLIENT_EVENTS.SET_CLIENT_HELMET, () => {
    mp.players.local.setHelmet(false);
    mp.players.local.setPropIndex(0, 18, 0, true);
});
mp.events.add(RAGE_CLIENT_EVENTS.SET_CLIENT_BELT, () => {
    if (mp.players.local.getVariable("belt") == true) mp.players.local.setConfigFlag(32, false);
    else mp.players.local.setConfigFlag(32, true);
});
mp.events.add(RAGE_CLIENT_EVENTS.REMOVE_CLIENT_BELT, () => {
    mp.players.local.setConfigFlag(32, false);
})

/* ---- BINDS ---- */
mp.keys.bind(0x32, true, function () {
    if (mp.players.local.getVariable("logged") == true && mp.players.local.getVariable("opened_menu") == false && mp.players.local.getVariable("chat_active") == true && mp.players.local.getVariable("kicked") == false) mp.events.callRemote(RAGE_GENERAL_EVENTS.START_VEHICLE_ENGINE);
});
mp.keys.bind(0x4B, true, function () {
    if (mp.players.local.getVariable("logged") == true && mp.players.local.getVariable("opened_menu") == false && mp.players.local.getVariable("chat_active") == true && mp.players.local.getVariable("kicked") == false) mp.events.callRemote(RAGE_GENERAL_EVENTS.SET_PLAYER_BEALT);
});