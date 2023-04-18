/* ---- IMPORT SECTION ---- */
import { RAGE_CLIENT_EVENTS, RAGE_GENERAL_EVENTS } from "@shared/constants";
import { sendError, vehicleIsBike, vehicleIsABike, vehicleIsBoat, vehicleIsFly } from "./functions";

/* ---- EVWNTS ---- */
mp.events.add("playerEnterVehicle", (player: PlayerMp, vehicle: any, seat: any) => {

    if (vehicle.getVariable("engine_status") == true) player.call(RAGE_CLIENT_EVENTS.SET_CLIENT_ENGINE_STATE, [false, player]);
    else player.call(RAGE_CLIENT_EVENTS.SET_CLIENT_ENGINE_STATE, [true, player]);

    let vehicleName = vehicle.getVariable("createVehicle");
    if (vehicleIsBike(vehicleName)) player.call(RAGE_CLIENT_EVENTS.REMOVE_CLIENT_HELMET);

    if (seat == 0) {

        if (player.licenses.driving.activeHours == 0 && !vehicleIsABike(vehicleName) && !vehicleIsBoat(vehicleName) && !vehicleIsFly(vehicleName) && player.asset_dmv == false) {
            player.removeFromVehicle(); player.stopAnimation();
            return sendError(player, "You don't have driving license.");
        }
        if (player.licenses.fly.activeHours == 0 && vehicleIsFly(vehicleName)) {
            player.removeFromVehicle(); player.stopAnimation();
            return sendError(player, "You don't have fly license.");
        }
        if (player.licenses.boat.activeHours == 0 && vehicleIsBoat(vehicleName)) {
            player.removeFromVehicle(); player.stopAnimation();
            return sendError(player, "You don't have boat license.");
        }
    }
});
mp.events.add("playerExitVehicle", (player: PlayerMp, vehicle: any) => {

    const vehicleName = vehicle.getVariable("createVehicle");
    if (vehicleIsBike(vehicleName) && player.hel_met == true) mp.events.call(RAGE_GENERAL_EVENTS.REMOVE_PLAYER_HEL_MET, player);
    if (!vehicleIsBike(vehicleName) && player.getVariable("belt") == true) mp.events.call(RAGE_GENERAL_EVENTS.REMOVE_PLAYER_BELT, player);
});
