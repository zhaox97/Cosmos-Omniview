function Ui() {
    this.mapId = 'map';
    this.globeId = 'globe';
    this.mouseTextId = 'mouse';
    this.centerTextId = 'center';
    this.zoomTextId = 'zoom';

    this.printCenter = function(c, id) {
        document.getElementById(id).innerHTML = 'Long/Lat: ' + c;
    }

    this.printZoom = function(z, id) {
        document.getElementById(id).innerHTML = 'Zoom: ' + z;
    }

    this.printMouse = function(p, id) {
        document.getElementById(id).innerHTML = 'Mouse Long/Lat: ' + p;
    }
};

module.exports = new Ui();
