'use strict';
const fs = require('fs'),
    log = require('./log'),
    // boundsFile = '../../bounds.json';
    boundsFile = require('../../../config').boundsFileLocation;

function writeBoundsToFile(latBounds, longBounds) {
    // Take the lat/long bounds and write it to a json file
    const opts = {
        mode: 0o644
    }, rangeJson = {
        latt: {
            gte: latBounds[0],
            lte: latBounds[1]
        },
        longt: {
            gte: longBounds[0],
            lte: longBounds[1]
        }
    };
    fs.writeFile(boundsFile,
        JSON.stringify(rangeJson),
        opts,
        function(err) {
            if (err) {
                log('There was an error when writing to file.');
                throw err;
            }
            // log('Wrote bounds to ' + boundsFile);
        }
    );
}

module.exports = writeBoundsToFile;
