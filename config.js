module.exports = {
    // Where the bounds.json file should be written
    boundsFileLocation: '/home/kkworden/Desktop/bounds.json',
    // How many documents should appear on the map at once?
    documentCount: 1000,
    // How large documents should appear on the map (>20 is a really large)!
    documentSize: 14,
    // Cluster documents within this distance
    documentClusterDistance: 50,
    // When the user moves their mouse out of the map, how fast should they zoom back in?
    snapDuration: 500,
    // What port the server should be hosted on
    port: 8080,
    elasticSearchHost: 'localhost',
    elasticSearchPort: '9200'
};
