/* ---- IMPORT SECTION ---- */
import { sendStaff, sendUsage } from "@/resources/functions";
import { COLORS } from "@shared/constants";
import { CommandManager } from "@/class/commands";

const command = new CommandManager();

/* ---- VARIABLES ---- */


/* ---- COMMANDS ---- */
command.addCommand({
    name: 'hc',
    description: 'Helper chat.',
    aliases: ['helperchat'],
    permission: 'Staff',
    permissionValue: 0,
    handler: (player: PlayerMp, text: string) => {
        if (!text) return sendUsage(player, "/hc <text>");
        sendStaff(COLORS.COLOR_HELPERCHAT, `${player.admin ? "Admin" : "Helper"} Level (${player.admin ? player.admin : player.helper}) | ${player.name}: ${text}`);
    }
});