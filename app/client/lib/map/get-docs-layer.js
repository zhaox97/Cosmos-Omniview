const ol = require('openlayers'),
    _ = require('lodash'),
    coords = require('../util/coords'),
    config = require('../../../../config');

module.exports = getDocsLayer;

function getDocsLayer(hits) {
    const features = _.map(hits, function(val) {
            const hit = val._source,
                xy = coords.longLatToMap([hit.longt, hit.latt]);
            return new ol.Feature(new ol.geom.Point(xy));
        }),
        source = new ol.source.Vector({
            features: features
        }),
        clusterSource = new ol.source.Cluster({
            distance: config.documentClusterDistance,
            source: source
        });

    let styleCache = {};
    const clusterLayer = new ol.layer.Vector({
        source: clusterSource,
        style: function(feature) {
            let size = feature.get('features').length,
                style = styleCache[size];
            if (!style) {
                let fill = '#0000ff';
                if (size > 10) fill = '#ff0000';     // Pure red
                else if (size > 7) fill = '#d39000'; // Orange
                else if (size > 4) fill = '#d1e804'; // Middle greenish-yellow
                else if (size > 2) fill = '#01c6a9'; // Turqoise
                else fill = '#186ef9'; // Blue

                style = new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: config.documentSize,
                        stroke: new ol.style.Stroke({
                            color: '#ffffff'
                        }),
                        fill: new ol.style.Fill({
                            color: fill
                        })
                    }),
                    text: new ol.style.Text({
                        text: size.toString(),
                        fill: new ol.style.Fill({
                            color: '#ffffff'
                        })
                    })
                });
                styleCache[size] = style;
            }
            return style;
        }
    });
    return clusterLayer;
}
