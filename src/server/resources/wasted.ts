import { spawn_player } from "./functions";

const respawnTime: any = 8000;

function respawnAtHospital(player: PlayerMp) {
    spawn_player(player);

    player.spawn(new mp.Vector3(-116.83824920654297, -604.8067016601562, 36.28071594238281));

    clearTimeout(player.respawnTimer);
    player.respawnTimer = null;
}
mp.events.add("playerReady", (player) => {
    player.respawnTimer = null;
});

mp.events.add("playerDeath", (player) => {
    if (player.respawnTimer) clearTimeout(player.respawnTimer);
    player.respawnTimer = setTimeout(respawnAtHospital, respawnTime, player);
});

mp.events.add("playerQuit", (player) => {
    if (player.respawnTimer) clearTimeout(player.respawnTimer);
});