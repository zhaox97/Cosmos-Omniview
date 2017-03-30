# Omniview

The Omniview. Uses [OpenLayers 4.0.1](http://openlayers.org/) and [Cesium](http://cesiumjs.org/) to render the views.

## Building

Node Package Manager (NPM) must be installed in order to run the project. [You can get it here.](https://nodejs.org/en/download/). Once it is installed, clone this project, open a terminal and change to the cloned directory and run:

`npm i`

This will install the required packages. To run the project, run:

`npm start`

You can now open a web browser and navigate to [http://localhost:8080](http://localhost:8080). You can open the `package.json` to view what libraries are installed. Notice that there is a custom field, `build`, however. This should always point to the build.sh script included in the root directory of the project. When you call `npm start`, the `index.js` script in the project root does some build steps, such as watching for file changes, webpacking the dependencies, and serving the actual Express instance. These build scripts should not be modified unless you want to change the build process.

## Structure
The application can be located in the `app/` directory. In here, we have 3 directories:
