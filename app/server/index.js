'use strict';
const path = require('path'),
    log = require('./lib/log'),
    config = require('../../config'),
    cpuCount = 1; // require('os').cpus().length;

let clients = 0;

log('Starting...');
const express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    socket = require('socket.io').listen(server),
    writeBoundsToFile = require('./lib/write-bounds-to-file'),
    getDocuments = require('./lib/get-docs');

app.use('/', express.static(path.join(__dirname, '..', 'shared'), { extensions: ['html'] }));
server.listen(config.port, function() {
    log('Listening on port ' + config.port);
    log('Omniview ready.');
});
// Socket.io logic, listens for client events, reads latlong bounds, writes to file
socket.on('connect', function(conn) {
    clients += 1;
    log('There are now ' + clients + ' clients connected.');
    if (clients > 1) {
        conn.emit('overload', 'There seems to be a client connected ' +
            'in another window. You may want to close it.');
    }
    conn.on('mapmove', function(resp) {
        const bounds = resp.bounds,
            time = resp.time;

        log('Getting documents');
        getDocuments(config.documentCount, bounds[0], bounds[1], time)
        .then(function(resp) {
            conn.emit('docs', resp);
        })
        .catch(function(err) {
            conn.emit('docs_error', err)
        });

        writeBoundsToFile(bounds[0], bounds[1]);
        bounds[0] = bounds[0].map(function(el) {
            return el.toFixed(6);
        });
        bounds[1] = bounds[1].map(function(el) {
            return el.toFixed(6);
        });
        log('Bounds: lat(' + bounds[0] + '), long(' + bounds[1] + ')');
    });
    conn.on('disconnect', function() {
        log('Client disconnected.');
        clients -= 1;
    });
});
