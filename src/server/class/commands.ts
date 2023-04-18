import { sendError } from '@/resources/functions';
import { SHARE } from '@shared/constants';

interface Command_Handler {
	name: string;
	description: string;
	aliases: string[];
	permission?: string;
	permissionValue?: number;
	handler: (player: PlayerMp, ...args: any[]) => void;
	disabled?: boolean;
}

export class CommandManager {
	private readonly commands: Command_Handler[] = [];

	public addCommand(command: Command_Handler): void {
		if (command.permission && isNaN(command.permissionValue as number)) {
			throw new Error(`Invalid permission value for command ${command.name}`);
		}

		this.commands.push(command);

		const permissionCheck = (player: PlayerMp) => {
			return this.checkPermission(player, command);
		};

		const commandHandler = (player: PlayerMp, ...args: any[]) => {
			if (command.disabled) {
				
				if (player.admin < 7) return sendError(player, SHARE.disabledCommandError);
			}

			if (!permissionCheck(player)) {
				return sendError(player, SHARE.accesError);
			}

			command.handler(player, ...args);
		};
		mp.events.addCommand(command.name, commandHandler);
		command.aliases.forEach((alias) => {
			mp.events.addCommand(alias, commandHandler);
		});
	}

	public getCommand(name: string): Command_Handler | undefined {
		return this.commands.find((command) => command.name === name);
	}

	public toggleCommand(name: string, disabled: boolean): boolean {
		const index = this.commands.findIndex((command) => command.name === name);
		if (index === -1) return false;
		const cmd = this.commands[index];
		cmd.disabled = disabled;
		return true;
	}

	private checkPermission(player: PlayerMp, command: Command_Handler): boolean {
		if (!command.permission) return true;

		switch (command.permission) {
			case 'Admin':
				if (!player.admin || player.admin < (command.permissionValue as number)) return false;
				break;
			case 'Helper':
				if (!player.helper || player.helper < (command.permissionValue as number)) return false;
				break;
			
			case 'Staff':
				if (!player.staff) return false;
				break;

			default:
				return true;
		}

		return true;
	}
}
