const ol = require('openlayers');

function getMapProjString() {
    return 'EPSG:3857';
}

module.exports = {
    printCenter: function(c) {
        document.getElementById('center').innerHTML = 'Long/Lat: ' + c;
    },
    printMouse: function(p) {
        document.getElementById('mouse').innerHTML = 'Mouse Long/Lat: ' + p;
    },
    printZoom: function(z) {
        document.getElementById('zoom').innerHTML = 'Zoom: ' + z;
    },
    getMapProjString: getMapProjString,
    reverseCoords: function(coords) {
        return [coords[1], coords[0]];
    },
    longLatToMap: function(coords) {
        return ol.proj.transform(coords, 'EPSG:4326', getMapProjString());
    },
    mapToLongLat: function(coords) {
        return ol.proj.transform(coords, getMapProjString(), 'EPSG:4326');
    },
    onClick: function(id, cb) {
        document.getElementById(id).onclick = cb;
    }
}
