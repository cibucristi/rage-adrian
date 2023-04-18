
/* --- IMPORT SECTION --- */
import { CommandManager } from "@/class/commands";
import { Database } from "@/class/database";
import { formatNumber, sendAdmins, sendError, SendMsg, sendUsage } from "@/resources/functions";
import { enums } from "@/resources/structures";
import { COLORS } from "@shared/constants";


/* --- VARIABLES --- */
let command = new CommandManager();
let db = new Database();
let loaded_component_bizz: number = 0;
let business_type = ["", "Bank", "24/7", "Gun Shop", "Gas Station", "Rent Car", "Rent Bike", "Clothing Store"];
let icons_business = [-1, 431, 52, 110, 361, 669, 661, 73];
let icons_colors_business = [-1, 37, 35, 38, 79, 47, 46, 7]


/* --- FUNCTIONS --- */
async function LoadServerBizz() {

    await db.query("select * from business", (err: any, result: any) => {

        if (err) return console.log(err);
        if (result.length !== 0) {

            for (let i = 0; i < result.length; i++) {

                enums.bizz[i].bizz_id = i + 1;
                enums.bizz[i].bizz_level = result[i].level;
                enums.bizz[i].bizz_price = result[i].price;
                enums.bizz[i].bizz_balance = result[i].balance;
                enums.bizz[i].bizz_type = result[i].type;
                enums.bizz[i].bizz_icon = result[i].icon;
                enums.bizz[i].bizz_icon_color = result[i].icon_color;

                enums.bizz[i].bizz_pos_x = result[i].x;
                enums.bizz[i].bizz_pos_y = result[i].y;
                enums.bizz[i].bizz_pos_z = result[i].z;

                enums.bizz[i].bizz_description = result[i].description;
                enums.bizz[i].bizz_owner = result[i].owner;

                enums.bizz[i].bizz_status = result[i].status;
                enums.bizz[i].bizz_owned = result[i].owned;

                if (enums.bizz[i].bizz_price == 0) enums.bizz[i].bizz_3d_text = mp.labels.new(`~p~${enums.bizz[i].bizz_description}\n~p~Owner: ~w~${enums.bizz[i].bizz_owner}\n~p~Level: ~w~${enums.bizz[i].bizz_level}\n~p~Type: ~w~${business_type[enums.bizz[i].bizz_type]}`, new mp.Vector3(enums.bizz[i].bizz_pos_x, enums.bizz[i].bizz_pos_y, enums.bizz[i].bizz_pos_z), { los: true, font: 4, drawDistance: 50 });
                else enums.bizz[i].bizz_3d_text = mp.labels.new(`~p~${enums.bizz[i].bizz_description}\n~p~Owner: ~w~${enums.bizz[i].bizz_owner}\n~p~Level: ~w~${enums.bizz[i].bizz_level}\n~p~Type: ~w~${business_type[enums.bizz[i].bizz_type]}\n~p~Price: ~w~${formatNumber(enums.bizz[i].bizz_price)}\n~w~Type ~p~(/buybiz)~w~ to buy bizz.`, new mp.Vector3(enums.bizz[i].bizz_pos_x, enums.bizz[i].bizz_pos_y, enums.bizz[i].bizz_pos_z), { los: true, font: 4, drawDistance: 50 });
                enums.bizz[i].bizz_pickup = mp.markers.new(1, new mp.Vector3(enums.bizz[i].bizz_pos_x, enums.bizz[i].bizz_pos_y, enums.bizz[i].bizz_pos_z - 1.0), 1, { color: [142, 83, 233, 255], dimension: 0 });
                enums.bizz[i].bizz_map_icon = mp.blips.new(enums.bizz[i].bizz_icon, new mp.Vector3(enums.bizz[i].bizz_pos_x, enums.bizz[i].bizz_pos_y, enums.bizz[i].bizz_pos_z), { name: business_type[enums.bizz[i].bizz_type], color: enums.bizz[i].bizz_icon_color, shortRange: true })
            }
            loaded_component_bizz++;
        }
        console.log(`[MYSQL]: Loaded business: ${loaded_component_bizz}`);
    });
}

