import { RAGE_CLIENT_EVENTS, RAGE_GENERAL_EVENTS } from "@shared/constants";

/* ---- VARIABLES ---- */
let inputalert_game_ui: any = null;
let input_type: any = undefined;


/* ---- EVENTS ---- */
mp.events.add(RAGE_CLIENT_EVENTS.SHOW_CLIENT_ALERT_INPUT, (description, type, button1, button2, holder, inputType, title) => {

    if (inputalert_game_ui == null) inputalert_game_ui = mp.browsers.new("package://game-ui/inputalert/index.html");
    inputalert_game_ui.execute(`show_input_alert(${JSON.stringify(description)}, ${JSON.stringify(type)}, ${JSON.stringify(button1)}, ${JSON.stringify(button2)}, ${JSON.stringify(holder)}, ${JSON.stringify(title)})`);
    mp.gui.cursor.show(true, true);
    mp.players.local.freezePosition(true);
    mp.game.ui.displayRadar(false);
    mp.game.graphics.transitionToBlurred(0);

    mp.events.callRemote(RAGE_GENERAL_EVENTS.SET_PLAYER_VARIABLE_MENU_ACTIVE, true);
    input_type = inputType;
});

mp.events.add("client::hide_input_alert", () => {

    inputalert_game_ui.destroy();
    inputalert_game_ui = null;
    mp.players.local.freezePosition(false);
    mp.gui.cursor.show(false, false);
    mp.game.ui.displayRadar(true);
    mp.game.graphics.transitionFromBlurred(0);
    mp.events.callRemote(RAGE_GENERAL_EVENTS.SET_PLAYER_VARIABLE_MENU_ACTIVE, false);
});

mp.events.add("client::action_input_alert", (input) => {

    if (input_type == "fisherman") mp.events.callRemote(RAGE_GENERAL_EVENTS.ACTION_INPUT_FISHERMAN, input);
})