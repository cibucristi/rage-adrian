import { INTERACT_TYPES, RAGE_CLIENT_EVENTS, RAGE_GENERAL_EVENTS } from "@shared/constants";

/* ---- VARIABLES ---- */
let interact_menu_game_ui: any = null;
let type_interact_menu: number = -1;
let camera_interact_menu: any = null;


/* ---- EVENTS ---- */
mp.events.add(RAGE_CLIENT_EVENTS.SHOW_CLIENT_INTERACT_MENU, (title: string, subtitle: string, description: string, button1: string, button2: string, type: number) => {

    if (interact_menu_game_ui == null) interact_menu_game_ui = mp.browsers.new("package://game-ui/interactMenu/index.html");
    interact_menu_game_ui.execute(`show_player_interact_menu(${JSON.stringify(title)}, ${JSON.stringify(subtitle)}, ${JSON.stringify(description)}, ${JSON.stringify(button1)}, ${JSON.stringify(button2)})`);
    type_interact_menu = type; mp.gui.cursor.show(true, true);
    mp.events.call(RAGE_CLIENT_EVENTS.START_CLIENT_CAMERA_INTERACT);
    mp.events.call("client::set_active_interact", false);
    mp.events.call(RAGE_CLIENT_EVENTS.SET_HUD_ACTIVE, false);
    mp.events.call(RAGE_CLIENT_EVENTS.HIDE_CLIENT_CHAT);
    mp.game.ui.displayRadar(false);
    mp.players.local.inInteract = true;
});

mp.events.add(RAGE_CLIENT_EVENTS.START_CLIENT_CAMERA_INTERACT, () => {

    const playerPosition = mp.players.local.position;
    mp.peds.forEachInRange(playerPosition, 5.0, (ped) => {
        const distance = mp.game.gameplay.getDistanceBetweenCoords(playerPosition.x, playerPosition.y, playerPosition.z, ped.position.x, ped.position.y, ped.position.z, true);

        if (distance < 3.0) {
            new mp.Vector3(ped.position.x - 0.6, ped.position.y + 0.9, ped.position.z + 0.8);
            const cameraRotation = mp.game.cam.getGameplayCamRot(2);
            camera_interact_menu = mp.cameras.new('default', getCameraOffset(new mp.Vector3(ped.position.x, ped.position.y, ped.position.z + 1), ped.getRotation(2).z + 90, 3.6), cameraRotation, 20);

            camera_interact_menu.pointAt(ped.handle, 0, -2, 0, true);
            mp.players.local.setAlpha(0);

            mp.players.local.freezePosition(true);
            mp.game.cam.renderScriptCams(true, false, 0, true, false);
            mp.game.cam.setActive(camera_interact_menu.handle, true);
        }
    });
})

mp.events.add(RAGE_CLIENT_EVENTS.ON_CALL_INTERACT_MENU, (type) => {

    switch (type) {

        case INTERACT_TYPES.TYPE_DRIVING_INTERACT: {
            
            mp.events.callRemote(RAGE_GENERAL_EVENTS.START_PLAYER_DMV);
        }
    }
    mp.events.call("client::secondary_interact_button");
});

mp.events.add("client::primary_interact_button", () => mp.events.call(RAGE_CLIENT_EVENTS.ON_CALL_INTERACT_MENU, type_interact_menu));
mp.events.add("client::secondary_interact_button", () => {

    interact_menu_game_ui.destroy();
    camera_interact_menu.destroy();
    camera_interact_menu = null;
    interact_menu_game_ui = null;
    mp.gui.cursor.show(false, false);
    mp.players.local.setAlpha(255);
    mp.game.ui.displayRadar(true);

    type_interact_menu = -1;

    mp.game.cam.renderScriptCams(false, false, 3000, true, true);
    mp.players.local.freezePosition(false);
    mp.players.local.inInteract = false;

    mp.events.call("client::set_active_interact", true);
    mp.events.call(RAGE_CLIENT_EVENTS.SET_HUD_ACTIVE, true);
    mp.events.call(RAGE_CLIENT_EVENTS.SHOW_CLIENT_CHAT);
})

/* ---- FUNCTIONS ---- */
function getCameraOffset(pos: any, angle: any, dist: any) {
    angle = angle * 0.0174533;
    pos.y = pos.y + dist * Math.sin(angle);
    pos.x = pos.x + dist * Math.cos(angle);
    return pos
}