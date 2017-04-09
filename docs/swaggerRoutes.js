const path = require('path')

exports.routes = function (app) {
  app.get('/docs', function (req, res) {
    res.sendFile(path.join(__dirname, '../docs/swagger-ui/index.html'))
  })

  app.get('/docs/swagger.json', function (req, res) {
    res.sendFile(path.join(__dirname, '../docs/swagger.json'))
  })

  app.get('/swagger-ui.css', function (req, res) {
    res.sendFile(path.join(__dirname, '../docs/swagger-ui/swagger-ui.css'))
  })

  app.get('/swagger-ui-bundle.js', function (req, res) {
    res.sendFile(path.join(__dirname, '../docs/swagger-ui/swagger-ui-bundle.js'))
  })

  app.get('/swagger-ui-standalone-preset.js', function (req, res) {
    res.sendFile(path.join(__dirname, '../docs/swagger-ui/swagger-ui-standalone-preset.js'))
  })
}
