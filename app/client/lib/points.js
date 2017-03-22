function canvasFun(extent, resolution, pixelRatio, size, projection) {
    var cWidth = size[0],
        cHeight = size[1];

    var canvas = d3.select(
            document.createElement('canvas')
        )
        .attr('width', cWidth)
        .attr('height', cHeight);

    var context = canvas.node().getContext('2d');
}
