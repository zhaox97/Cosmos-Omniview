'use strict';
const elasticsearch = require('elasticsearch');
module.exports = new elasticsearch.Client({
    // log: 'trace',
    host: 'localhost:9200'
});
