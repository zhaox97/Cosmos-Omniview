const chokidar = require('chokidar'),
    path = require('path'),
    spawn = require('child_process').spawn;
    log = require('./lib/log'),
    pkgJson = require('./package.json');

var p;
const paths = {
    www: path.join(__dirname, 'www')
};

log('Watching...')

function main(args) {
    runServer();
    chokidar.watch(paths.www, {ignored: /[\/\\]\./}).on('change', function(path) {
        log('A file changed!');
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

    // Some shit to write out to stdout/stderr
    p.stdout.on('data', function(data) {
        process.stdout.write(data);
    });

    p.stderr.on('data', function(data) {
        process.stdout.write(data);
    });
};

main(process.argv);
