const { HTTPServer } = require('http-server')
const { BuildController } = require('./controller')

const config = require('./config')

const server = new HTTPServer({
    key: config.key,
    cert: config.cert,
}, config.webRoot)

server.get('/builds', BuildController.all)
server.get('/builds/:id', BuildController.get)

server.listen(8080)
