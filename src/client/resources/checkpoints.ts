/* --- IMPORT SECTION --- */
import { CheckpointManager } from "@/class/checkpoints";
import { RAGE_CLIENT_EVENTS, RAGE_GENERAL_EVENTS } from "@shared/constants";


/* --- VARIABLES --- */
const checkpoint = new CheckpointManager();

/* --- EVENTS --- */
mp.events.add(RAGE_CLIENT_EVENTS.SET_CLIENT_CHECKPOINT, (checkpointid, type, position, direction, radius, status, dimension) => {
    checkpoint.setPlayerCheckpoint(checkpointid, type, position, direction, radius, status, dimension);
    mp.events.callRemote(RAGE_GENERAL_EVENTS.SET_PLAYER_CHECKPOINT_VARIABLE, true);
});
mp.events.add(RAGE_CLIENT_EVENTS.DESTROY_CLIENT_CHECKPOINT, () => {
    checkpoint.destroyPlayerCheckpoint();
    mp.events.callRemote(RAGE_GENERAL_EVENTS.SET_PLAYER_CHECKPOINT_VARIABLE, false);
});


mp.events.add("playerEnterCheckpoint", () => {

    if (checkpoint.isPlayerEnterCheckpoint(1)) {

        mp.events.call(RAGE_CLIENT_EVENTS.DESTROY_CLIENT_CHECKPOINT);
        checkpoint.playSoundEnterCheckpoint();
    }
})