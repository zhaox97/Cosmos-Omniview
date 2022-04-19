'use strict';
// Read the _omnivents prop
const executor = function(eventName, event) {
    let listenerFunc;
    for (let i = 0; i < this._omnivents[eventName].length; i++) {
        listenerFunc = this._omnivents[eventName][i];
        listenerFunc.call(this, event);
    }
}

module.exports = {
    onClick: function(id, cb) {
        document.getElementById(id).onclick = cb;
    },
    onMouseover: function(id, cb) {
        document.getElementById(id).addEventListener('mouseover', cb);
    },
    onMouseout: function(id, cb) {
        document.getElementById(id).addEventListener('mouseout', cb);
    },
    map: {
        register: function(eventName, olMap, f) {
            if (!olMap._omnivents[eventName]) {
                console.log('No omniview event chain named "' + eventName
                    + '" exists. Creating.');
                olMap._omnivents[eventName] = [];
            }

            olMap._omnivents[eventName].push(f);
            if (eventName === 'mouseout') {
                olMap.getViewport().onmouseout = executor.bind(olMap, eventName);
            }
            else {
                olMap.on(eventName, executor.bind(olMap, eventName));
            }
        },
        unregister: function(eventName, olMap) {
            if (!olMap._omnivents[eventName]) {
                console.log('Attempted to unregister event chain, but none was regisered.');
                return;
            }
            olMap._omnivents[eventName] = [];
        }
    }
}