function update_business_assets(i: any) {

    enums.bizz[i].bizz_3d_text.destroy(); enums.bizz[i].bizz_pickup.destroy(); enums.bizz[i].bizz_map_icon.destroy();

    if (enums.bizz[i].bizz_price == 0) enums.bizz[i].bizz_3d_text = mp.labels.new(`~p~${enums.bizz[i].bizz_description}\n~p~Owner: ~w~${enums.bizz[i].bizz_owner}\n~p~Level: ~w~${enums.bizz[i].bizz_level}\n~p~Type: ~w~${business_type[enums.bizz[i].bizz_type]}`, new mp.Vector3(enums.bizz[i].bizz_pos_x, enums.bizz[i].bizz_pos_y, enums.bizz[i].bizz_pos_z), { los: true, font: 4, drawDistance: 50 });
    else enums.bizz[i].bizz_3d_text = mp.labels.new(`~p~${enums.bizz[i].bizz_description}\n~p~Owner: ~w~${enums.bizz[i].bizz_owner}\n~p~Level: ~w~${enums.bizz[i].bizz_level}\n~p~Type: ~w~${business_type[enums.bizz[i].bizz_type]}\n~p~Price: ~w~${formatNumber(enums.bizz[i].bizz_price)}\n~w~Type ~p~(/buybiz)~w~ to buy bizz.`, new mp.Vector3(enums.bizz[i].bizz_pos_x, enums.bizz[i].bizz_pos_y, enums.bizz[i].bizz_pos_z), { los: true, font: 4, drawDistance: 50 });
    enums.bizz[i].bizz_pickup = mp.markers.new(1, new mp.Vector3(enums.bizz[i].bizz_pos_x, enums.bizz[i].bizz_pos_y, enums.bizz[i].bizz_pos_z - 1.0), 1, { color: [142, 83, 233, 255], dimension: 0 });
    enums.bizz[i].bizz_map_icon = mp.blips.new(enums.bizz[i].bizz_icon, new mp.Vector3(enums.bizz[i].bizz_pos_x, enums.bizz[i].bizz_pos_y, enums.bizz[i].bizz_pos_z), { name: business_type[enums.bizz[i].bizz_type], color: enums.bizz[i].bizz_icon_color, shortRange: true })
    return;
}

async function create_server_business(i: any, level: number, price: number, balance: number, type: any, icon: number, icon_color: number, X: any, Y: any, Z: any, description: string, owner: string, status: boolean, owned: boolean) {

    try {
        if (enums.bizz[i].bizz_price == 0) enums.bizz[i].bizz_3d_text = mp.labels.new(`~p~${description}\n~p~Owner: ~w~${owner}\n~p~Level: ~w~${level}\n~p~Type: ~w~${business_type[type]}`, new mp.Vector3(X, Y, Z), { los: true, font: 4, drawDistance: 50 });
        else enums.bizz[i].bizz_3d_text = mp.labels.new(`~p~${enums.bizz[i].bizz_description}\n~p~Owner: ~w~${owner}\n~p~Level: ~w~${level}\n~p~Type: ~w~${business_type[type]}\n~p~Price: ~w~${formatNumber(price)}\n~w~Type ~p~(/buybiz)~w~ to buy bizz.`, new mp.Vector3(X, Y, Z), { los: true, font: 4, drawDistance: 50 });
        enums.bizz[i].bizz_pickup = mp.markers.new(1, new mp.Vector3(X, Y, Z - 1.0), 1, { color: [142, 83, 233, 255], dimension: 0 });
        enums.bizz[i].bizz_map_icon = mp.blips.new(icon, new mp.Vector3(X, Y, Z), { name: business_type[type], color: icon_color, shortRange: true });

        enums.bizz[i].bizz_level = level;
        enums.bizz[i].bizz_price = price;
        enums.bizz[i].bizz_balance = balance;
        enums.bizz[i].bizz_type = type;
        enums.bizz[i].bizz_icon = icon;
        enums.bizz[i].bizz_icon_color = icon_color;
        enums.bizz[i].bizz_pos_x = X;
        enums.bizz[i].bizz_pos_y = Y;
        enums.bizz[i].bizz_pos_z = Z;

        enums.bizz[i].bizz_description = description;
        enums.bizz[i].bizz_owner = owner;
        enums.bizz[i].bizz_status = status;
        enums.bizz[i].bizz_owned = owned;

        await db.query("insert into business (level, price, balance, type, icon, icon_color, x, y, z, description, owner, status, owned) values (?,?,?,?,?,?,?,?,?,?,?,?,?)", [level, price, balance, type, icon, icon_color, X, Y, Z, description, owner, status, owned]);

    } catch (error) {
        console.log(error);

    }
}

