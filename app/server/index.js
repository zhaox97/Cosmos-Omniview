'use strict';
const cluster = require('cluster'),
    path = require('path'),
    log = require('./lib/log'),
    config = require('../../config'),
    cpuCount = 1; // require('os').cpus().length;

let clients = 0;

if (cluster.isMaster) {
    for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
    }

    cluster.on('exit', function() {
        log('Worker thread died. Restarting...');
        cluster.fork();
    });
}
else {
    log('Forked new process.');
    const express = require('express'),
        app = express(),
        server = require('http').createServer(app),
        socket = require('socket.io').listen(server),
        writeBoundsToFile = require('./lib/write-bounds-to-file');

    app.use('/', express.static(path.join(__dirname, '..', 'shared'), { extensions: ['html'] }));
    server.listen(config.port, function() {
        log('Listening on port ' + config.port);
    });
    // Socket.io logic, listens for client events, reads latlong bounds, writes to file
    socket.on('connect', function(conn) {
        clients += 1;
        log('There are now ' + clients + ' clients connected.');
        if (clients > 1) {
            conn.emit('overload', 'There seems to be a client connected ' +
                'in another window. You may want to close it.');
        }
        conn.on('mapmove', function(bounds) {
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
}
