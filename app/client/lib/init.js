'use strict';
// Require Cesium-specific stuff to get it working with Webpack //
window.CESIUM_BASE_URL = './lib/Cesium';
require('./cesium-build/Cesium/Cesium.js');
require('./cesium-build/Cesium/Widgets/widgets.css');
const Cesium = window.Cesium;
// End //

const events = require('./events'),
    coords = require('./coords'),
    locations = require('../data/locations'),
    ui = require('./ui'),
    es = require('./es'),
    ol = require('openlayers');

module.exports = {
    map: map,
    globe: globe
};

function map() {
    const minZoom = 16, maxZoom = 19;
    // O-L Map. "OpenLayers Map"
    let olMap, olMapLayers, olView;
    olMapLayers = {
        default: new ol.layer.Tile({
            source: new ol.source.Stamen({
                layer: 'terrain-background'
            }),
            opacity: 0
        }),
        toner: new ol.layer.Tile({
            source: new ol.source.Stamen({
                layer: 'toner'
            }),
            opacity: 0
        }),
        osm: new ol.layer.Tile({
            source: new ol.source.OSM(),
            opacity: 1
        })
    };
    view = new ol.View({
        center: coords.longLatToMap(locations.adelaide),
        zoom: minZoom,
        minZoom: minZoom,
        maxZoom: maxZoom,
        projection: coords.getMapProjString()
    });
    olMap = new ol.Map({
        layers: [
            olMapLayers.default,
            olMapLayers.toner,
            olMapLayers.osm
        ],
        view: view,
        target: ui.mapId
    });
    olMap._omnivents = {};
    olMap._omnilayers = olMapLayers;
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
    viewer.scene.screenSpaceCameraController.minimumZoomDistance = 120;
    viewer.scene.screenSpaceCameraController.maximumZoomDistance = 2100;
    let center = Cesium.Cartesian3.fromDegrees(locations.adelaide[0], locations.adelaide[1], 800);
    viewer.camera.flyTo({
        destination: center,
        duration: 0
    });
    return viewer;
}

function registerMapEvents(map, mapLayers) {
    const labelsOpacity = 0.4;
    events.onClick('toggle_labels', function(e) {
        if (mapLayers.toner.getOpacity() != 0) mapLayers.toner.setOpacity(0);
        else mapLayers.toner.setOpacity(labelsOpacity);
    });

    events.onClick('toggle_osm', function(e) {
        if (mapLayers.osm.getOpacity() != 0) {
            mapLayers.default.setOpacity(1);
            mapLayers.toner.setOpacity(labelsOpacity);
            mapLayers.osm.setOpacity(0);
        }
        else {
            mapLayers.default.setOpacity(0);
            mapLayers.toner.setOpacity(0);
            mapLayers.osm.setOpacity(1);
        }
    });
}
