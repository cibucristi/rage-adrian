import { RAGE_CLIENT_EVENTS } from "@shared/constants";

/* ---- EVENTS ---- */
mp.events.add(RAGE_CLIENT_EVENTS.FREEZE_CLIENT, (player: PlayerMp, state) => player.freezePosition(state));