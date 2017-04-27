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
    es = require('./lib/es'),   // Elastic search (es)
    ol = require('openlayers'),
    io = require('socket.io-client'),
    log = require('./lib/log'),
    getHits = require('./lib/map/get-hits'),
    syncMap = require('./lib/map/sync-map'),
    toggleFullscreen = require('./lib/map/toggle-fullscreen'),
    timeSlider = require('./lib/time-slider'),
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

events.onClick('to_melbourne', function() {
    globe.goTo(locations.melbourne, 4.0, map);
});

events.onClick('to_washingtondc', function() {
    globe.goTo(locations.washingtondc, 4.0, map);
});

events.onClick('to_arlington', function() {
    globe.goTo(locations.arlington, 4.0, map);
});

events.onClick('to_zero', function() {
    globe.goTo(locations.zero, 4.0, map);
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
log('Omniview initialized.');
