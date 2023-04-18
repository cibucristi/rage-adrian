/* --- IMPORT SECTION --- */
import './resources/account';
import './resources/react';
import './resources/vehicles';
import './resources/flymode';
import './resources/events';
import './resources/checkpoints';
import './resources/wasted';
import './resources/safezone';

import './scripts/chat';
import './scripts/dialog';
import './scripts/interface';
import './scripts/drivingSchool';
import './scripts/interact';
import './scripts/nametag';
import './scripts/sanctions';
import './scripts/serverJobs';
import './scripts/inputalert';
import './scripts/interactmenu';
import './scripts/characterCreator';

/* --- VARIABLES --- */
let zoomLevel = 0;

/* --- JOBS --- */
import './scripts/jobs/fisherman';

/* --- EVENTS --- */
mp.events.add('render', () => {
	mp.game.player.setHealthRechargeMultiplier(0.0);
	mp.game.ui.hideHudComponentThisFrame(6);
	mp.game.ui.hideHudComponentThisFrame(7);
	mp.game.ui.hideHudComponentThisFrame(8);
	mp.game.ui.hideHudComponentThisFrame(4);
	mp.game.ui.hideHudComponentThisFrame(9);
	mp.game.ui.hideHudComponentThisFrame(22);
	mp.game.ui.hideHudComponentThisFrame(20);
	mp.game.ui.hideHudComponentThisFrame(3);
	mp.game.ui.hideHudComponentThisFrame(2);

	mp.discord.update('PLAYING ON RAYED.MP', `Players: `);
});

mp.events.add('playerReady', () => {
	mp.game.gxt.set('PM_PAUSE_HDR', 'RAYED.MP');
	mp.game.invoke('0xF314CF4F0211894E', 143, 140, 0, 255, 255);
	mp.game.invoke('0xF314CF4F0211894E', 116, 140, 0, 255, 255);
});

/* --- KEYS --- */

mp.keys.bind(0x5a, true, function () {
	if (mp.players.local.getVariable('logged') == true && mp.players.local.getVariable('opened_menu') == false && mp.players.local.getVariable('chat_active') == true && mp.players.local.getVariable('kicked') == false) {
		if (zoomLevel === 0) {
			mp.game.ui.setRadarBigmapEnabled(true, false);
			mp.game.ui.setRadarZoom(0.0);
			zoomLevel = 1;
		} else {
			mp.game.ui.setRadarBigmapEnabled(false, false);
			mp.game.ui.setRadarZoom(1.0);
			zoomLevel = 0;
		}
	}
});
