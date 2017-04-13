'use strict';
// Require Cesium-specific stuff to get it working with Webpack //
window.CESIUM_BASE_URL = './lib/Cesium';
require('./lib/cesium-build/Cesium/Cesium.js');
require('./lib/cesium-build/Cesium/Widgets/widgets.css');
const Cesium = window.Cesium;
// End //
//
const init = require('./lib/init'),
    events = require('./lib/events'),
    coords = require('./lib/coords'),
    ui = require('./lib/ui'),
    es = require('./lib/es'),   // Elastic search (es)
    ol = require('openlayers'),
    io = require('socket.io-client'),
    log = require('./lib/log'),
    locations = require('./data/locations');

let socket = io.connect('http://localhost:8080');
socket.on('overload', function(msg) {
    alert(msg);
});

const zero = coords.longLatToMap(locations.zero),
    melbourne = coords.longLatToMap(locations.melbourne),
    adelaide = coords.longLatToMap(locations.adelaide),
    adelaide2 = coords.longLatToMap(locations.adelaide2),
    washingtondc = coords.longLatToMap(locations.washingtondc);

let syncInterval, hitsInterval, mapExtent, map, globe;
map = init.map();
globe = init.globe();

ui.printHits('Initializing...', ui.hitsTextId);
ui.printBounds('MOVE THE DRONE VIEW', '', ui.boundsTextId);
ui.printMouse('NOT IN MAP', ui.mouseTextId);

function mapSync() {
    const rect = globe.camera.computeViewRectangle(),
        b1 = [coords.radToDeg(rect.west), coords.radToDeg(rect.south)],
        b2 = [coords.radToDeg(rect.east), coords.radToDeg(rect.north)],
        extent = ol.extent.boundingExtent([
            b1,
            b2
        ]);
    map.getView().fit(
        ol.proj.transformExtent(
            extent,
            coords.getMapDefaultProjString(),
            coords.getMapProjString()
        )
    );
    ui.printBounds(b1, b2, ui.boundsTextId);
}

function getHits() {
    const newView = map.getView(),
        center = newView.getCenter(),
        zoom = newView.getZoom(),
        extent = coords.mapToLongLatExtent(
            newView.calculateExtent(map.getSize())
        );

    ui.printZoom(zoom, ui.zoomTextId);
    ui.printCenter(coords.mapToLongLat(center), ui.centerTextId);

    if (!mapExtent || !coords.extentsEqual(extent, mapExtent)) {
        const latRange = (extent[3] < extent[1]) ? [extent[3], extent[1]] : [extent[1], extent[3]],
            longRange = (extent[2] < extent[0]) ? [extent[2], extent[0]] : [extent[0], extent[2]];
        mapExtent = extent;
        socket.emit('mapmove', [latRange, longRange]);
        es.search({
            index: 'test_index',
            body: {
                size: 50,
                query: {
                    range: {
                        latt: {
                            gte: latRange[0],
                            lte: latRange[1]
                        },
                        longt: {
                            gte: longRange[0],
                            lte: longRange[1]
                        }
                    }
                }
            }
        }, function(err, resp) {
            if (err) {
                log('ERROR');
                log(err);
                ui.printHits('<b style="color: red;">ELASTICSEARCH ERROR</b>', ui.hitsTextId);
            }
            else {
                log(resp.hits.total + ' hits.');
                ui.printHits(resp.hits.total, ui.hitsTextId);
            }
        });
    }
}

events.map.register('pointermove', map, function(event) {
    log('"pointermove" EVENT EMITTED.');
    ui.printMouse(coords.mapToLongLat(event.coordinate), ui.mouseTextId);
});

events.map.register('movestart', map, function(event) {
    if (hitsInterval) {
        clearInterval(hitsInterval);
        hitsInterval = 0;
    }
});

events.map.register('moveend', map, function(event) {
    if (!hitsInterval) hitsInterval = setInterval(getHits, 500);
});

events.map.register('mouseout', map, function(event) {
    ui.printMouse('NOT IN MAP', ui.mouseTextId);
});

events.map.register('movestart', map, function(event) {
    log('"movestart" EVENT EMITTED.');
});

events.onClick('to_adelaide', function() {
    map.getView().animate({
        center: adelaide2,
        duration: 2000,
        zoom: 17
    });
});

events.onClick('to_melbourne', function() {
    map.getView().animate({
        center: melbourne,
        zoom: 17,
        duration: 2000
    });
});

events.onClick('to_washingtondc', function() {
    map.getView().animate({
        center: washingtondc,
        zoom: 17,
        duration: 2000
    });
});

events.onClick('to_zero', function() {
    map.getView().animate({
        center: zero,
        zoom: 17,
        duration: 2000
    });
});

events.onMouseover(ui.globeId, function() {
    if (!syncInterval) syncInterval = setInterval(mapSync, 5);
});

events.onMouseout(ui.globeId, function() {
    clearInterval(syncInterval);
    syncInterval = 0;
});

log('Omniview initialized.');
