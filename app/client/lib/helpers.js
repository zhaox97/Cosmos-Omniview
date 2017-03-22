function printCenter(c) {
    document.getElementById('center').innerHTML = 'Long/Lat: ' + c;
}

function printMouse(p) {
    document.getElementById('mouse').innerHTML = 'Mouse Long/Lat: ' + p;
}

function printZoom(z) {
    document.getElementById('zoom').innerHTML = 'Zoom: ' + z;
}

function getMapProjString() {
    return 'EPSG:3857';
}

function reverseCoords(coords) {
    return [coords[1], coords[0]];
}

function longLatToMap(coords) {
    return ol.proj.transform(coords, 'EPSG:4326', getMapProjString());
}

function mapToLongLat(coords) {
    return ol.proj.transform(coords, getMapProjString(), 'EPSG:4326');
}

function onClick(id, cb) {
    document.getElementById(id).onclick = cb;
}

function elastic(t) {
    return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
}
