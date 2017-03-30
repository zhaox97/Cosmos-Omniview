// Require Cesium-specific stuff to get it working with Webpack //
window.CESIUM_BASE_URL = './lib/Cesium';
require('./cesium-build/Cesium/Cesium.js');
require('./cesium-build/Cesium/Widgets/widgets.css');
const Cesium = window.Cesium;
// End //

const locations = require('./locations'),
    coords = require('./coords'),
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
        viewer.scene.screenSpaceCameraController.minimumZoomDistance = 900;

        let center = Cesium.Cartesian3.fromDegrees(location[0], location[1], 900);
        viewer.camera.flyTo({
            destination: center,
            duration: 0
        });

        return viewer;
    },
    sync: function(map) {
        const s = function() {
            let rect = viewer.camera.computeViewRectangle(),
            extent = ol.extent.boundingExtent([
                [coords.radToDeg(rect.west), coords.radToDeg(rect.south)],
                [coords.radToDeg(rect.east), coords.radToDeg(rect.north)]
            ]);
            map.getView().fit(
                ol.proj.transformExtent(
                    extent,
                    'EPSG:4326',
                    coords.getMapProjString()
                )
            );
        };
        document.getElementById(viewerId).addEventListener('mouseover', function() {
            if (!interval) interval = setInterval(s, 15);
        });
        document.getElementById(viewerId).addEventListener('mouseout', function() {
            clearInterval(interval);
            interval = 0;
        });
    }
}
