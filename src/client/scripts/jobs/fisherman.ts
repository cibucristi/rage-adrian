import { createActor } from "@/resources/functions";
import { RAGE_CLIENT_EVENTS, RAGE_GENERAL_EVENTS } from "@shared/constants";

/* --- VARIABLES --- */
let enter_colshape_fisherman = false;
let enter_colshape_fisherman_shop = false;

mp.blips.new(356, new mp.Vector3(-1261.8863525390625, -1433.7791748046875, 4.347604274749756), { name: 'Fish Shop', color: 68, shortRange: true });
mp.blips.new(762, new mp.Vector3(-702.8245849609375, -916.8101196289062, 19.214113235473633), { name: 'Fish Shop (Sell)', color: 68, shortRange: true });
mp.markers.new(27, new mp.Vector3(-1262.145996, -1434.322266, 4.348525 - 0.99), 0.7, { direction: new mp.Vector3(0, 0, 0), color: [255, 255, 255, 255], dimension: 0, visible: true })
mp.markers.new(27, new mp.Vector3(-702.769287, -917.574951, 19.212721 - 0.99), 0.7, { direction: new mp.Vector3(0, 0, 0), color: [255, 255, 255, 255], dimension: 0, visible: true })

const colshape_fisher = mp.colshapes.newSphere(-1262.145996, -1434.322266, 4.348525, 1.5, 0);
const colshape_fisher_shop = mp.colshapes.newSphere(-702.769287, -917.574951, 19.212721, 1.5, 0);
const colshape_fisher_speed = mp.colshapes.newSphere(-1781.7550048828125, -1164.5003662109375, 13.032398223876953, 20, 0);


createActor(new mp.Vector3(-1261.8863525390625, -1433.7791748046875, 4.347604274749756), "u_m_y_baygor", 136.20965576171875, 0, "Esti pescar adevarat? Hai sa-ti cumperi ce ai nevoie");
createActor(new mp.Vector3(-702.8245849609375, -916.8101196289062, 19.214113235473633), "csb_janitor", 179.3992156982422, 0, "Ai peste de vanzare?");

mp.events.add("playerEnterColshape", (shape: ColshapeMp) => {

    if (shape === colshape_fisher) {
        enter_colshape_fisherman = true;
        mp.events.call(RAGE_CLIENT_EVENTS.SHOW_CLIENT_INTERACT, 'TO BUY ROD / BAIT', 'E');
    }
    if (shape === colshape_fisher_shop) {
        enter_colshape_fisherman_shop = true;
        mp.events.call(RAGE_CLIENT_EVENTS.SHOW_CLIENT_INTERACT, 'TO SELL FISH', 'E');
    }
    if (shape == colshape_fisher_speed) {
        if (mp.players.local.vehicle) {
            mp.game.graphics.startScreenEffect('Dont_tazeme_bro', 0, true);
            let currentVelocity = mp.players.local.vehicle.getVelocity();
            let newVelocity = new mp.Vector3(currentVelocity.x * 0.4, currentVelocity.y * 0.4, currentVelocity.z * 0.4);
            mp.players.local.vehicle.setVelocity(newVelocity.x, newVelocity.y, newVelocity.z);
        }
    }
});
mp.events.add("playerExitColshape", (shape) => {

    if (shape === colshape_fisher) {
        enter_colshape_fisherman = false;
        mp.events.call("client::destroy_player_interact");
    }
    if (shape === colshape_fisher_shop) {
        enter_colshape_fisherman_shop = false;
        mp.events.call("client::destroy_player_interact");
    }
    if (shape === colshape_fisher_speed) {
        if (mp.players.local.vehicle) {
            mp.game.graphics.stopScreenEffect('Dont_tazeme_bro');
        }
    }
});

/* --- EVENTS --- */
mp.events.add(RAGE_CLIENT_EVENTS.SET_CLIENT_FISH_ROD, () => {
    mp.players.local.taskStartScenarioInPlace("WORLD_HUMAN_STAND_FISHING", 0, false);
});

/* --- BINDS --- */
mp.keys.bind(0x45, true, function () {
    if (mp.players.local.getVariable("logged") == true && mp.players.local.getVariable("chat_active") == true && enter_colshape_fisherman == true) {

        mp.events.callRemote(RAGE_GENERAL_EVENTS.SHOW_PLAYER_FISHERMAN_DIALOG);
    }
});
mp.keys.bind(0x45, true, function () {
    if (mp.players.local.getVariable("logged") == true && mp.players.local.getVariable("chat_active") == true && enter_colshape_fisherman_shop == true) {

        mp.events.callRemote(RAGE_GENERAL_EVENTS.SELL_PLAYER_FISH);
    }
});

