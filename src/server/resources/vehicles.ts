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
        console.log(player.asset_dmv);
        if (player.licenses.driving_license.status == "inactive" || "suspended" && !vehicleIsABike(vehicleName) && !vehicleIsBoat(vehicleName) && !vehicleIsFly(vehicleName) && player.asset_dmv == true) {
            player.removeFromVehicle(); player.stopAnimation();
            return sendError(player, "You don't have a driving license.");
        }
        if (player.licenses.flying_license.status == "inactive" || "suspended" && vehicleIsFly(vehicleName)) {
            player.removeFromVehicle(); player.stopAnimation();
            return sendError(player, "You don't have a flying license.");
        }
        if (player.licenses.boat_license.status == "inactive" || "suspended" && vehicleIsBoat(vehicleName)) {
            player.removeFromVehicle(); player.stopAnimation();
            return sendError(player, "You don't have a boat license.");
        }
    }
});
mp.events.add("playerExitVehicle", (player: PlayerMp, vehicle: any) => {

    const vehicleName = vehicle.getVariable("createVehicle");
    if (vehicleIsBike(vehicleName) && player.hel_met == true) mp.events.call(RAGE_GENERAL_EVENTS.REMOVE_PLAYER_HEL_MET, player);
    if (!vehicleIsBike(vehicleName) && player.getVariable("belt") == true) mp.events.call(RAGE_GENERAL_EVENTS.REMOVE_PLAYER_BELT, player);
});
