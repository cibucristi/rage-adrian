/* --- IMPORT SECTION --- */
import { enums } from "@/resources/structures";
import { Database } from "@/class/database";
import { CommandManager } from "@/class/commands";
import { formatNumber, get_distance_from_point, givePlayerMoney, isPlayerInRangeOfPoint, sendAdmins, sendError, SendMsg, sendUsage } from "@/resources/functions";
import { COLORS, RAGE_CLIENT_EVENTS } from "@shared/constants";

/* --- VARIABLES --- */
let db = new Database();
let command = new CommandManager();
export let loaded_component_jobs: number = 0;

/* --- FUNCTIONS --- */
async function LoadServerJobs() {

    await db.query("select * from jobs", (err: any, result: any) => {

        if (err) return console.log(err);
        if (result.length !== 0) {

            for (let i = 0; i < result.length; i++) {

                enums.jobs[i].job_id = i + 1;
                enums.jobs[i].job_level = result[i].level;
                enums.jobs[i].job_icon = result[i].icon;
                enums.jobs[i].job_icon_color = result[i].icon_color;
                enums.jobs[i].job_have_work = result[i].have_work;
                enums.jobs[i].job_status = result[i].status;
                enums.jobs[i].job_owned = result[i].owned;
                enums.jobs[i].job_balance = result[i].balance;

                enums.jobs[i].job_max_money = result[i].max_money;

                enums.jobs[i].job_name = result[i].name;
                enums.jobs[i].job_owner = result[i].owner;
                enums.jobs[i].job_description = result[i].description;

                enums.jobs[i].job_pos_x = result[i].x;
                enums.jobs[i].job_pos_y = result[i].y;
                enums.jobs[i].job_pos_z = result[i].z;

                enums.jobs[i].job_max_money = {
                    skill1: result[i].max_money_skill1,
                    skill2: result[i].max_money_skill2,
                    skill3: result[i].max_money_skill3,
                    skill4: result[i].max_money_skill4,
                    skill5: result[i].max_money_skill5
                };
                enums.jobs[i].job_min_money = {
                    skill1: result[i].min_money_skill1,
                    skill2: result[i].min_money_skill2,
                    skill3: result[i].min_money_skill3,
                    skill4: result[i].min_money_skill4,
                    skill5: result[i].min_money_skill5
                };

                /* --- WORK --- */
                enums.jobs[i].job_work_name = result[i].work_name;
                enums.jobs[i].job_work_pos_x = result[i].work_pos_x;
                enums.jobs[i].job_work_pos_y = result[i].work_pos_y;
                enums.jobs[i].job_work_pos_z = result[i].work_pos_z;

                enums.jobs[i].job_3d_text = mp.labels.new(`~p~Job Name: ~w~${result[i].name}\n~p~Owner: ~w~${result[i].owner}\n~p~Level: ~w~${result[i].level}\nPress ~p~Y~w~ to get the job.\nPress ~p~N~w~ to quit the job.${result[i].status == false ? "" : "\n~r~(Inactive)"}`, new mp.Vector3(result[i].x, result[i].y, result[i].z), { los: true, font: 4, drawDistance: 50 });
                enums.jobs[i].job_pickup = mp.markers.new(35, new mp.Vector3(result[i].x, result[i].y, result[i].z), 1, { color: [142, 83, 233, 255], dimension: 0 });
                enums.jobs[i].job_map_icon = mp.blips.new(enums.jobs[i].job_icon, new mp.Vector3(result[i].x, result[i].y, result[i].z), { name: result[i].name, color: result[i].icon_color, shortRange: true });

                if (enums.jobs[i].job_have_work == true) {

                    enums.jobs[i].job_work_3d_text = mp.labels.new(`~p~(Work ${result[i].name})~w~\n${result[i].work_name}`, new mp.Vector3(result[i].work_pos_x, result[i].work_pos_y, result[i].work_pos_z), { los: false, font: 4, drawDistance: 10, dimension: 0 });
                    enums.jobs[i].job_work_pickup = mp.markers.new(1, new mp.Vector3(result[i].work_pos_x, result[i].work_pos_y, result[i].work_pos_z - 1.0), 1, { color: [142, 83, 233, 255], dimension: 0 });
                }
            }
            loaded_component_jobs++;
        }
        console.log(`[MYSQL]: Loaded jobs: ${loaded_component_jobs}`);
    });
}
export const giveJobSalary = async (player: PlayerMp, jobid: any, skill: any) => {

    let salary: number;
    let total: number;

    if (jobid == 0) salary = player.fish_price;
    else {
        const minSalary = parseFloat(enums.jobs[jobid].job_min_money[skill]);
        const maxSalary = parseFloat(enums.jobs[jobid].job_max_money[skill]);
        salary = minSalary + Math.floor(Math.random() * (maxSalary - minSalary));
    }

    total = salary;

    const balance = (total * 20 / 100);
    enums.jobs[jobid].job_balance += balance;

    SendMsg(player, COLORS.COLOR_SERVER, `($) Job Salary:`);
    SendMsg(player, COLORS.COLOR_SERVER, `- !{f9f9f9}Job Name: ${enums.jobs[jobid].job_name}`);
    SendMsg(player, COLORS.COLOR_SERVER, `- !{f9f9f9}Received: !{078f0e}$${formatNumber(salary)}`);
    SendMsg(player, COLORS.COLOR_SERVER, `- !{f9f9f9}Total: !{078f0e}$${formatNumber(total)}`);

    player.times[jobid]++;
    if (player.skill[jobid] < 5 && player.times[jobid] >= get_job_times(player, jobid)) {
        player.skill[jobid]++;
        SendMsg(player, COLORS.COLOR_SERVER, `Jobs: !{f9f9f9}Felicitari! Ai avansat la skill ${player.skill[jobid]} pentru jobul ${enums.jobs[jobid].job_name}.`);
    }

    givePlayerMoney(player, 'give', salary);
    updatePlayerJobAssets(player);
    await db.query("update jobs set balance = ? where name = ?", [balance, enums.jobs[jobid].job_name]);
    return true;
}

