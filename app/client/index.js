'use strict';
// Require Cesium-specific stuff to get it working with Webpack //
window.CESIUM_BASE_URL = './lib/Cesium';
require('./lib/cesium-build/Cesium/Cesium.js');
require('./lib/cesium-build/Cesium/Widgets/widgets.css');
const Cesium = window.Cesium;
// End //

// Jquery is able to be used in this code; it is loaded in index.html //
const init = require('./lib/init'),
    events = require('./lib/util/events'),
    coords = require('./lib/util/coords'),
    ui = require('./ui'),
    ol = require('openlayers'),
    io = require('socket.io-client'),
    log = require('./lib/log'),
    getHits = require('./lib/map/get-hits'),
    syncMap = require('./lib/map/sync-map'),
    toggleFullscreen = require('./lib/map/toggle-fullscreen'),
    timeSlider = require('./lib/time-slider'),
    getDocsLayer = require('./lib/map/get-docs-layer'),
    locations = require('./data/locations'),
    config = require('../../config');

const zero = coords.longLatToMap(locations.zero),
    melbourne = coords.longLatToMap(locations.melbourne),
    adelaide = coords.longLatToMap(locations.adelaide),
    adelaide2 = coords.longLatToMap(locations.adelaide2),
    washingtondc = coords.longLatToMap(locations.washingtondc);

let syncInterval, hitsInterval, map, globe;
map = init.map();
globe = init.globe();

globe.goTo(locations.adelaide, 0, map);

ui.printHits('Initializing...', ui.hitsTextId);
ui.printBounds('MOVE THE DRONE VIEW', '', ui.boundsTextId);
ui.printMouse('NOT IN MAP', ui.mouseTextId);

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
    if (!hitsInterval) {
        log('Map move ended. Searching for relevant documents...');
        hitsInterval = setInterval(getHits.bind(null, map, socket, false), 500);
    }
});

events.map.register('mouseout', map, function(event) {
    ui.printMouse('NOT IN MAP', ui.mouseTextId);
});

events.map.register('movestart', map, function(event) {
    log('"movestart" EVENT EMITTED.');
});

events.onClick('to_adelaide', function() {
    globe.goTo(locations.adelaide2, 4.0, map);
});

events.onClick('to_washingtondc', function() {
    globe.goTo(locations.washingtondc, 4.0, map);
});

events.onClick('to_1', function() {
    globe.goTo(locations.scenario1, 4.0, map);
});

events.onClick('to_2', function() {
    globe.goTo(locations.scenario2, 4.0, map);
});

events.onClick('to_3', function() {
    globe.goTo(locations.scenario3, 4.0, map);
});

events.onClick('to_4', function() {
    globe.goTo(locations.scenario4, 4.0, map);
});

events.onClick('to_5', function() {
    globe.goTo(locations.scenario5, 4.0, map);
});

events.onClick('to_6', function() {
    globe.goTo(locations.scenario6, 4.0, map);
});

events.onClick('to_7', function() {
    globe.goTo(locations.scenario7, 4.0, map);
});

events.onClick('to_8', function() {
    globe.goTo(locations.scenario8, 4.0, map);
});

events.onClick('to_9', function() {
    globe.goTo(locations.scenario9, 4.0, map);
});

events.onClick('to_10', function() {
    globe.goTo(locations.scenario10, 4.0, map);
});

events.onClick('to_11', function() {
    globe.goTo(locations.scenario11, 4.0, map);
});

events.onClick('to_12', function() {
    globe.goTo(locations.scenario12, 4.0, map);
});

events.onClick('to_13', function() {
    globe.goTo(locations.scenario13, 4.0, map);
});

events.onClick('to_14', function() {
    globe.goTo(locations.scenario14, 4.0, map);
});

events.onClick(ui.dashboardButton, function() {
    let dashboard = document.getElementById(ui.dashboard);
    dashboard.classList.toggle('closed');
    dashboard.classList.toggle('open');
    log('Dashboard toggled.');
});

events.onClick(ui.fullscreenButton, function() {
    toggleFullscreen();
    log('Toggled fullscreen mode.');
});

$('ul.dropdown-menu li').on('click', function(e) {
    e.preventDefault();
    log('The time slider bounds changed.');
    $(`#${ui.timeBoundDropdown}`).html($(this).html());
    timeSlider.update();
    getHits(map, socket, true);
});

$(`#${ui.timeSlider}`).on('change', function(e) {
    log('The time slider was altered.');
    timeSlider.update();
    getHits(map, socket, true);
});

let snap = true;
events.onMouseover(ui.globeId, function() {
    ui.printMouse('IN DRONE VIEW', ui.mouseTextId);
    syncMap(map, globe, snap);
    if (snap) snap = false;
    if (!syncInterval) syncInterval = setInterval(syncMap.bind(null, map, globe, snap), 15);
});

events.onMouseout(ui.globeId, function() {
    snap = true;
    clearInterval(syncInterval);
    syncInterval = 0;
});

document.body.onload = syncMap(map, globe, true);
log('Searching for documents from elasticsearch index: ' + config.elasticSearchIndex);
log('Omniview initialized.');

let socket = io.connect('http://' + config.host + ':' + config.port.toString());
socket.on('overload', function(msg) {
    alert(msg);
});
socket.on('docs', function(resp) {
    log(resp.hits.total + ' hits.');
    // If a docs layer exists, erase it.
    if (map._omnidocslayer) {
        map.removeLayer(map._omnidocslayer);
    }
    map._omnidocslayer = getDocsLayer(resp.hits.hits);
    map.addLayer(map._omnidocslayer);
    ui.printHits(resp.hits.total, ui.hitsTextId);
});
socket.on('docs_error', function(err) {
    log('ELASTICSEARCH ERROR');
    log(err);
    ui.printHits('<b style="color: red;">ELASTICSEARCH ERROR</b>', ui.hitsTextId);
});
