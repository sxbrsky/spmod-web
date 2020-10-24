const hapi = require('@hapi/hapi')
const http2 = require('http2')
const config = require('../config')
const Routes = require('./routes')

module.exports = async () => {
    const server = hapi.Server({
        tls: true,
        host: config.host,
        port: config.port,
        listener: http2.createSecureServer(config.ssl),
        routes: config.routes
    });

    await server.register(require('@hapi/inert'))
    for (const i in Routes) {
        server.route(Routes[i])
    }

    await server.start().catch(e => console.log(e.stack))

    return server
}