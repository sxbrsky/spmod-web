const https = require('http')
const app = require('./app')
const config = require('./config')
const store = require('./store')

const server = https.createServer(app)
server.listen(config.port)

server.on('listening', () => {
    store.init(config.buildsDir, config.maxBuildsOnPage)
    console.info('Server started')
})

server.on('error', error => {
    console.error(error)
})

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('HTTP Server closed.')
    })
})
