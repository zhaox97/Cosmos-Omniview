const webpack = require('webpack'),
    path = require('path');

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
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
               // this assumes your vendor imports exist in the node_modules directory
               return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),
        new webpack.NamedModulesPlugin()
    ]
};
