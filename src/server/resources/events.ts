import { Database } from "@/class/database";
import { LicensesManager } from "@/class/licenses";
import { COLORS, RAGE_CLIENT_EVENTS, RAGE_GENERAL_EVENTS } from "@shared/constants";
import { appendFile } from "fs";
import { enums } from "./structures";
import { attempt_server_login, attempt_server_register, error_handler_message, failed_account, is_email_valid, succes_account_handle } from "./account";
import { createVehicle, formatNumber, get_distance_from_point, givePlayerMoney, isPlayerInRangeOfPoint, select_player_database, sendError, sendLocal, SendMsg, sendStaff, spawn_player, vehicleIsABike, vehicleIsBike } from "./functions";
import { giveJobSalary, loaded_component_jobs } from "@/scripts/serverJobs";


import torsoDataFemaleJson from './json/besttorso_female.json';
import torsoDataMaleJson from './json/besttorso_male.json';

const torsoDataFemale: TorsoData = torsoDataFemaleJson;
const torsoDataMale: TorsoData = torsoDataMaleJson;


/* --- VARIABLES --- */
const hexColorPattern: any = /^!\{([0-9a-fA-F]{6})\}/;
const database = new Database();
const license = new LicensesManager();

/* --- EVENTS --- */
mp.events.add(RAGE_GENERAL_EVENTS.KICK_PLAYER, (player: PlayerMp, reason: string) => {
    if (player.loginTimeout != null) clearTimeout(player.loginTimeout);
    player.kick(reason);
});
mp.events.add(RAGE_GENERAL_EVENTS.REMOVE_PLAYER_VARIABLE_COLLISION, (player: PlayerMp) => player.vehicle.setVariable("collision_vehicle", false));
mp.events.add(RAGE_GENERAL_EVENTS.SET_PLAYER_VARIABLE_COLLISION, (player: PlayerMp) => player.vehicle.setVariable("collision_vehicle", true));
mp.events.add(RAGE_GENERAL_EVENTS.SET_PLAYER_CHECKPOINT_VARIABLE, (player: PlayerMp, status) => player.setVariable("checkpoint_status", status));
mp.events.add(RAGE_GENERAL_EVENTS.SET_PLAYER_VARIABLE_MENU_ACTIVE, (player: PlayerMp, state: boolean) => player.setVariable("opened_menu", state));
mp.events.add(RAGE_GENERAL_EVENTS.SET_PLAYER_VARIABLE_ACTIVE_CHAT, (player: PlayerMp, active: boolean) => { player.setVariable("chat_active", active); });
mp.events.add(RAGE_GENERAL_EVENTS.SAVE_SERVER_CAM_COORDS, (player, position, pointAtCoord, name = 'No name') => {
    const pos = JSON.parse(position);
    const point = JSON.parse(pointAtCoord);
    const saveFile = 'savedposcam.txt';

    appendFile(saveFile, `Position: ${pos.x}, ${pos.y}, ${pos.z} | pointAtCoord: ${point.position.x}, ${point.position.y}, ${point.position.z} | entity: ${point.entity} - ${name}\r\n`, (err) => {
        if (err) {
            player.notify(`~r~SaveCamPos Error: ~w~${err.message}`);
        } else {
            player.notify(`~g~PositionCam saved. ~w~(${name})`);
        }
    });
});
mp.events.add(RAGE_GENERAL_EVENTS.SET_SPAWN_PLAYER, (player: PlayerMp) => spawn_player(player));
mp.events.add(RAGE_GENERAL_EVENTS.REGISTER_SERVER_ACCOUNT, async (player: PlayerMp, username: string, email: string, password: string) => {


    if (username.length >= 3 && password.length >= 5) {

        if (!is_email_valid({ email })) return failed_account(player, 'email-invalid');

        try {
            const row = await attempt_server_register(player, username, email, password);

            if (row) {

                console.log(`[ACCOUNT]: ${username} has been registred successfully.`);
                succes_account_handle(player, "registred", username);
                player.setVariable("registred", true);
                player.call(RAGE_CLIENT_EVENTS.SHOW_CLIENT_CHARACTER_CREATOR);
            }
            else failed_account(player, "account-taken");

        } catch (error) {
            error_handler_message(error);
        }
    }
});
mp.events.add(RAGE_GENERAL_EVENTS.SET_PLAYER_MALE_GENDER, (player: PlayerMp) => {
    player.gender = 1;
    player.model = mp.joaat("mp_m_freemode_01");
    player.skin = "mp_m_freemode_01";
});
mp.events.add(RAGE_GENERAL_EVENTS.SET_PLAYER_FEMALE_GENDER, (player: PlayerMp) => {
    player.gender = 2;
    player.model = mp.joaat("mp_f_freemode_01");
    player.skin = "mp_f_freemode_01";
});
mp.events.add(RAGE_GENERAL_EVENTS.CREATE_PLAYER_CHARACTER, async (player: PlayerMp) => {
    await database.query("update accounts set hair = ?, pants = ?, shirt = ?, shoes = ?, gender = ?, skin = ? where username = ?", [player.hair, player.pants, player.shirt, player.shoes, player.gender, player.skin, player.name]);
    spawn_player(player);
    player.call(RAGE_CLIENT_EVENTS.SHOW_CLIENT_CHAT);
    player.call(RAGE_CLIENT_EVENTS.SET_HUD_ACTIVE, [true]);
    SendMsg(player, COLORS.COLOR_SERVER, `Server: !{f9f9f9}Welcome to Rayed MultiPlayer`);
});
mp.events.add(RAGE_GENERAL_EVENTS.LOGIN_SERVER_ACCOUNT, async (player: PlayerMp, username: string, password: string) => {    
    let logged_account = mp.players.toArray().find(logged => logged.getVariable("username") === username);
    if (logged_account) return player.call("client::login_handler", ['logged']);

    try {

        const res = await attempt_server_login(username, password);
        res ? succes_account_handle(player, 'success', username) : failed_account(player, 'password-incorrect');

    } catch (error) {

        if (error) error_handler_message(error);
    }
});
mp.events.add(RAGE_GENERAL_EVENTS.LOAD_PLAYER_ACCOUNT, async (player: PlayerMp, username: string) => {

    try {
        const [rows] = await database.query('select * from accounts where username = ?', [username]);
        if (rows && rows.length !== 0) {
            setTimeout(() => {
                select_player_database(player, rows);
                player.name = username;
                player.setVariable("username", username);
                player.setVariable("logged", true);

                setTimeout(() => {
                    player.call(RAGE_CLIENT_EVENTS.UPDATE_CLIENT_HUD_MONEY, [player.money, player.bank]);
                    if (player.getVariable("registred") == true) {

                        player.call(RAGE_CLIENT_EVENTS.HIDE_CLIENT_CHAT);
                        player.call(RAGE_CLIENT_EVENTS.SET_HUD_ACTIVE, [false]);
                    }
                    else {

                        SendMsg(player, 'f9f9f9', `Welcome back to !{${COLORS.COLOR_SERVER}}Rayed MultiPlayer!{f9f9f9}.`);
                        if (player.admin > 0) {
                            if (player.staff == false) player.staff = true;
                            sendStaff(COLORS.COLOR_SERVER, `Join: !{f9f9f9}Admin ${player.name} logged into the server.`);
                        }
                        if (player.helper > 0) {
                            if (player.staff == false) player.staff = true;
                            sendStaff(COLORS.COLOR_SERVER, `Join: !{f9f9f9}Helper ${player.name} logged into the server.`);
                        }
                        spawn_player(player);
                    }
                    database.query("update accounts set lastActive = now() where username = ?", [username]);
                }, 10);
            }, 100);

            const [rows_ban] = await database.query('select * from bans where name = ? and active > 0', [username]);
            if (rows_ban && rows_ban.length !== 0) {
                if (rows_ban.permanent == true || rows_ban.days > 0) {
                    player.setVariable("kicked", true);
                    player.call(RAGE_CLIENT_EVENTS.HIDE_CLIENT_HUD);
                    player.call(RAGE_CLIENT_EVENTS.HIDE_CLIENT_CHAT);
                    player.call(RAGE_CLIENT_EVENTS.SHOW_CLIENT_SANCTION, ['banned', `Esti banat de catre adminul ${rows_ban.adminName} ${rows_ban.days != 0 ? `pentru ${rows_ban.days} zile` : `permanent`}, motiv: ${rows_ban.reason}`]);
                    player.call(RAGE_CLIENT_EVENTS.FREEZE_CLIENT, [player, true]);
                    return;
                }
                else {
                    await database.query("delete from bans where name = ?", [username]);
                }
            }
        }
        else console.log("No rows found with this username.");
    } catch (error) {

        if (error) { console.log(error); }
    }
});
mp.events.add(RAGE_GENERAL_EVENTS.START_VEHICLE_ENGINE, (player: PlayerMp) => {

    if (player.vehicle && player.seat === 0) {

        const vehicleName = player.vehicle.getVariable("createVehicle");
        if (!vehicleIsABike(vehicleName)) {

            const veh = player.vehicle;
            veh.engine = !veh.engine;
            veh.setVariable("engine_status", veh.engine);
            if (veh.getVariable("engine_status") == true) player.call(RAGE_CLIENT_EVENTS.SET_CLIENT_ENGINE_STATE, [false, player]);
            else player.call(RAGE_CLIENT_EVENTS.SET_CLIENT_ENGINE_STATE, [true, player]);

            sendLocal(player, 'C2A2DA', 20, `* ${player.name} has ${veh.getVariable("engine_status") == true ? "started" : "turned off"} vehicle ${vehicleName}.`);
        }
    }
});
mp.events.add(RAGE_GENERAL_EVENTS.SET_PLAYER_BEALT, (player: PlayerMp) => {

    if (player.vehicle) {

        const vehicleName: any = player.vehicle.getVariable("createVehicle");
        if (vehicleIsBike(vehicleName)) return;
        if (player.getVariable("belt") == false) player.setVariable("belt", true);
        else player.setVariable("belt", false);
        player.call(RAGE_CLIENT_EVENTS.SET_CLIENT_BELT);
        sendLocal(player, 'C2A2DA', 20.0, `* ${player.name} ${player.getVariable("belt") == true ? "put" : "took off"} his belt.`);
    }
})
mp.events.add(RAGE_GENERAL_EVENTS.SET_PLAYER_HAIR, (player: PlayerMp, hair) => {
    player.setClothes(2, parseInt(hair), 0, 0);
    if (player.gender === 2) { if (torsoDataFemale[hair][0].BestTorsoDrawable != -1) player.setClothes(3, torsoDataFemale[hair][0].BestTorsoDrawable, torsoDataFemale[hair][0].BestTorsoTexture, 2); }
    else { if (torsoDataMale[hair][0].BestTorsoDrawable != -1) player.setClothes(3, torsoDataMale[hair][0].BestTorsoDrawable, torsoDataMale[hair][0].BestTorsoTexture, 2); }
    if (player.getVariable("registred") === true) player.hair = parseInt(hair);
});
mp.events.add(RAGE_GENERAL_EVENTS.SET_PLAYER_PANTS, (player: PlayerMp, pants) => {
    player.setClothes(4, parseInt(pants), 0, 0);
    if (player.gender === 2) { if (torsoDataFemale[pants][0].BestTorsoDrawable != -1) player.setClothes(3, torsoDataFemale[pants][0].BestTorsoDrawable, torsoDataFemale[pants][0].BestTorsoTexture, 2); }
    else { if (torsoDataMale[pants][0].BestTorsoDrawable != -1) player.setClothes(3, torsoDataMale[pants][0].BestTorsoDrawable, torsoDataMale[pants][0].BestTorsoTexture, 2); }
    if (player.getVariable("registred") === true) player.pants = parseInt(pants);
});
mp.events.add(RAGE_GENERAL_EVENTS.SET_PLAYER_SHIRT, (player: PlayerMp, shirt) => {
    player.setClothes(11, parseInt(shirt), 0, 0);
    if (player.gender === 2) { if (torsoDataFemale[shirt][0].BestTorsoDrawable != -1) player.setClothes(3, torsoDataFemale[shirt][0].BestTorsoDrawable, torsoDataFemale[shirt][0].BestTorsoTexture, 2); }
    else { if (torsoDataMale[shirt][0].BestTorsoDrawable != -1) player.setClothes(3, torsoDataMale[shirt][0].BestTorsoDrawable, torsoDataMale[shirt][0].BestTorsoTexture, 2); }
    if (player.getVariable("registred") === true) player.shirt = parseInt(shirt);
});
mp.events.add(RAGE_GENERAL_EVENTS.SET_PLAYER_SHOES, (player: PlayerMp, shoes) => {
    player.setClothes(6, parseInt(shoes), 0, 0);
    if (player.gender === 2) { if (torsoDataFemale[shoes][0].BestTorsoDrawable != -1) player.setClothes(3, torsoDataFemale[shoes][0].BestTorsoDrawable, torsoDataFemale[shoes][0].BestTorsoTexture, 2); }
    else { if (torsoDataMale[shoes][0].BestTorsoDrawable != -1) player.setClothes(3, torsoDataMale[shoes][0].BestTorsoDrawable, torsoDataMale[shoes][0].BestTorsoTexture, 2); }
    if (player.getVariable("registred") === true) player.shoes = parseInt(shoes);
});
mp.events.add(RAGE_GENERAL_EVENTS.REMOVE_PLAYER_BELT, (player: PlayerMp) => {

    player.setVariable("belt", false);
    player.call(RAGE_CLIENT_EVENTS.REMOVE_CLIENT_BELT);
    sendLocal(player, 'C2A2DA', 20, `* ${player.name} took off his belt.`);
})

