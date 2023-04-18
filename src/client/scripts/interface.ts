
import { weapon_data } from "@/resources/weaponData";
import { RAGE_CLIENT_EVENTS } from "@shared/constants";

/* ---- VARIABLES ---- */
let interface_game_ui: any = null;


/* ---- EVENTS ---- */
mp.events.add(RAGE_CLIENT_EVENTS.LOAD_CLIENT_HUD, () => {

    if (interface_game_ui == null) interface_game_ui = mp.browsers.new("package://game-ui/interface/index.html");
    mp.events.call(RAGE_CLIENT_EVENTS.UPDATE_CLIENT_HUD_ID, mp.players.local.id);
});
mp.events.add(RAGE_CLIENT_EVENTS.HIDE_CLIENT_HUD, () => {

    interface_game_ui.destroy();
    interface_game_ui = null;
});

mp.events.add("render", () => {

    if (mp.players.local.weapon && mp.players.local.getVariable("logged")) {
        const weaponData = {
            name: weapon_data[mp.players.local.weapon],
            ammo: mp.players.local.getAmmoInClip(mp.players.local.weapon),
            maxAmmo: mp.game.weapon.getAmmoInPed(mp.players.local.handle, mp.players.local.weapon)
        };
        mp.events.call(RAGE_CLIENT_EVENTS.UPDATE_CLIENT_HUD_WEAPON, weaponData.name, weaponData.ammo, weaponData.maxAmmo);
    }
})

mp.events.add(RAGE_CLIENT_EVENTS.UPDATE_HUD_ONLINE_PLAYERS, () => {

    mp.events.call(RAGE_CLIENT_EVENTS.UPDATE_CLIENT_HUD_ONLINE, mp.players.length);
})

mp.events.add(RAGE_CLIENT_EVENTS.LOAD_CLIENT_HUD_SAFEZONE, (state) => interface_game_ui.execute(`show_player_safe_zone(${JSON.stringify(state)})`));
mp.events.add(RAGE_CLIENT_EVENTS.SET_HUD_ACTIVE, (active: boolean) => interface_game_ui.active = active);
mp.events.add(RAGE_CLIENT_EVENTS.UPDATE_CLIENT_HUD_MONEY, (money, bank) => { interface_game_ui.execute(`show_player_money(${money}, ${bank})`); });
mp.events.add(RAGE_CLIENT_EVENTS.UPDATE_CLIENT_HUD_ID, (id) => { interface_game_ui.execute(`show_player_id(${id})`); });
mp.events.add(RAGE_CLIENT_EVENTS.UPDATE_CLIENT_HUD_ONLINE, (online) => { interface_game_ui.execute(`show_player_online(${online})`); });
mp.events.add(RAGE_CLIENT_EVENTS.UPDATE_CLIENT_HUD_WEAPON, (gunname, ammo, maxAmmo) => interface_game_ui.execute(`show_player_weapon(${JSON.stringify(gunname)}, ${JSON.stringify(ammo)}, ${JSON.stringify(maxAmmo)})`))