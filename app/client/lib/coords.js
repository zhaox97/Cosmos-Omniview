'use strict';
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
    getMapDefaultProjString: getMapDefaultProjString,
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
    mapToLongLatExtent: function(extent) {
        return ol.proj.transformExtent(
            extent,
            getMapProjString(),
            getMapDefaultProjString()
        );
    },
    radToDeg: function(rad) {
        return rad * (180 / 3.141592653);
    },
    extentsEqual: function(ext1, ext2) {
        return ext1[0] == ext2[0] && ext1[1] == ext2[1] &&
            ext1[2] == ext2[2] && ext1[3] == ext2[3];
    }
};
