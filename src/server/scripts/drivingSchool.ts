/* --- IMPORT SECTION --- */
import { SendMsg } from "@/resources/functions";
import { COLORS, RAGE_CLIENT_EVENTS } from "@shared/constants";

/* --- EVENTS --- */
mp.events.add("playerQuit", (player: PlayerMp) => { if (player.asset_dmv == true) return reset_driving_school(player, "left the server."); });
mp.events.add("playerSpawn", (player: PlayerMp) => { if (player.asset_dmv == true) return reset_driving_school(player, "you have been respawned."); });
mp.events.add("playerDeath", (player: PlayerMp) => { if (player.asset_dmv == true) return reset_driving_school(player, "you died."); });
mp.events.add("playerExitVehicle", (player: PlayerMp) => { if (player.asset_dmv == true) return reset_driving_school(player, "you left the exam car."); });

const reset_driving_school = (player: PlayerMp, reason: string) => {

    if (player.asset_dmv == true) player.asset_dmv = false;
    if (player.asset_dmv_step != -1) player.asset_dmv_step = -1;
    if (player.asset_dmv_vehicle != null) {
        player.asset_dmv_vehicle.destroy();
        player.asset_dmv_vehicle = null;
    }
    player.call(RAGE_CLIENT_EVENTS.STOP_CLIENT_DMV);
    player.position = new mp.Vector3(-59.02427673339844, -616.4788818359375, 37.35683822631836);
    player.dimension = 0;
    SendMsg(player, COLORS.COLOR_SERVER, `DMV: !{f9f9f9}Your exam session has been terminated, reason: ${reason}`);
}