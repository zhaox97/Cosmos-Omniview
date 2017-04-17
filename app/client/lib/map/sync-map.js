'use strict';
const ui = require('../../ui'),
    coords = require('../util/coords'),
    ol = require('openlayers');

module.exports = syncMap;

function syncMap(map, globe, snap) {
    const rect = globe.camera.computeViewRectangle(),
        lowerBound = [coords.radToDeg(rect.west), coords.radToDeg(rect.south)],
        upperBound = [coords.radToDeg(rect.east), coords.radToDeg(rect.north)],
        extent = ol.extent.boundingExtent([
            lowerBound,
            upperBound
        ]),
        projectedExtent = ol.proj.transformExtent(
            extent,
            coords.getMapDefaultProjString(),
            coords.getMapProjString()
        );
    const newView = map.getView(),
        center = newView.getCenter(),
        zoom = newView.getZoom();
    map.getView().fit(
        projectedExtent,
        {
            constrainResolution: true,
            duration: snap ? 1500 : 0
        }
    );
    ui.printZoom(zoom, ui.zoomTextId);
    ui.printCenter(coords.mapToLongLat(center), ui.centerTextId);
    ui.printBounds(lowerBound, upperBound, ui.boundsTextId);
}
