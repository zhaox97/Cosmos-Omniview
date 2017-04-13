# Omniview

The Omniview. Uses [OpenLayers 4.0.1](http://openlayers.org/) and [Cesium](http://cesiumjs.org/) to render the views.

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
