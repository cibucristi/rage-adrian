/* --- IMPORT SECTION --- */
import { SendMsg } from "@/resources/functions";
import { COLORS, RAGE_CLIENT_EVENTS } from "@shared/constants";

/* --- EVENTS --- */
mp.events.add("playerQuit", (player: PlayerMp) => { if (player.asset_dmv == true) return reset_driving_school(player, "leave server."); });
mp.events.add("playerSpawn", (player: PlayerMp) => { if (player.asset_dmv == true) return reset_driving_school(player, "ai primit spawn."); });
mp.events.add("playerDeath", (player: PlayerMp) => { if (player.asset_dmv == true) return reset_driving_school(player, "ai murit."); });
mp.events.add("playerExitVehicle", (player: PlayerMp) => { if (player.asset_dmv == true) return reset_driving_school(player, "ai parasit vehiculul."); });

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
    SendMsg(player, COLORS.COLOR_SERVER, `Driving School: !{f9f9f9}Examenul tau a luat sfarsit si ai fost demis, motiv: ${reason}`);
}