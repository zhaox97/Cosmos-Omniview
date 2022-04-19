# Omniview

 This is the "Omniview" feature of CHITA 2017.  It is meant to run in conjunction with the CHITA tool.  It is intended to be a users first entry point to CHITA. It provides a map, camera, and geographical bounding box on/of the data available to CHITA search.  As a user pans across different parts of the world map, available data (documents) are displayed with map markers. When a user has discovered an interesting geography and data set, the user may choose to interact with those data through the main CHITA data visualization.  Omniview must be viewed through a browser window separate from CHITA.


Uses [OpenLayers 4.0.1](http://openlayers.org/) and [Cesium](http://cesiumjs.org/) to render the views.

## Configuration

Take a look at the `config.js` file in the root directory. In here you can configure a few options.

**port**: The port number that the server will run on.

**boundsFileLocation**: The *absolute* path that the bounds.json file will be written to. This file is necessary to connect Cosmos and Omniview. Every time the map bounds change in Omniview, this file will be written with the latitude/longitude bounds formatted for elastic search.

## Building

Node Package Manager (NPM) must be installed in order to run the project. [You can get it here.](https://nodejs.org/en/download/) Once it is installed, clone this project, open a terminal and change to the cloned directory and run:

`npm i`

This will install the required packages. To run the project, run:

`npm start`

You can now open a web browser and navigate to [http://localhost:8080](http://localhost:8080). You can open the `package.json` to view what libraries are installed. Notice that there is a custom field, `build`, however. This should always point to the build.sh script included in the root directory of the project. When you call `npm start`, the `index.js` script in the project root does some build steps, such as watching for file changes, Webpacking the dependencies, and serving the actual Express instance. These build scripts should not be modified unless you want to change the build process.

## Structure
The application can be located in the `app/` directory. In here, we have 3 directories:

```
app
|- client
|- server
|- shared
```

The `client` directory is all bundled into `index.bundle.js` via Webpack. You can view the webpack configuration in `webpack.config.js`. Webpack allows us to do cool things such as `require()` so we do not have to load in required libraries in as script tags. In other words, we can simply do:

`npm install --save openlayers`

And then require it in our clientside files, which are all "compiled" into a bundle. The bundle is the actual Javascript that we embed in our HTML page via `<script>` tags. (See `app/shared/index.html`)

The `server` directory obviously hosts the Node.js server code to bootstrap the actual application. This is the code that is executed when you run `npm start`. It is here that the server listens for Socket.io events, and kicks off the actual Express app and serves our HTML.

The `shared` directory is what is served by the Express application. Everything in this directory is visible to the public via `http://localhost:8080/`. Notice that when you run `npm start`, `index.bundle.js` is built into the `shared` directory so that we can include it in our script tags.
