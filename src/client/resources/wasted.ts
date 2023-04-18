let death: boolean;

mp.events.add("playerDeath", () => {
    mp.game.cam.shakeGameplayCam("DEATH_FAIL_IN_EFFECT_SHAKE", 2.0);
    mp.game.graphics.transitionFromBlurred(0);
    mp.game.graphics.transitionToBlurred(2000);
    mp.game.graphics.startScreenEffect("DeathFailOut", 0, false);

    death = true;
    setTimeout(() => {
        mp.game.cam.stopGameplayCamShaking(false);
        mp.game.graphics.transitionFromBlurred(0);
        mp.game.graphics.transitionToBlurred(0);
        mp.game.graphics.stopScreenEffect("DeathFailOut");
        death = false;
    }, 5000);
});

mp.events.add("render", () => {
    if (death == true) {
        mp.game.graphics.drawText("WASTED", [0.5, 0.4], {
            font: 7,
            color: [144, 0, 255, 255],
            scale: [2, 2],
            outline: true
        });
    }
});