async function updatePlayerJobAssets(player: PlayerMp) {
    const skillValues = player.skill.join("|");
    const timesValues = player.times.join("|");
    await db.query("update accounts set skill = ?, times = ? where username = ?", [skillValues, timesValues, player.name]);
    return;
}

function get_job_times(player: PlayerMp, jobid: number): number {

    let times = 0;
    switch (jobid) {

        case 0: {

            switch (player.skill[jobid]) {

                case 1: times = 50; break;
                case 2: times = 100; break;
                case 3: times = 150; break;
                case 4: times = 200; break;
                case 5: times = 250; break;
            }
        }
    }
    return times;
}

/* --- COMMANDS --- */
command.addCommand({
    name: 'statusjob',
    description: 'Set status job.',
    aliases: [],
    permission: 'Admin',
    permissionValue: 6,
    handler: async (player: PlayerMp, _, job_id: any, status: boolean) => {

        if (!job_id || !status) return sendUsage(player, "/statusjob <job id> <job status (0 = Active | 1 = Inactive)>");
        const jobid = parseInt(job_id);
        if (jobid < 1 || jobid > loaded_component_jobs) return sendError(player, "Invalid job id.");
        enums.jobs[jobid - 1].job_status = status;
        db.query("update jobs set status = ? where name = ?", [status, enums.jobs[jobid - 1].job_name]);
        sendAdmins(COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Admin ${player.name} a pus jobul ${enums.jobs[jobid - 1].job_name} pe statusul ${status == true ? "inactive" : "active"}`);
        enums.jobs[jobid - 1].job_3d_text.text = `~p~Job Name: ~w~${enums.jobs[jobid - 1].job_name}\n~p~Owner: ~w~${enums.jobs[jobid - 1].job_owner}\n~p~Level: ~w~${enums.jobs[jobid - 1].job_level}\nPress ~p~Y~w~ to get the job.\nPress ~p~N~w~ to quit the job.${status == true ? "\n~r~(Inactive)" : ""}`;
    }
});

command.addCommand({
    name: 'startwork',
    description: 'Start work this job.',
    aliases: ['work'],
    handler: (player: PlayerMp) => {

        if (player.job == 0) return sendError(player, "Nu ai un job.");
        if (player.in_work == true) return sendError(player, "Ai inceput deja sa muncesti.");
        if (player.getVariable("checkpoint_status") == true) return sendError(player, "Ai un checkpoint activ, foloseste comanda /killcp.");
        if (player.job == 1) return sendError(player, "Pentru acest job ai la dispozitie comanda /fish.");
        if (!isPlayerInRangeOfPoint(player, new mp.Vector3(enums.jobs[player.job - 1].job_work_pos_x, enums.jobs[player.job - 1].job_work_pos_y, enums.jobs[player.job - 1].job_work_pos_z), 20.0)) {
            sendError(player, 'Nu esti la locul unde poti incepe munca.');
            player.call(RAGE_CLIENT_EVENTS.SET_CLIENT_CHECKPOINT, [1, 1, new mp.Vector3(enums.jobs[player.job - 1].job_work_pos_x, enums.jobs[player.job - 1].job_work_pos_y, enums.jobs[player.job - 1].job_work_pos_z), new mp.Vector3(0, 0, 0), 5, true, 0]);
            return true;
        }
        if (enums.jobs[player.job - 1].job_status == false) return sendError(player, "Momentan acest job a fost dezactivat.");
    }
});

command.addCommand({
    name: 'jobmoney',
    description: 'Set job economy.',
    aliases: ['setjobmoney'],
    permission: 'Admin',
    permissionValue: 6,
    handler: async (player: PlayerMp, _, jobid, skill, min, max) => {

        if (!jobid || !skill || !min || !max) return sendUsage(player, "/jobmoney <jobid> <skill (1 - 5)> <min money> <max money>");
        if (jobid < 1 || jobid > loaded_component_jobs) return sendError(player, "Invalid job id.");
        if (skill < 1 || skill > 5) return sendError(player, "Invalid skill.");

        enums.jobs[jobid - 1].job_min_money[skill] = min;
        enums.jobs[jobid - 1].job_max_money[skill] = max;

        sendAdmins(COLORS.COLOR_SERVER, `Notice: !{f9f9f9}Admin ${player.name} a modificat pretul pentru jobul ${enums.jobs[jobid - 1].job_name}[Min: $${formatNumber(enums.jobs[jobid - 1].job_min_money[skill])} | Max: $${formatNumber(enums.jobs[jobid - 1].job_max_money[skill])}]`);

        for (let i = 1; i < 5; i++) await db.query(`update jobs set max_money_skill${i} = ?, min_money_skill${i} = ? where name = ?`, [enums.jobs[jobid - 1].job_max_money[i], enums.jobs[jobid - 1].job_min_money[i], enums.jobs[jobid - 1].job_name]);
    }
});

command.addCommand({
    name: 'jobs',
    description: 'Show job menu.',
    aliases: [],
    handler: (player: PlayerMp) => {

        if (player.getVariable("checkpoint_status")) return sendError(player, "Ai un checkpoint activ.");
        for (let i = 0; i < loaded_component_jobs; i++) {
            const distance = get_distance_from_point(player, enums.jobs[i].job_pos_x, enums.jobs[i].job_pos_y, enums.jobs[i].job_pos_z);
            player.call(RAGE_CLIENT_EVENTS.SHOW_CLIENT_JOB_MENU, [enums.jobs[i].job_id, enums.jobs[i].job_name, distance, enums.jobs[i].job_owner, enums.jobs[i].job_level, (player.admin > 0) ? true : false]);
        }
    }
});

command.addCommand({
    name: 'skills',
    description: 'View your skill jobs.',
    aliases: [],
    handler: (player: PlayerMp) => {

        SendMsg(player, 'f9f9f9', `------------- !{${COLORS.COLOR_SERVER}}Your Jobs Skill!{f9f9f9} -------------`);
        for (let i = 0; i < loaded_component_jobs; i++) SendMsg(player, 'f9f9f9', `[${i + 1}] ${enums.jobs[i].job_name} Skill: ${player.skill[i]}/5 | Worked Times: ${player.times[i]}/${get_job_times(player, i)}`);
    }
});

/* --- EVENTS --- */
mp.events.add("packagesLoaded", async () => {

    await LoadServerJobs();
});