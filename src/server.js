const micro = require('micro-http')
const config = require('./config')

const server = async () => {
    const app = micro(config.ssl)

    process.on('SIGTERM', () => {
        app.close()
    })

    require('./router')(app)
    require('./store')

    app.get('/static/:path(.*)', app.static(config.path.staticPath))
    app.listen(config.port, config.host, () => {
        console.info('Server started')
    })
}

server().catch(error => console.error(`${error.message}\n${error.stack}`))