mp.events.add(RAGE_GENERAL_EVENTS.SET_PLAYER_HEL_MET, (player: PlayerMp) => {

    if (player.vehicle) {
        let vehicleName: any = player.vehicle.getVariable("createVehicle");
        if (!vehicleIsBike(vehicleName)) return sendError(player, "Nu esti pe un motor.");
        player.hel_met = !player.hel_met;
        if (player.hel_met == false) player.call(RAGE_CLIENT_EVENTS.REMOVE_CLIENT_HELMET);
        else player.call(RAGE_CLIENT_EVENTS.SET_CLIENT_HELMET);

        sendLocal(player, 'C2A2DA', 20.0, `* ${player.name} ${player.hel_met == true ? "put" : "took off"} his helmet.`);
    }
});

mp.events.add(RAGE_GENERAL_EVENTS.REMOVE_PLAYER_HEL_MET, (player: PlayerMp) => {

    player.hel_met = false;
    player.call(RAGE_CLIENT_EVENTS.REMOVE_CLIENT_HELMET);
    sendLocal(player, 'C2A2DA', 20, `* ${player.name} took off his helmet on.`);
});
mp.events.add(RAGE_GENERAL_EVENTS.START_PLAYER_DMV, (player: PlayerMp) => {

    if (player.asset_dmv == true) return;
    if (player.licenses.driving_license.status == "suspended") return sendError(player, `Your driving license is suspended for ${player.licenses.driving_license.suspend_hours} more ${player.licenses.driving_license.suspend_hours < 2?`hour`:`hours`}.`);
    if (player.licenses.driving_license.expiration_date > 0 ) return sendError(player, "Your driving license is already active.");
    if (player.vehicle) return;


    player.dimension = player.id + 1;

    for (let i = 0; i < 30; i++) SendMsg(player, 'f9f9f9', "");
    setTimeout(() => {

        player.asset_dmv_vehicle = createVehicle(player, "blista", new mp.Vector3(-156.6477508544922, -637.8682861328125, 31.929088592529297 + 0.5), new mp.Vector3(0.02728378400206566, -0.06651134788990021, 71.03855895996094), "DMV", 1, 1, true, false, player.id + 1, 1, 69.34549713134766);
        player.asset_dmv_step = 0; player.call(RAGE_CLIENT_EVENTS.START_CLIENT_DMV, [player.asset_dmv_step, player.dimension]);
        player.asset_dmv = true;

        SendMsg(player, COLORS.COLOR_SERVER, `(#) Driving School:`);
        SendMsg(player, COLORS.COLOR_SERVER, 'DMV: !{#FFFFFF}The exam has begin, please follow all the instructions below.');
        SendMsg(player, COLORS.COLOR_SERVER, `DMV: !{#FFFFFF}Press !{${COLORS.COLOR_SERVER}}2!{f9f9f9} to start the vehicle.`);
        SendMsg(player, COLORS.COLOR_SERVER, `DMV: !{#FFFFFF}After you started the vehicle's engine, please follow all the checkpoints marked by the Server.`);
    }, 100);
});

