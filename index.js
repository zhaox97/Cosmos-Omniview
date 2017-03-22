const chokidar = require('chokidar'),
    path = require('path'),
    spawn = require('child_process').spawn;
    log = require('./lib/log'),
    pkgJson = require('./package.json');

var p, b;
const paths = {
    client: path.join(__dirname, 'app', 'client'),
    shared: path.join(__dirname, 'app', 'shared'),
    server: path.join(__dirname, 'app', 'server'),
};

log('Watching...')

function main(args) {
    build().then(function() {
        runServer();
    });

    chokidar.watch(paths.client, {ignored: /[\/\\]\./}).on('change', function(path) {
        log('A client file changed!');
        build();
    });
    chokidar.watch(paths.shared, {ignored: /[\/\\]\./}).on('change', function(path) {
        log('A shared file changed!');
        runServer();
    });
    chokidar.watch(paths.server, {ignored: /[\/\\]\./}).on('change', function(path) {
        log('A server file changed!');
        runServer();
    });
}

// Define a function to start the server
function runServer() {
    // If we had a process before, kill it
    if (p) {
        log('Restarting server...');
        p.kill();
    }
    else log('No previous running instance found. Starting server...');
    // Create our server process. stdio option preserves console color
    p = spawn('node', [pkgJson.main]);
    while (p.stdout === null || p.stderr === null) {
        continue;
    }
    // Some stuff to write out to stdout/stderr
    p.stdout.on('data', function(data) {
        process.stdout.write(data);
    });
    p.stderr.on('data', function(data) {
        process.stdout.write(data);
    });
};

// Define a function to do some building
function build() {
    return new Promise(function(resolve, reject) {
        if (b) b.kill();
        // The build script is a simple shell script that is used
        // to run certain CLIs.
        b = spawn('sh', [pkgJson.build]);
        while (b.stdout === null || b.stderr === null) {
            continue;
        }
        // Some stuff to write out to stdout/stderr
        b.stdout.on('data', function(data) {
            process.stdout.write(data);
        });
        b.stderr.on('data', function(data) {
            process.stdout.write(data);
        });
        b.on('exit', function(code) {
            resolve(code);
        })
    });
};

main(process.argv);
