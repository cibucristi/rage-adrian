import { RAGE_CLIENT_EVENTS } from "@shared/constants";

/* ---- VARIABLES ---- */
let interact_game_ui: any = null;


/* ---- EVENTS ---- */
mp.events.add(RAGE_CLIENT_EVENTS.SHOW_CLIENT_INTERACT, (text, keyWord) => {

    if (interact_game_ui == null) interact_game_ui = mp.browsers.new("package://game-ui/interact/index.html");
    interact_game_ui.execute(`show_player_interact_text(${JSON.stringify(keyWord)}, ${JSON.stringify(text)})`);
});

mp.events.add("client::destroy_player_interact", () => {

    interact_game_ui.destroy();
    interact_game_ui = null;
});
mp.events.add("client::set_active_interact", (state) => {

    if (interact_game_ui != null) interact_game_ui.active = state;
})