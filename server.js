'use strict'

const swaggerRoutes = require('./docs/swaggerRoutes').routes
const routes = require('./http/routes').routes
const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const app = express()

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain)

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())

// export the path to the script directory for use elsewhere in the app
global.scriptDir = path.join(__dirname, 'shell_scripts')

// initialize the routing function (see http/routes.js)
routes(app)
// initialize the swagger documentation routes
swaggerRoutes(app)

// Tell the server to listen to port 3000
app.listen(3000)
console.log('Listening on port http://localhost:3000...')
