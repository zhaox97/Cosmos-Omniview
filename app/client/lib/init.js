'use strict';
// Require Cesium-specific stuff to get it working with Webpack //
window.CESIUM_BASE_URL = './lib/Cesium';
require('./cesium-build/Cesium/Cesium.js');
require('./cesium-build/Cesium/Widgets/widgets.css');
const Cesium = window.Cesium;
// End //

const events = require('./util/events'),
    coords = require('./util/coords'),
    locations = require('../data/locations'),
    ui = require('../ui'),
    ol = require('openlayers'),
    syncMap = require('./map/sync-map');

module.exports = {
    map: map,
    globe: globe
};

function map() {
    const minZoom = 16, maxZoom = 19;
    // O-L Map. "OpenLayers Map"
    let olMap, olMapLayers, olView;
    olMapLayers = {
        osm: new ol.layer.Tile({
            source: new ol.source.OSM(),
            opacity: 1
        }),
        docs: new ol.layer.Image({
            source: new ol.source.ImageCanvas({
                canvasFunction: function(extent, resolution, pixelRatio, size, proj) {
                    return document.createElement('canvas');
                },
                projection: coords.getMapProjString()
            })
        })
    };
    olView = new ol.View({
        center: coords.longLatToMap(locations.adelaide),
        zoom: minZoom,
        minZoom: minZoom,
        maxZoom: maxZoom,
        projection: coords.getMapProjString()
    });
    olMap = new ol.Map({
        layers: [
            olMapLayers.osm
        ],
        view: olView,
        target: ui.mapId
    });
    olMap._omnivents = {};
    olMap._omnilayers = olMapLayers;
    olMap._omnixtent = null;
    olMap._omnidocslayer = null;
    registerMapEvents(olMap, olMapLayers);
    return olMap;
}

function globe() {
    const viewerId = ui.globeId,
        viewer = new Cesium.Viewer(viewerId, {
        imageryProvider: new Cesium.BingMapsImageryProvider({
            url: '//dev.virtualearth.net'
        }),
        animation: false,
        baseLayerPicker: false,
        vrButton: false,
        timeline: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        navigationHelpButton: false,
        sceneModePicker: false,
        selectionIndicator: false,
        clock: null
    });
    viewer.scene.screenSpaceCameraController.inertiaSpin = 0;
    viewer.scene.screenSpaceCameraController.inertiaTranslate = 0;
    viewer.scene.screenSpaceCameraController.inertiaZoom = 0;
    viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100;
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = 1900;
    viewer.goTo = function(loc, duration, olMap) {
        const center = Cesium.Cartesian3.fromDegrees(loc[0], loc[1], 800);
        viewer.camera.flyTo({
            destination: center,
            duration: duration
        });
        setTimeout(function(olMap, globe) {
            syncMap(olMap, globe, false);
        }.bind(null, olMap, viewer), (duration*1000 + 1));
    };
    return viewer;
}

function registerMapEvents(map, mapLayers) {
    events.onClick('toggle_osm', function(e) {
        if (mapLayers.osm.getOpacity() != 0)
            mapLayers.osm.setOpacity(0);
        else
            mapLayers.osm.setOpacity(1);
    });
}
