window.CESIUM_BASE_URL = './';
require('./cesium-build/CesiumUnminified/Cesium.js');
require('./cesium-build/Cesium/Widgets/widgets.css');
let cesium = window.Cesium;

let viewer = new cesium.Viewer('globe');
