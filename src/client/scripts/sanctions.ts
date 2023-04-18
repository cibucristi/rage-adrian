import { RAGE_CLIENT_EVENTS } from "@shared/constants";

/* ---- VARIABLES ---- */
let sanctions_game_ui: any = null;


/* ---- EVENTS ---- */
mp.events.add(RAGE_CLIENT_EVENTS.SHOW_CLIENT_SANCTION, (status: string, text: string) => {

    if (sanctions_game_ui == null) sanctions_game_ui = mp.browsers.new("package://game-ui/sanctions/index.html");
    sanctions_game_ui.execute(`show_sanction_menu(${JSON.stringify(status)}, ${JSON.stringify(text)});`);
});