/* --- COMMANDS --- */
command.addCommand({
    name: 'createbiz',
    description: 'Create business on server.',
    aliases: ['createbizz', 'createbusiness'],
    permission: 'Admin',
    permissionValue: 6,
    handler: (player: PlayerMp, _, level, price, type) => {

        if (!level || !price || !type) {

            sendUsage(player, `/createbiz <level> <price> <type>`);
            return SendMsg(player, COLORS.COLOR_SERVER, `Types: !{f9f9f9}(1) Bank | (2) 24/7 | (3) Gun Shop | (4) Gas Station | (5) Rent Car | (6) Rent Bike | (7) Clothing Store`);
        }
        if (type < 1 || type > 7) return sendError(player, "Invalid type busines (1 - 7).");
        if (price < 0 || price > 50000000) return sendError(player, "Invalid price ($0 - $50.000.000)");
        if (level < 1 || level > 500) return sendError(player, "Invalid level (1 - 500).");
        let bizzid = loaded_component_bizz + 1;

        create_server_business(bizzid, level, price, 0, type, icons_business[type], icons_colors_business[type], player.position.x, player.position.y, player.position.z, 'RAGE.RAYED.MP', 'AdmBot', false, false);
        loaded_component_bizz++;
        sendAdmins(COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Admin ${player.name} a creat businessul #${bizzid}[Type: ${business_type[type]}] pe server. (Total business: ${loaded_component_bizz})`);
    }
});
command.addCommand({
    name: 'movebiz',
    description: 'Move this business.',
    aliases: ['movebusiness', 'movebizz'],
    permission: 'Admin',
    permissionValue: 6,
    handler: async (player: PlayerMp, _, bizzid) => {
        if (!bizzid) return sendUsage(player, "/movebiz <bizzid>");
        if (bizzid < 1 || bizzid > loaded_component_bizz) return sendError(player, "Invalid business id.");

        enums.bizz[bizzid-1].bizz_pos_x = player.position.x;
        enums.bizz[bizzid-1].bizz_pos_y = player.position.y;
        enums.bizz[bizzid-1].bizz_pos_z = player.position.z;

        update_business_assets(bizzid-1);
        sendAdmins(COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Admin ${player.name} a mutat businessul #${bizzid} in pozitia sa.`);
        await db.query("update business set x = ?, y = ?, z = ? where id = ?", [enums.bizz[bizzid-1].bizz_pos_x, enums.bizz[bizzid-1].bizz_pos_y, enums.bizz[bizzid-1].bizz_pos_z, enums.bizz[bizzid-1].bizz_id]);
    }
});

command.addCommand({
    name: 'gotobiz',
    description: 'Teleport to business.',
    aliases: ['gotobusiness'],
    permission: 'Admin',
    permissionValue: 1,
    handler: (player: PlayerMp, _, bizzid) => {
        if (!bizzid) return sendUsage(player, "/gotobiz <bizzid>");
        if (bizzid < 1 || bizzid > loaded_component_bizz) return sendError(player, "Invalid business.");
        player.position = new mp.Vector3(enums.bizz[bizzid-1].bizz_pos_x, enums.bizz[bizzid-1].bizz_pos_y, enums.bizz[bizzid-1].bizz_pos_z);
        sendAdmins(COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Admin ${player.name} s-a teleportat la businessul #${bizzid}.`);
    }
});

/* --- EVENTS --- */
mp.events.add("packagesLoaded", async () => {

    await LoadServerBizz();
});