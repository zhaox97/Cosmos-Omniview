const defaultMapZoom = 11;

const events = require('./events'),
    coords = require('./coords'),
    locations = require('./locations'),
    ui = require('./ui'),
    ol = require('openlayers');

module.exports = {
    map: map,
    globe: globe
};

function map() {
    let adelaide = coords.longLatToMap(locations.adelaide);

    let mapLayers = {
        default: new ol.layer.Tile({
            source: new ol.source.Stamen({
                layer: 'terrain-background'
            })
        }),
        toner: new ol.layer.Tile({
            source: new ol.source.Stamen({
                layer: 'toner'
            }),
            opacity: 0.4
        }),
        osm: new ol.layer.Tile({
            source: new ol.source.OSM(),
            opacity: 0
        })
    };

    let view = new ol.View({
        center: adelaide,
        zoom: defaultMapZoom,
        minZoom: 17,
        maxZoom: 17,
        projection: coords.getMapProjString()
    });

    // O-L Map. "OpenLayers Map"
    let olMap = new ol.Map({
        layers: [
            mapLayers.default,
            mapLayers.toner,
            mapLayers.osm
        ],
        view: view,
        target: ui.mapId
    });

    registerMapEvents(olMap, mapLayers);
    return olMap;
}

function registerMapEvents(map, mapLayers) {
    const adelaide2 = coords.longLatToMap(locations.adelaide2),
        melbourne = coords.longLatToMap(locations.melbourne),
        view = map.getView();
        
    events.onClick('to_adelaide', function(e) {
        view.animate({
            center: adelaide2,
            duration: 2000,
            zoom: defaultMapZoom
        });
    });

    events.onClick('to_melbourne', function(e) {
        view.animate({
            center: melbourne,
            zoom: defaultMapZoom,
            duration: 2000
        });
    });

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

    map.on('movestart', function(e) {
        console.log('Mouse moving on map.');
    });

    map.on('moveend', function(e) {
        let newView = map.getView();
        ui.printZoom(newView.getZoom(), ui.zoomTextId);
        ui.printCenter(coords.mapToLongLat(newView.getCenter()), ui.centerTextId);
    });

    map.on('pointermove', function(e) {
        ui.printMouse(coords.mapToLongLat(e.coordinate), ui.mouseTextId);
    });

    map.getViewport().onmouseout = function(e) {
        ui.printMouse('NOT IN MAP', ui.mouseTextId);
    };
}
