// Require Cesium-specific stuff to get it working with Webpack //
window.CESIUM_BASE_URL = './lib/Cesium';
require('./cesium-build/Cesium/Cesium.js');
require('./cesium-build/Cesium/Widgets/widgets.css');
const Cesium = window.Cesium;
// End //

const locations = require('./locations'),
    coords = require('./coords'),
    ui = require('./ui'),
    ol = require('openlayers');

let viewerId, viewer, interval = 0;

module.exports = {
    init: function(id, location) {
        viewerId = id;
        viewer = new Cesium.Viewer(id, {
            imageryProvider: new Cesium.BingMapsImageryProvider({
                url: '//dev.virtualearth.net'
            }),
            animation: false,
            baseLayerPicker: false,
            vrButton: false,
            timeline: false,
            geocoder: false,
            homeButton: false,
            infoBox: false,
            navigationHelpButton: false,
            sceneModePicker: false,
            selectionIndicator: false,
            clock: null
        });

        viewer.scene.screenSpaceCameraController.inertiaSpin = 0;
        viewer.scene.screenSpaceCameraController.inertiaTranslate = 0;
        viewer.scene.screenSpaceCameraController.inertiaZoom = 0;
        viewer.scene.screenSpaceCameraController.minimumZoomDistance = 200;
        viewer.scene.screenSpaceCameraController.maximumZoomDistance = 800;

        let center = Cesium.Cartesian3.fromDegrees(location[0], location[1], 800);
        viewer.camera.flyTo({
            destination: center,
            duration: 0
        });

        return viewer;
    },
    sync: function(map) {
        const s = function() {
            const rect = viewer.camera.computeViewRectangle(),
                b1 = [coords.radToDeg(rect.west), coords.radToDeg(rect.south)],
                b2 = [coords.radToDeg(rect.east), coords.radToDeg(rect.north)],
                extent = ol.extent.boundingExtent([
                    b1,
                    b2
                ]);
            map.getView().fit(
                ol.proj.transformExtent(
                    extent,
                    'EPSG:4326',
                    coords.getMapProjString()
                )
            );
            ui.printBounds(b1, b2, ui.boundsTextId);
        };
        document.getElementById(viewerId).addEventListener('mouseover', function() {
            if (!interval) interval = setInterval(s, 50);
        });
        document.getElementById(viewerId).addEventListener('mouseout', function() {
            clearInterval(interval);
            interval = 0;
        });
    }
}
