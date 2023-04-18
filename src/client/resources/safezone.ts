import { RAGE_CLIENT_EVENTS, RAGE_GENERAL_EVENTS } from "@shared/constants";
import { isPlayerInRangeOfPoint } from "./functions";

interface SafeZone {
    name: string;
    coords: {
        x: number;
        y: number;
        z: number;
        radius: number;
        color: number;
        alpha: number;
        blipid: number;
    };
    shape: ColshapeMp | null;
};

/* --- VARIABLES --- */
const safeZones: SafeZone[] = [
    { name: "FisherMan", coords: { x: -1814.785645, y: -1202.152832, z: 13.006753, radius: 100, color: 2, alpha: 100, blipid: 9 }, shape: null },
    { name: "FisherSell", coords: { x: -703.342651, y: -920.922546, z: 19.013908, radius: 50, color: 2, alpha: 100, blipid: 9 }, shape: null }
];

const removeAllBlips = () => {

    for (let i = 0; i <= 826; i++) {

        let blipCheck = mp.game.ui.getFirstBlipInfoId(i);
        while (mp.game.ui.doesBlipExist(blipCheck)) {

            mp.game.ui.removeBlip(blipCheck);
            blipCheck = mp.game.ui.getNextBlipInfoId(i);
        }
    }
}
removeAllBlips();

/* -- INIT BLIP / COLSHAPE -- */
safeZones.forEach((zone) => {
    const { coords } = zone;
    zone.shape = mp.colshapes.newSphere(coords.x, coords.y, coords.z, coords.radius);
    const blip = mp.game.ui.addBlipForRadius(coords.x, coords.y, coords.z, coords.radius);
    mp.game.ui.setBlipSprite(blip, coords.blipid);
    mp.game.invoke("0x45FF974EEE1C8734", blip, coords.alpha);
    mp.game.invoke("0x03D7FB09E75D6B7E", blip, coords.color);
});

/* --- EVENTS --- */
mp.events.add("playerEnterColshape", (shape: ColshapeMp) => {
    const zone = safeZones.find((zone) => zone.shape === shape);
    if (zone) {
        mp.players.local.inSafezone = true;
        mp.events.call(RAGE_CLIENT_EVENTS.LOAD_CLIENT_HUD_SAFEZONE, true);
    }
});
mp.events.add("playerExitColshape", (shape: ColshapeMp) => {
    const zone = safeZones.find((zone) => zone.shape === shape);
    if (zone) {
        mp.players.local.inSafezone = false;
        mp.events.call(RAGE_CLIENT_EVENTS.LOAD_CLIENT_HUD_SAFEZONE, false);
    }
});

mp.events.add(RAGE_CLIENT_EVENTS.ENABLE_CLIENT_VEHICLE_COLLISION, (vehicle: VehicleMp) => {

    mp.vehicles.forEachInRange(vehicle.position, 30, (x) => {
        x.setNoCollision(vehicle.handle, true);
    });
    vehicle.setAlpha(255);
});

mp.events.add(RAGE_CLIENT_EVENTS.DISABLE_CLIENT_VEHICLE_COLLISION, (vehicle: VehicleMp) => {

    mp.vehicles.forEachInRange(vehicle.position, 30, (x) => {
        x.setNoCollision(vehicle.handle, false);
    });
    vehicle.setAlpha(102);
});

setInterval(() => {
    if (mp.players.local.vehicle) {
        for (const zone of safeZones) {
            const { coords } = zone;
            if (isPlayerInRangeOfPoint(mp.players.local, new mp.Vector3(coords.x, coords.y, coords.z), coords.radius)) {
                if (mp.players.local.vehicle.getVariable("collision_vehicle") === false) return;
                mp.events.call(RAGE_CLIENT_EVENTS.DISABLE_CLIENT_VEHICLE_COLLISION, mp.players.local.vehicle);
                mp.events.callRemote(RAGE_GENERAL_EVENTS.REMOVE_PLAYER_VARIABLE_COLLISION);
                break;
            } else {
                if (mp.players.local.vehicle.getVariable("collision_vehicle") === true) continue;
                mp.events.call(RAGE_CLIENT_EVENTS.ENABLE_CLIENT_VEHICLE_COLLISION, mp.players.local.vehicle);
                mp.events.callRemote(RAGE_GENERAL_EVENTS.SET_PLAYER_VARIABLE_COLLISION);
                break;
            }
        }
    }
}, 1000);