mp.events.add(RAGE_GENERAL_EVENTS.ENTER_PLAYER_CHECKPOINT_DMV, async (player: PlayerMp) => {

    if (player.asset_dmv == true) {
        player.asset_dmv_step++;
        switch (player.asset_dmv_step) {

            case 7: {
                let licenseName: any = "driving_license";

                player.asset_dmv = false; player.asset_dmv_step = -1; player.asset_dmv_vehicle.destroy(); player.asset_dmv_vehicle = null;
                player.call(RAGE_CLIENT_EVENTS.STOP_CLIENT_DMV); player.dimension = 0;
                await license.addActiveHours(player, licenseName, (Math.floor(Date.now() / 1000))+604800);
                setTimeout(() => {
                    SendMsg(player, COLORS.COLOR_SERVER, `Driving School: !{f9f9f9}Felicitari, examenul a luat sfarsit si ai intrat pe pozitia !{${COLORS.COLOR_SERVER}}Passed!{f9f9f9}.`);
                    SendMsg(player, COLORS.COLOR_SERVER, `Driving School: !{f9f9f9}Asta inseamna ca ai obtinut licenta de condus pentru 50 de ore.`);
                    SendMsg(player, COLORS.COLOR_SERVER, `Driving School: !{f9f9f9}Apasa cu incredere tasta !{${COLORS.COLOR_SERVER}}O!{f9f9f9} pentru a-ti verifica licenta.`);
                }, 100);
                break;
            }
            default: {
                player.call(RAGE_CLIENT_EVENTS.STOP_CLIENT_DMV);
                player.call(RAGE_CLIENT_EVENTS.START_CLIENT_DMV, [player.asset_dmv_step, player.dimension]);
                break;
            }
        }
    }
});
mp.events.add(RAGE_GENERAL_EVENTS.GET_PLAYER_JOB, async (player: PlayerMp) => {

    for (let i = 0; i < loaded_component_jobs; i++) {
        if (isPlayerInRangeOfPoint(player, new mp.Vector3(enums.jobs[i].job_pos_x, enums.jobs[i].job_pos_y, enums.jobs[i].job_pos_z), 1.0)) {
            if (player.job != 0) return sendError(player, "Ai deja un job.");
            player.job = enums.jobs[i].job_id;
            SendMsg(player, COLORS.COLOR_SERVER, `Jobs: !{f9f9f9}Noul tau job este: !{${COLORS.COLOR_SERVER}}${enums.jobs[i].job_name}.`);
            if (i == 0) return SendMsg(player, COLORS.COLOR_SERVER, `Sfat: !{f9f9f9}Ai nevoie de o undita si momeala pentru a prinde peste, le poti achizitiona de la un Fish Shop.`);
            await database.query("update accounts set job = ? where username = ?", [player.job, player.name]);
            return;
        }
    }
});
mp.events.add(RAGE_GENERAL_EVENTS.CLICK_JOB_TELEPORT, (player: PlayerMp, job_id) => {
    const jobid = job_id - 1;
    if (player.vehicle) return sendError(player, "Nu poti face acest lucru dintr-un vehicul.");
    player.position = new mp.Vector3(enums.jobs[jobid].job_pos_x, enums.jobs[jobid].job_pos_y, enums.jobs[jobid].job_pos_z);
    SendMsg(player, COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Te-ai teleportat cu succes la jobul ${enums.jobs[jobid].job_name}.`);
});
mp.events.add(RAGE_GENERAL_EVENTS.CLICK_JOB_TELEPORT, (player: PlayerMp, job_id) => {
    const jobid = job_id - 1;
    const distance = get_distance_from_point(player, enums.jobs[jobid].job_pos_x, enums.jobs[jobid].job_pos_y, enums.jobs[jobid].job_pos_z);
    if (player.getVariable("checkpoint_status") == true) return sendError(player, "Ai un checkpoint activ.");
    player.call(RAGE_CLIENT_EVENTS.SET_CLIENT_CHECKPOINT, [1, 1, new mp.Vector3(enums.jobs[jobid].job_pos_x, enums.jobs[jobid].job_pos_y, enums.jobs[jobid].job_pos_z), new mp.Vector3(0, 0, 0), 3, true, 0]);
    SendMsg(player, COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Ti-a fost setat un checkpoint catre jobul ${enums.jobs[jobid].job_name} la distanta de ${distance}.`);
});
mp.events.add(RAGE_GENERAL_EVENTS.QUIT_PLAYER_JOB, async (player: PlayerMp) => {

    for (let i = 0; i < loaded_component_jobs; i++) {
        if (isPlayerInRangeOfPoint(player, new mp.Vector3(enums.jobs[i].job_pos_x, enums.jobs[i].job_pos_y, enums.jobs[i].job_pos_z), 1.0)) {

            if (player.job == 0) return sendError(player, "Nu ai un job.");

            player.job = 0;
            if (player.have_fish == true) player.have_fish = false;
            SendMsg(player, COLORS.COLOR_SERVER, `Jobs: !{f9f9f9}Ai demisionat de la jobul tau.`);
            await database.query('update accounts set job = ? where username = ?', [player.job, player.name]);
            return;
        }
    }
});
mp.events.add(RAGE_GENERAL_EVENTS.SELL_PLAYER_FISH, (player: PlayerMp) => {
    if (player.job != 1) return;
    if (player.have_fish == false) return sendError(player, 'Nu ai un peste.');
    player.have_fish = false;
    giveJobSalary(player, 0, player.skill[0]);
});
mp.events.add(RAGE_GENERAL_EVENTS.BUY_PLAYER_ASSETS_FISH, async (player: PlayerMp, type) => {
    if (type == 0) {
        if (player.money < 50000) return sendError(player, 'Nu ai suma necesara de bani.');
        if (player.fishrod == true) return sendError(player, 'Ai deja o undita.');
        player.fishrod = true;
        SendMsg(player, COLORS.COLOR_SERVER, `Shop: !{f9f9f9}Felicitari, ai achizitionat o undinta de pescuit.`);
    } else if (type == 1)
        player.call(RAGE_CLIENT_EVENTS.SHOW_CLIENT_ALERT_INPUT, [
            'Introdu suma de momeala pe care doresti sa o achizitionezi.',
            'number',
            'Buy',
            'Cancel',
            'Total bait',
            'fisherman',
            'Fish Shop'
        ]);
    await database.query('update accounts set fishrod = ? where username = ?', [player.fishrod, player.momeala, player.name]);
});
mp.events.add(RAGE_GENERAL_EVENTS.SHOW_PLAYER_FISHERMAN_DIALOG, (player: PlayerMp) => {
    player.call(RAGE_CLIENT_EVENTS.SHOW_CLIENT_DIALOG, ['dialog_fisher', 'Alege o optiune', ['1. Rod\t\t\t$50.000', '2. Bait\t\t\t$250.000'], 'Buy', 'Cancel']);
});
mp.events.add(RAGE_GENERAL_EVENTS.ACTION_INPUT_FISHERMAN, async (player: PlayerMp, input) => {
    if (player.money < input * 250) return sendError(player, 'Nu ai suma necesara de bani.');
    if (player.momeala + input > 500) return sendError(player, 'Ai deja prea multa momeala (500).');
    if (input < 1 || input > 50) return sendError(player, 'Poti cumpara intre 1 - 50 bucati de momeala.');
    player.momeala += input;
    givePlayerMoney(player, 'take', input * 250);
    SendMsg(
        player,
        COLORS.COLOR_SERVER,
        `Shop: !{f9f9f9}Felicitari, ai achizitionat ${input} bucati de momeala pentru $${formatNumber(input * 250)}.`
    );

    player.call('client::hide_input_alert');
    await database.query('update accounts set momeala = ? where username = ?', [player.momeala, player.name]);
});


/* --- RAGE.MP EVENTS --- */
mp.events.add("playerCommand", (player: PlayerMp) => {
    if (player.getVariable("logged") == false) return false;
    return;
});
mp.events.add("playerChat", (player: PlayerMp, text: string) => {
    if (player.getVariable("logged") == false) return false;
    if (text.match(hexColorPattern)) return false;
    if (player.mute > 0) return sendError(player, `Ai mute pentru ${player.mute} secunde.`);
    sendLocal(player, `f9f9f9`, 20.0, `${player.name} [${player.id}]: !{c4c4c4}${text}`);
    return;
});