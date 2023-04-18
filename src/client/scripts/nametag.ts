mp.nametags.enabled = false;

const width = 0.03;
const height = 0.0065;
const border = 0.001;

mp.events.add("render", () => {

    mp.players.forEachInRange(mp.players.local.position, 25, (player) => {

        const headPos = player.getBoneCoords(12844, 0, 0, 0); headPos.z += 0.3;
        const screenPos = mp.game.graphics.world3dToScreen2d(headPos);
        if (player.getVariable("logged") == true && player.inInteract == false) {

            mp.game.graphics.drawText(`${player.name} (${player.remoteId})`, [screenPos.x, screenPos.y - 0.07], {
                font: 4,
                color: [255, 255, 255, 255],
                scale: [width * 14, width * 14],
                outline: true
            });
            var health = player.getHealth() / 100;

            mp.game.graphics.drawRect(screenPos.x, screenPos.y - 0.03, width + border * 2, height + border * 2, 0, 0, 0, 200, false);
            mp.game.graphics.drawRect(screenPos.x, screenPos.y - 0.03, width, height, 150, 150, 150, 255, false);
            mp.game.graphics.drawRect(screenPos.x - width / 2 * (1 - health), screenPos.y - 0.03, width * health, height, 255, 0, 0, 200, false);
        }
    })
})