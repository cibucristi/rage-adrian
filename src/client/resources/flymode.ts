import { RAGE_CLIENT_EVENTS, RAGE_GENERAL_EVENTS } from "@shared/constants";

const controlsIds: { [key: string]: number } = {
    F5: 327,
    W: 32,
    S: 33,
    A: 34,
    D: 35,
    Space: 321,
    LCtrl: 326
};

interface Fly {
    flying: boolean;
    f: number;
    w: number;
    h: number;
    point_distance: number;
}

let coords: any = null;
let direction: any = null;

let fly: Fly = { flying: false, f: 2.0, w: 2.0, h: 2.0, point_distance: 1000 };
let gameplayCam: any = mp.cameras.new("gameplay");

mp.events.add(RAGE_CLIENT_EVENTS.START_CLIENT_FLYMODE, (player: any) => {
    fly.flying = !fly.flying;

    let controls = mp.game.controls;

    player.setInvincible(fly.flying);
    player.freezePosition(fly.flying);
    player.setAlpha(fly.flying ? 0 : 255);

    if (!fly.flying && !controls.isControlPressed(0, controlsIds.Space)) {
        let position = mp.players.local.position;
        position.z = mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, position.z, false, false);
        mp.players.local.setCoordsNoOffset(position.x, position.y, position.z, false, false, false);
    }
    mp.game.graphics.notify(fly.flying ? "~p~[ADMIN]:~w~ Flymode activat." : "~p~[ADMIN]:~w~ Flymode dezactivat.");
});

mp.events.add("render", () => {
    let controls = mp.game.controls;
    direction = gameplayCam.getDirection();
    coords = gameplayCam.getCoord();

    if (fly.flying) {
        let updated = false;
        let position = mp.players.local.position;

        if (controls.isControlPressed(0, controlsIds.W)) {
            if (fly.f < 8.0)
                fly.f *= 1.025;

            position.x += direction.x * fly.f;
            position.y += direction.y * fly.f;
            position.z += direction.z * fly.f;
            updated = true;
        }
        else if (controls.isControlPressed(0, controlsIds.S)) {
            if (fly.f < 8.0)
                fly.f *= 1.025;

            position.x -= direction.x * fly.f;
            position.y -= direction.y * fly.f;
            position.z -= direction.z * fly.f;
            updated = true;
        }
        else {
            fly.f = 2.0;
        }

        if (controls.isControlPressed(0, controlsIds.A)) {
            if (fly.w < 8.0)
                fly.w *= 1.025;

            position.x += (-direction.y) * fly.w;
            position.y += direction.x * fly.w;
            updated = true;
        }
        else if (controls.isControlPressed(0, controlsIds.D)) {
            if (fly.w < 8.0) fly.w *= 1.05;

            position.x -= (-direction.y) * fly.w;
            position.y -= direction.x * fly.w;
            updated = true;
        }
        else {
            fly.w = 2.0;
        }

        if (controls.isControlPressed(0, controlsIds.Space)) {
            if (fly.h < 8.0)
                fly.h *= 1.025;

            position.z += fly.h;
            updated = true;
        }
        else if (controls.isControlPressed(0, controlsIds.LCtrl)) {
            if (fly.h < 8.0)
                fly.h *= 1.05;

            position.z -= fly.h;
            updated = true;
        }
        else {
            fly.h = 2.0;
        }

        if (updated) {
            mp.players.local.setCoordsNoOffset(position.x, position.y, position.z, false, false, false);
        }
    }
});

/* ---- SAVE CAMERA ---- */

function pointingAt(distance: any) {
    const farAway = new mp.Vector3((direction.x * distance) + (coords.x), (direction.y * distance) + (coords.y), (direction.z * distance) + (coords.z));

    const result = mp.raycasting.testPointToPoint(coords, farAway);
    if (result === undefined) {
        return 'undefined';
    }
    return result;
}
mp.events.add('client::getCamCoords', (name) => {
    mp.events.callRemote(RAGE_GENERAL_EVENTS.SAVE_SERVER_CAM_COORDS, JSON.stringify(coords), JSON.stringify(pointingAt(fly.point_distance)), name);
});