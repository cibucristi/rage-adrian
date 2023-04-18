import { RAGE_CLIENT_EVENTS, RAGE_GENERAL_EVENTS } from "@shared/constants";

/* ---- VARIABLES ---- */
let login_game_ui: any = null;


/* ---- CAMERA ---- */
let camera: any = mp.cameras.new("camera", new mp.Vector3(-106.67566680908203, -913.72119140625, 938.3674926757812), new mp.Vector3(0, 0, 0), 55);
camera.pointAtCoord(0, 0 + 5, 0); //
camera.setActive(true);
mp.game.cam.renderScriptCams(true, false, 0, true, false);


/* ---- RAGE EVENTS ---- */
mp.events.add("playerReady", () => {
    mp.events.call(RAGE_CLIENT_EVENTS.SHOW_CLIENT_LOGIN);
});


/* ---- CLIENT EVENTS ---- */
mp.events.add("client::login_event", (username: string, password: string) => {
    mp.events.callRemote(RAGE_GENERAL_EVENTS.LOGIN_SERVER_ACCOUNT, username, password);
    mp.console.logInfo(`${RAGE_GENERAL_EVENTS.LOGIN_SERVER_ACCOUNT}`);
});
mp.events.add("client::register_event", (username: string, email: string, password: string) => mp.events.callRemote(RAGE_GENERAL_EVENTS.REGISTER_SERVER_ACCOUNT, username, email, password));

mp.events.add("client::login_handler", (handle: any) => {

    switch (handle) {

        case 'success': mp.events.call(RAGE_CLIENT_EVENTS.HIDE_CLIENT_LOGIN); break;
        case 'registred': mp.events.call(RAGE_CLIENT_EVENTS.HIDE_CLIENT_LOGIN); break;
        case 'password-incorrect': mp.game.graphics.notify("Parola introdusa nu este corecta."); break;
        case 'account-taken': mp.game.graphics.notify("Acest cont este deja inregistrat pe server."); break;
        case 'short-auth': mp.game.graphics.notify("Caracterele introduse la parola/nume sunt prea scurte."); break;
        case 'logged': mp.game.graphics.notify("Acest utilizator este deja logat pe server."); break;
        case 'email-invalid': mp.game.graphics.notify("Email-ul introdus nu este valid."); break;
        case 'password-check': mp.game.graphics.notify("Parola confirmata nu corespunde cu cea setata mai sus."); break;
        default: break;
    }
});

mp.events.add(RAGE_CLIENT_EVENTS.SHOW_CLIENT_LOGIN, () => {

    mp.players.local.position = new mp.Vector3(-592.2943115234375, 6099.81689453125, 7.8534722328186035);
    mp.players.local.setVisible(false, false);

    if (login_game_ui == null) login_game_ui = mp.browsers.new("package://game-ui/account/index.html");
    login_game_ui.active = true;
    setTimeout(() => { mp.gui.cursor.show(true, true); mp.gui.chat.activate(false); }, 500);

    mp.players.local.freezePosition(true);
    mp.game.ui.displayRadar(false);
    mp.events.call(RAGE_CLIENT_EVENTS.HIDE_CLIENT_CHAT);
});

mp.events.add(RAGE_CLIENT_EVENTS.HIDE_CLIENT_LOGIN, () => {

    if (camera) camera.destroy();
    mp.game.cam.renderScriptCams(false, false, 3000, true, true);

    login_game_ui.active = false;
    login_game_ui.destroy();
    mp.players.local.freezePosition(false);
    mp.gui.cursor.show(false, false);
    mp.game.ui.displayRadar(true);
    mp.players.local.setVisible(true, true);
    mp.events.call(RAGE_CLIENT_EVENTS.LOAD_CLIENT_HUD);
    mp.events.call(RAGE_CLIENT_EVENTS.SHOW_CLIENT_CHAT);
});

/* ---- KEYS ---- */
mp.keys.bind(0x1B, true, function () {

    if (mp.players.local.getVariable("logged") == false && login_game_ui.active == true) {

        mp.events.call(RAGE_CLIENT_EVENTS.HIDE_CLIENT_LOGIN);
        mp.events.callRemote(RAGE_GENERAL_EVENTS.KICK_PLAYER, 'Ai primit kick deoarece ai parasit loginul.');
    }
});