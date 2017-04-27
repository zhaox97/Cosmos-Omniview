'use strict';
const ol = require('openlayers'),
    _ = require('lodash'),
    ui = require('../../ui'),
    log = require('../log'),
    coords = require('../util/coords'),
    esQueryBody = require('./es-query-body'),
    getDocsLayer = require('./get-docs-layer'),
    es = require('../es'),
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
        socket.emit('mapmove', [latRange, longRange]);

        es.search(esQueryBody(config.documentCount, latRange, longRange), function(err, resp) {
            if (err) {
                log('ELASTICSEARCH ERROR');
                log(err);
                ui.printHits('<b style="color: red;">ELASTICSEARCH ERROR</b>', ui.hitsTextId);
            }
            else {
                log(resp.hits.total + ' hits.');
                // If a docs layer exists, erase it.
                if (map._omnidocslayer) {
                    map.removeLayer(map._omnidocslayer);
                }
                map._omnidocslayer = getDocsLayer(resp.hits.hits);
                map.addLayer(map._omnidocslayer);
                ui.printHits(resp.hits.total, ui.hitsTextId);
            }
        });
    }
}
