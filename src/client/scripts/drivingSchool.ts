import { createActor } from "@/resources/functions";
import { INTERACT_TYPES, RAGE_CLIENT_EVENTS, RAGE_GENERAL_EVENTS } from "@shared/constants";

/* --- VARIABLES --- */
let enter_colshape_driving_school = false;
let driving_school_marker: any = null;
let driving_school_blip: any = null;
let driving_school_colshape: any = null;

/* --- ARRAY --- */
const driving_school_checkpoints = [
    [-159.98141479492188, -654.30712890625, 31.71495246887207],
    [-146.91493225097656, -767.3121337890625, 32.64348602294922],
    [-139.3036651611328, -914.8553466796875, 28.809314727783203],
    [-6.210561752319336, -892.9146728515625, 29.406129837036133],
    [-3.4189741611480713, -748.778076171875, 31.650007247924805],
    [-104.25984954833984, -684.361328125, 34.5906982421875],
    [-146.6360626220703, -651.2100830078125, 32.2677001953125],
    [-183.54037475585938, -628.2532958984375, 31.92952537536621]
]

/* --- ASSETS --- */
mp.blips.new(512, new mp.Vector3(-59.37861251831055, -616.3502807617188, 37.35678482055664), { name: 'Driving School', color: 69, shortRange: true });
const colshape_driving_school = mp.colshapes.newSphere(-59.37861251831055, -616.3502807617188, 37.35678482055664, 1.5, 0);
createActor(new mp.Vector3(-58.95973587036133, -616.5047607421875, 37.35678482055664), "s_m_m_ciasec_01", 70.14763641357422, 0, "Esti gata sa obti licenta de condus?");
/* --- EVENTS --- */

mp.events.add("playerEnterColshape", (shape) => {

    if (shape === colshape_driving_school) {
        enter_colshape_driving_school = true;
        mp.events.call(RAGE_CLIENT_EVENTS.SHOW_CLIENT_INTERACT, 'TO START LESSON', 'E');
    }
    if (shape === driving_school_colshape) mp.events.callRemote(RAGE_GENERAL_EVENTS.ENTER_PLAYER_CHECKPOINT_DMV);
});
mp.events.add("playerExitColshape", (shape) => {
    if (shape === colshape_driving_school) {
        enter_colshape_driving_school = false;
        mp.events.call("client::destroy_player_interact");
    }
});

mp.events.add(RAGE_CLIENT_EVENTS.START_CLIENT_DMV, (step, dimension) => {
    driving_school_colshape = mp.colshapes.newSphere(driving_school_checkpoints[step][0], driving_school_checkpoints[step][1], driving_school_checkpoints[step][2], 2, dimension);
    driving_school_marker = mp.markers.new(1, new mp.Vector3(driving_school_checkpoints[step][0], driving_school_checkpoints[step][1], driving_school_checkpoints[step][2] - 1.0), 3, { color: [144, 0, 255, 255], visible: true, dimension: dimension });
    driving_school_blip = mp.blips.new(1, new mp.Vector3(driving_school_checkpoints[step][0], driving_school_checkpoints[step][1], driving_school_checkpoints[step][2]), { name: `Driving School (#${step + 1})`, color: 27, shortRange: true, dimension: dimension });
    driving_school_blip.setRoute(true);
});

mp.events.add(RAGE_CLIENT_EVENTS.STOP_CLIENT_DMV, () => {

    driving_school_marker.destroy();
    driving_school_marker = null;

    driving_school_colshape.destroy();
    driving_school_colshape = null;

    driving_school_blip.setRoute(false);
    driving_school_blip.destroy();
    driving_school_blip = null;
});

/* --- KEYS --- */
mp.keys.bind(0x45, true, function () {
    if (mp.players.local.getVariable("logged") == true && mp.players.local.getVariable("chat_active") == true && enter_colshape_driving_school == true) {

        mp.events.call(RAGE_CLIENT_EVENTS.SHOW_CLIENT_INTERACT_MENU, 'Politist', 'Driving School', 'Esti pe cale sa obti permisul de conducere? Cu ajutorul acestuia poti conduce orice vehicul de orice categorie.', 'Incepe testul', 'Inchide', INTERACT_TYPES.TYPE_DRIVING_INTERACT);
    }
});

