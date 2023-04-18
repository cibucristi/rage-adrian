export default {
    show(player: PlayerMp, system: any, cursor: boolean) { player.call('CREATE:REACT:WEB', [system, cursor]);},
    hide(player: PlayerMp) { player.call('DESTROY:REACT:WEB'); },
    execute(player: PlayerMp, handler: any, data: any) {
        console.log(handler, JSON.stringify(data));
        player.call('EXECUTE:REACT:WEB', [handler, JSON.stringify(data)]);
    }
};