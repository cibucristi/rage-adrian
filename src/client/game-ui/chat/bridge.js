const IsValidJSON = (json) => {
    try {
        return JSON.parse(JSON.stringify(json));
    } catch {
        return json;
    }
}

function trigger(eventName, args) { // eslint-disable-line
    try {var handlers = window.EventManager.events[eventName];
        handlers.forEach(handler => handler(IsValidJSON(args)));
    } catch (e) {
        console.log(e);
    }
}