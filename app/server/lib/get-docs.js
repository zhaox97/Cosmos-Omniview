'use strict';
const Promise = require('bluebird'),
    log = require('./log'),
    es = require('./es'),
    esQueryBody = require('./es-query-body');

function getDocuments(documentCount, latRange, longRange, timeQuery) {
    return new Promise(function(resolve, reject) {
        es.search(esQueryBody(documentCount, latRange, longRange, timeQuery), function(err, resp) {
            if (err)
                reject(err);
            else
                resolve(resp);
        });
    });
}

module.exports = getDocuments;
