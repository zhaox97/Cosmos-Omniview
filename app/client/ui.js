'use strict';
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function truncate(x, len) {
    if (x instanceof Array) {
        x = x.map(function(el) {
            if (isNumber(el)) return el.toFixed(len);
            return el;
        });
    }
    else if (isNumber(x)) {
        x = x.toFixed(len);
    }
    return x;
}

function Ui() {
    this.mapId = 'map';
    this.globeId = 'globe';
    this.mouseTextId = 'mouse';
    this.centerTextId = 'center';
    this.zoomTextId = 'zoom';
    this.boundsTextId = 'bounds';
    this.hitsTextId = 'hits';
    this.dashboard = 'dashboard';
    this.dashboardButton = 'dashboardToggle';
    this.fullscreenButton = 'fullscreenToggle';
    this.timeCurrent = 'timeCurrent';
    this.timeSlider = 'timeSlider';
    this.timeBoundDropdown = 'timeLimit';
    this.timeOptions = 'timeOptions';

    this.printCenter = function(c, id) {
        document.getElementById(id).innerHTML = 'Long/Lat: ' + truncate(c, 6);
    }

    this.printZoom = function(z, id) {
        let minMax = '';
        if (z == 19) minMax = ' (MAX)';
        else if (z == 16) minMax = ' (MIN)';
        document.getElementById(id).innerHTML = 'Zoom: ' + truncate(z, 2) + minMax;
    }

    this.printMouse = function(p, id) {
        document.getElementById(id).innerHTML = 'Mouse Long/Lat: ' + truncate(p, 6);
    }

    this.printBounds = function(b1, b2, id) {
        document.getElementById(id).innerHTML = 'Map Bounds: ('
            + truncate(b1, 6) + ', ' + truncate(b2, 6) + ')';
    }

    this.printHits = function(numHits, id) {
        document.getElementById(id).innerHTML = 'Hits: ' + numHits;
    }
};

module.exports = new Ui();
