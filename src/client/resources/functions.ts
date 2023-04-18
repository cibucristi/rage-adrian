export function createActor(position: Vector3, model: string, heading: any, dimension: number, title: string = "") {
    const actor: PedMp = mp.peds.new(mp.game.joaat(model), position, heading, dimension);
    mp.labels.new(title, new mp.Vector3(actor.position.x, actor.position.y, actor.position.z + 1.0), { los: false, font: 4, drawDistance: 7.0, color: [255, 255, 255, 185], dimension: 0 });
    return actor;
}

export function isPlayerInRangeOfPoint(player: PlayerMp, point: Vector3, range: number): boolean {
    const playerPos = player.position;
    const distance = getDistanceBetweenPoints(playerPos, point);
    return distance <= range;
}
function getDistanceBetweenPoints(a: Vector3, b: Vector3): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}