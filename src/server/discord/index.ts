import Discord from 'discord.js';

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`[DISCORD]: Logged in as ${client.user?.tag}!`);
    client.user?.setPresence({
        status: 'online',
        activity: {
            name: 'RAGE.ELYSE.MP',
            type: 'WATCHING'
        }
    });
});

client.login('MTA3NTg1ODY4NzQwNDU0ODE3Ng.GkiMZo.NK1velsh3kZgJfB7yA_Y4K1__cKLyvnaMJmPeI');
