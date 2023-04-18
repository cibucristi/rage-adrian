import { RAGE_CLIENT_EVENTS, RAGE_GENERAL_EVENTS } from "@shared/constants";

if (mp.storage.data.timeStamp === undefined) mp.storage.data.timeStamp = false;
if (mp.storage.data.pageSize === undefined) mp.storage.data.pageSize = 15;
if (mp.storage.data.fontSize === undefined) mp.storage.data.fontSize = 10;

let chat_active = true;

mp.gui.chat.show(false);
const chat = mp.browsers.new("package://game-ui/chat/index.html");
chat.markAsChat();
mp.keys.bind(0x54, true, function () {
    try {

        if (mp.players.local.getVariable("logged") == true && chat_active == true && mp.players.local.getVariable("opened_menu") == false && mp.players.local.getVariable("kicked") == false) {
            chat.execute(`show_chat_press_t(true);`);
            mp.events.callRemote(RAGE_GENERAL_EVENTS.SET_PLAYER_VARIABLE_ACTIVE_CHAT, false);

            mp.gui.cursor.show(true, true);
        }
    } catch (e: any) {
        mp.console.logInfo(e, true, true);
    }
});
mp.events.add(RAGE_CLIENT_EVENTS.SHOW_CLIENT_CHAT, () => {
    chat.execute(`set_login_chat_active(true);`);
});
mp.events.add(RAGE_CLIENT_EVENTS.HIDE_CLIENT_CHAT, () => {
    chat.execute(`set_login_chat_active(false);`);
});
mp.events.add('hideChat', () => {
    mp.events.callRemote(RAGE_GENERAL_EVENTS.SET_PLAYER_VARIABLE_ACTIVE_CHAT, true);
    mp.gui.cursor.show(false, false);
});
mp.events.add('updateChatTimestamp', x => mp.storage.data.timeStamp = x);
mp.events.add('updateChatFontsize', x => mp.storage.data.pageSize = x);
mp.events.add('updateChatPagesize', x => mp.storage.data.fontSize = x);
chat.execute(`trigger('chatData', {timestamp: ${mp.storage.data.timeStamp}, pagesize: ${mp.storage.data.pageSize}, fontsize: ${mp.storage.data.fontSize}});`);


mp.keys.bind(0x76, true, function () {
    if (mp.players.local.getVariable("logged") == true && mp.players.local.getVariable("opened_menu") == false && mp.players.local.getVariable("chat_active") == true && mp.players.local.getVariable("kicked") == false) {
        chat.execute(`set_login_chat_active(${!chat_active});`);
        mp.game.ui.displayRadar(!chat_active);
        chat_active = !chat_active;
        mp.events.call(RAGE_CLIENT_EVENTS.SET_HUD_ACTIVE, chat_active);
    }
});