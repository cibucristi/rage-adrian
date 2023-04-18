/* ------ REACT EVENTS ------- */
let reactBrowser: any = null;
let checkpoint = null;


function reactHide() {
    if(reactBrowser === null) return null;
    reactBrowser.destroy();
    mp.gui.cursor.show(false, false);
    reactBrowser = null;
    return;
}


/* ------ REACT EVENTS ------- */
mp.events.add('EXECUTE:REACT:WEB', (handler, data) => {
    if(reactBrowser === null) return null;
    try { reactBrowser.execute(`trigger('${handler}', ${data});`);} catch(e: any) {mp.console.logInfo(e, true, true);}
    return;
});
mp.events.add('DESTROY:REACT:WEB', () => reactHide());
mp.events.add('CREATE:REACT:WEB', (system, cursor = false) => {
    if(reactBrowser !== null) reactHide();
    reactBrowser = mp.browsers.new("package://react/index.html");
    reactBrowser.execute(`trigger('reactLoadSystem', {system: '${system}'})`);
    if(cursor) mp.gui.cursor.show(true, true);
});