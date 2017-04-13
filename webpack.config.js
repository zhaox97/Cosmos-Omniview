const path = require('path');

module.exports = {
    devtool: 'eval-source-map',
    context: path.join(__dirname, 'app', 'client'),
    entry: {
        index: './index.js'
    },
    output: {
        sourcePrefix: '',
        filename: '[name].bundle.js',
        path: path.join(__dirname, 'app', 'shared')
    },
    module: {
        unknownContextCritical: false,
        loaders: [
            { test: /\.css$/, loader: "style-loader!css-loader" },
            {
                test: /\.(png|gif|jpg|jpeg)$/,
                loader: 'file-loader'
            },
            { test: /Cesium\.js$/, loader: 'script-loader' }
        ]
    }
};
