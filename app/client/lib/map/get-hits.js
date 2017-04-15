'use strict';
const ui = require('../../ui'),
    log = require('../log'),
    coords = require('../util/coords'),
    es = require('../es');

module.exports = getHits;

function getHits(map, socket) {
    const newView = map.getView(),
        extent = coords.mapToLongLatExtent(
            newView.calculateExtent(map.getSize())
        );

    if (!map._omnixtent || !coords.extentsEqual(extent, map._omnixtent)) {
        const latRange = (extent[3] < extent[1]) ? [extent[3], extent[1]] : [extent[1], extent[3]],
            longRange = (extent[2] < extent[0]) ? [extent[2], extent[0]] : [extent[0], extent[2]];
        map._omnixtent = extent;
        socket.emit('mapmove', [latRange, longRange]);
        es.search({
            index: 'test_index',
            body: {
                size: 10,
                query: {
                    bool: {
                        must: [
                            {range: {
                                latt: {
                                    gte: latRange[0],
                                    lte: latRange[1]
                                }
                            }},
                            {range: {
                                longt: {
                                    gte: longRange[0],
                                    lte: longRange[1]
                                }
                            }}
                        ] // must
                    } // bool
                } // query
            } // body
        }, function(err, resp) {
            if (err) {
                log('ELASTICSEARCH ERROR');
                log(err);
                ui.printHits('<b style="color: red;">ELASTICSEARCH ERROR</b>', ui.hitsTextId);
            }
            else {
                log(resp.hits.total + ' hits.');
                // for (let i = 0; i < resp.hits.hits.length; i++) {
                //     const hit = resp.hits.hits[i]._source;
                //     log(
                //         map.getPixelFromCoordinate(
                //             coords.longLatToMap([hit.longt, hit.latt])
                //         )
                //     );
                // }
                ui.printHits(resp.hits.total, ui.hitsTextId);
            }
        });
    }
}
