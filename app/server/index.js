const cluster = require('cluster'),
    path = require('path'),
    log = require('../../lib/log'),
    cpuCount = 1; // require('os').cpus().length;

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
        app = express();

    app.use('/', express.static(path.join(__dirname, '..', 'client'), { extensions: ['html'] }));
    app.listen(8080, function() {
        log('Listening on port 8080.');
    });
}
