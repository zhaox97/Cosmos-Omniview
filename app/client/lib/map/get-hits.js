'use strict';
const ol = require('openlayers'),
    ui = require('../../ui'),
    log = require('../log'),
    coords = require('../util/coords'),
    timeSlider = require('../time-slider'),
    config = require('../../../../config');

module.exports = getHits;

function getHits(map, socket, force) {
    const newView = map.getView(),
        extent = coords.mapToLongLatExtent(
            newView.calculateExtent(map.getSize())
        );
    // Only requery for hits if the extent has changed, or if we should force it
    if (force || !map._omnixtent || !coords.extentsEqual(extent, map._omnixtent)) {
        const latRange = (extent[3] < extent[1]) ? [extent[3], extent[1]] : [extent[1], extent[3]],
            longRange = (extent[2] < extent[0]) ? [extent[2], extent[0]] : [extent[0], extent[2]];

        map._omnixtent = extent;
        socket.emit('mapmove', {
            bounds: [latRange, longRange],
            time: timeSlider.getESQuery()
        });
    }
}
