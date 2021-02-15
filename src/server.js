const micro = require('micro-http')
const config = require('./config')

const server = async () => {
    const app = micro(config.options)

    require('./router')(app)
    require('./store')

    app.use(micro.cors())
    app.use(micro.static({ path: config.path.staticPath, prefix: '/static' }))
    app.use(micro.static({ path: config.path.buildPath, prefix: '/build' }))

    app.listen(config.port, config.host, () => {
        console.info('Server started')
    })

    process.on('SIGTERM', () => {
        app.close(() => {
            console.log('HTTP Server closed.')
        })
    })
}

server().catch(error => console.error(`${error.message}\n${error.stack}`))


