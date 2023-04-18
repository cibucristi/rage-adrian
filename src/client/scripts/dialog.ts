import { COLORS, RAGE_CLIENT_EVENTS, RAGE_GENERAL_EVENTS } from "@shared/constants";

/* ---- VARIABLES ---- */
let dialog_game_ui: any = null, dialogid: string = "";


/* ---- EVENTS ---- */
mp.events.add(RAGE_CLIENT_EVENTS.SHOW_CLIENT_DIALOG, (dialog_id: string, title: string, listitems: string[], button1: string, button2: string) => {

    if (mp.players.local.getVariable("kicked") == true || mp.players.local.getVariable("opened_menu") == true) return;

    if (dialog_game_ui == null) dialog_game_ui = mp.browsers.new("package://game-ui/dialog/index.html");
    dialog_game_ui.execute(`show_dialog(${JSON.stringify(title)}, ${JSON.stringify(listitems)}, ${JSON.stringify(button1)}, ${JSON.stringify(button2)})`);

    mp.gui.cursor.show(true, true);
    mp.players.local.freezePosition(true);
    mp.game.ui.displayRadar(false);
    mp.game.graphics.transitionToBlurred(0);
    dialogid = dialog_id;

    mp.events.call(RAGE_CLIENT_EVENTS.SET_HUD_ACTIVE, false);
    mp.events.callRemote(RAGE_GENERAL_EVENTS.SET_PLAYER_VARIABLE_MENU_ACTIVE, true);
});

mp.events.add("close_dialog", () => {

    dialog_game_ui.destroy();
    dialog_game_ui = null;
    mp.players.local.freezePosition(false);
    mp.gui.cursor.show(false, false);
    mp.game.ui.displayRadar(true);
    mp.game.graphics.transitionFromBlurred(0);
    dialogid = "";
    mp.events.call(RAGE_CLIENT_EVENTS.SET_HUD_ACTIVE, true);
    mp.events.callRemote(RAGE_GENERAL_EVENTS.SET_PLAYER_VARIABLE_MENU_ACTIVE, false);
});

mp.events.add(RAGE_CLIENT_EVENTS.ON_CLIENT_DIALOG_RESPONSE, (listitem) => {
    if (dialogid == "dialog_report") {
        switch (parseInt(listitem)) {
            case 0: {
                mp.gui.chat.push(`!{${COLORS.COLOR_SERVER}}Report: !{f9f9f9}Soon!`);
                break;
            }
            case 1: {
                mp.gui.chat.push(`!{${COLORS.COLOR_SERVER}}Report: !{f9f9f9}Daca ai descoperit un bug il poti raporta pe panel realizand un ticket.`);
                break;
            }
            case 2: {
                mp.gui.chat.push(`!{${COLORS.COLOR_SERVER}}Report: !{f9f9f9}Folosete cu incredere comanda !{${COLORS.COLOR_SERVER}}(/cheats)!{f9f9f9} pentru a raporta un codat.`);
                break;
            }
            case 3: {
                mp.gui.chat.push(`!{${COLORS.COLOR_SERVER}}Report: !{f9f9f9}Folosete cu incredere comanda !{${COLORS.COLOR_SERVER}}(/dm)!{f9f9f9} pentru a raporta un suspect DeathMatch.`);
                break;
            }
            default: {
                mp.gui.chat.push(`M-am conectat la ma-ta (${listitem})`);
                break;
            }
        }
    }
    if (dialogid == "dialog_fisher") {

        switch (parseInt(listitem)) {

            case 0: {
                mp.events.callRemote(RAGE_GENERAL_EVENTS.BUY_PLAYER_ASSETS_FISH, 0);
                break;
            }
            case 1: {
                mp.events.callRemote(RAGE_GENERAL_EVENTS.BUY_PLAYER_ASSETS_FISH, 1);
                break;
            }
        }
    }
});

mp.events.add("select_listitem", (listitem: number) => {
    mp.events.call(RAGE_CLIENT_EVENTS.ON_CLIENT_DIALOG_RESPONSE, [listitem]);
    mp.events.call("close_dialog");
});

mp.events.add("dialog_escape", () => mp.events.call("close_dialog"));
