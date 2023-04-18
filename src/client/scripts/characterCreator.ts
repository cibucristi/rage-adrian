import { RAGE_CLIENT_EVENTS, RAGE_GENERAL_EVENTS } from "@shared/constants";

/* ---- VARIABLES ---- */
let character_game_ui: any = null;
let camera_character: any = null;

/* ---- EVENTS ---- */
mp.events.add(RAGE_CLIENT_EVENTS.SHOW_CLIENT_CHARACTER_CREATOR, () => {
    if (character_game_ui == null) character_game_ui = mp.browsers.new("package://game-ui/characterCreator/index.html");
    character_game_ui.execute('set_character_gender("male")');
    mp.players.local.freezePosition(true);
    mp.gui.cursor.show(true, true);
    mp.players.local.position = new mp.Vector3(-38.632973, -590.870422, 78.830299);
    mp.players.local.heading = -21.903759002685547;
    camera_character = mp.cameras.new('default', new mp.Vector3(-37.433753967285156, -586.7223510742188, 79.89160919189453), new mp.Vector3(-38.990421295166016, -591.0322875976562, 79.27576446533203), 40);
    camera_character.pointAtCoord(-38.990421295166016, -591.0322875976562, 79.27576446533203);
    mp.game.cam.renderScriptCams(true, false, 0, true, false);
});
mp.events.add("client::set_player_gender_male", () => mp.events.callRemote(RAGE_GENERAL_EVENTS.SET_PLAYER_MALE_GENDER));
mp.events.add("client::set_player_gender_female", () => mp.events.callRemote(RAGE_GENERAL_EVENTS.SET_PLAYER_FEMALE_GENDER));
mp.events.add("client::set_player_hair", (hair) => mp.events.callRemote(RAGE_GENERAL_EVENTS.SET_PLAYER_HAIR, hair));
mp.events.add("client::set_player_pants", (pants) => mp.events.callRemote(RAGE_GENERAL_EVENTS.SET_PLAYER_PANTS, pants));
mp.events.add("client::set_player_shirt", (shirt) => mp.events.callRemote(RAGE_GENERAL_EVENTS.SET_PLAYER_SHIRT, shirt));
mp.events.add("client::set_player_shoes", (shoes) => mp.events.callRemote(RAGE_GENERAL_EVENTS.SET_PLAYER_SHOES, shoes));
mp.events.add("client::create_player_character", () => {
    mp.events.callRemote(RAGE_GENERAL_EVENTS.CREATE_PLAYER_CHARACTER);
    mp.gui.cursor.show(false, false);
    mp.players.local.freezePosition(false);
    character_game_ui.destroy();
    camera_character.destroy();
    mp.game.cam.renderScriptCams(false, false, 3000, true, true);
});