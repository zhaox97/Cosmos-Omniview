const ol = require('openlayers');

// The default map projection string.
function getMapDefaultProjString() {
    return 'EPSG:4326';
}

// The map projection string; Mercator.
function getMapProjString() {
    return 'EPSG:3857';
}

module.exports = {
    getMapProjString: getMapProjString,
    reverseCoords: function(coords) {
        return [coords[1], coords[0]];
    },
    longLatToMap: function(coords) {
        return ol.proj.transform(
            coords,
            getMapDefaultProjString(),
            getMapProjString()
        );
    },
    mapToLongLat: function(coords) {
        return ol.proj.transform(
            coords,
            getMapProjString(),
            getMapDefaultProjString()
        );
    },
    radToDeg: function(rad) {
        return rad * (180 / 3.141592653);
    }
};
