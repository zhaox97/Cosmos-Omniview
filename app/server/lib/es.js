'use strict';
const elasticsearch = require('elasticsearch'),
    config = require('../../../config');

module.exports = new elasticsearch.Client({
    // log: 'trace',
    host: config.elasticSearchHost + ':' + config.elasticSearchPort
});
