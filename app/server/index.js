'use strict';
const cluster = require('cluster'),
    path = require('path'),
    log = require('./lib/log'),
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
    server.listen(8080, function() {
        log('Listening on port 8080.');
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
            log('Got bounds from client.');
            writeBoundsToFile(bounds[0], bounds[1]);
        });
        conn.on('disconnect', function() {
            log('Client disconnected.');
            clients -= 1;
        });
    });
}
