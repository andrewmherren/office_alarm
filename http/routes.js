'use strict'
// import controllers
const alarmController = require('./controllers/alarmController')

// export the routing function for use by server.js
exports.routes = function (app) {
  /**
  * Alaram routes
  */
  app.post('/api/alarm', alarmController.post)
}
