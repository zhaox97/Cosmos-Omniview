const ol = require('openlayers'),
    cesium = require('./lib/cesium'),
    helpers = require('./lib/helpers'),
    locations = require('./lib/locations');

const defZoom = 11;
let map, globe;

function initMap() {
    let adelaide = helpers.longLatToMap(locations.adelaide),
        melbourne = helpers.longLatToMap(locations.melbourne);

    let layers = {
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

    const labelsOpacity = 0.4,
    view = new ol.View({
        center: adelaide,
        zoom: defZoom,
        minZoom: 3,
        maxZoom: 17,
        projection: helpers.getMapProjString()
    });

    map = new ol.Map({
        layers: [
            layers.default,
            layers.toner,
            layers.osm
        ],
        view: view,
        target: 'map'
    });

    helpers.onClick('to_adelaide', function(e) {
        view.animate({
            center: adelaide,
            duration: 2000,
            zoom: defZoom
        });
    });

    helpers.onClick('to_melbourne', function(e) {
        view.animate({
            center: melbourne,
            zoom: defZoom,
            duration: 2000
        });
    });

    helpers.onClick('toggle_labels', function(e) {
        if (layers.toner.getOpacity() != 0) layers.toner.setOpacity(0);
        else layers.toner.setOpacity(labelsOpacity);
    });

    helpers.onClick('toggle_osm', function(e) {
        if (layers.osm.getOpacity() != 0) {
            layers.default.setOpacity(1);
            layers.toner.setOpacity(labelsOpacity);
            layers.osm.setOpacity(0);
        }
        else {
            layers.default.setOpacity(0);
            layers.toner.setOpacity(0);
            layers.osm.setOpacity(1);
        }
    });

    map.on('moveend', function(e) {
        let newView = map.getView();
        helpers.printZoom(newView.getZoom());
        helpers.printCenter(helpers.mapToLongLat(newView.getCenter()));
    });

    map.on('pointermove', function(e) {
        helpers.printMouse(helpers.mapToLongLat(e.coordinate));
    });
} // initMap

initMap();
